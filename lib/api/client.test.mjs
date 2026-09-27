import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { test } from "node:test";
import { createApiClient } from "./client.mjs";

test("API failover", async (t) => {
  let primaryStatus = 200;
  let primaryMode = "response";
  let fallbackStatus = 200;
  const requests = [];
  const storage = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
  };
  const servers = [];
  t.after(() => {
    delete globalThis.window;
    for (const server of servers) {
      server.closeAllConnections();
      server.close();
    }
  });

  async function start(name) {
    const server = createServer(async (req, res) => {
      let body = "";
      for await (const chunk of req) body += chunk;
      requests.push({ name, url: req.url, method: req.method, body, auth: req.headers.authorization });
      if (name === "primary" && primaryMode === "timeout") return;
      if (name === "primary" && primaryMode === "disconnect") return req.socket.destroy();
      res.writeHead(name === "primary" ? primaryStatus : fallbackStatus, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ name }));
    });
    servers.push(server);
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    return `http://127.0.0.1:${server.address().port}/api/v1`;
  }

  const constants = {
    HVAC_PRO_API: await start("primary"),
    HVAC_FALLBACK_API: await start("fallback"),
    HVAC_API_FALLBACK_HOURS: 2,
    HVAC_API_TIMEOUT_MS: 100,
  };
  function reset() {
    requests.length = 0;
    storage.clear();
    primaryStatus = 200;
    fallbackStatus = 200;
    primaryMode = "response";
    return createApiClient(constants);
  }

  await t.test("healthy primary and request contract are preserved", async () => {
    const client = reset();
    assert.equal((await client.get("/attendance")).data.name, "primary");
    assert.equal(requests.length, 1);
    primaryStatus = 503;
    let responses = 0;
    client.interceptors.response.use((response) => { responses++; return response; });
    const result = await client.post("/user/login", { email: "test@example.invalid" }, {
      params: { example: "yes" }, headers: { Authorization: "Bearer test-token" },
    });
    assert.equal(result.data.name, "fallback");
    assert.equal(responses, 1);
    assert.deepEqual(requests[2], { ...requests[1], name: "fallback" });
    assert.equal(requests[2].url, "/api/v1/user/login?example=yes");
    assert.equal(requests[2].body, JSON.stringify({ email: "test@example.invalid" }));
    const expiry = Number([...storage.values()][0]);
    assert.ok(Math.abs(expiry - Date.now() - 2 * 60 * 60 * 1000) < 2000);
    await client.get("/attendance");
    await createApiClient(constants).get("/attendance");
    assert.deepEqual(requests.slice(3).map((r) => r.name), ["fallback", "fallback"]);
  });

  await t.test("expiry returns to primary without a reload", async () => {
    const client = reset();
    const realNow = Date.now;
    try {
      primaryStatus = 502;
      await client.get("/attendance");
      primaryStatus = 200;
      Date.now = () => realNow() + 3 * 60 * 60 * 1000;
      assert.equal((await client.get("/attendance")).data.name, "primary");
    } finally {
      Date.now = realNow;
    }
  });

  for (const mode of ["timeout", "disconnect"]) {
    await t.test(`${mode} retries on fallback`, async () => {
      const client = reset();
      primaryMode = mode;
      assert.equal((await client.get("/attendance")).data.name, "fallback");
      assert.deepEqual(requests.map((r) => r.name), ["primary", "fallback"]);
    });
  }

  for (const status of [400, 401, 403, 404, 422, 429]) {
    await t.test(`${status} does not switch endpoints`, async () => {
      const client = reset();
      primaryStatus = status;
      await assert.rejects(client.get("/attendance"), (error) => error.response.status === status);
      assert.equal(requests.length, 1);
      assert.equal(storage.size, 0);
    });
  }

  await t.test("fallback errors propagate once without a retry loop", async () => {
    const client = reset();
    primaryStatus = fallbackStatus = 503;
    let errors = 0;
    client.interceptors.response.use(undefined, (error) => { errors++; throw error; });
    await assert.rejects(client.get("/attendance"));
    assert.equal(errors, 1);
    assert.deepEqual(requests.map((r) => r.name), ["primary", "fallback"]);
  });

  await t.test("cancelled requests and absolute URLs do not activate fallback", async () => {
    const client = reset();
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(client.get("/attendance", { signal: controller.signal }), { code: "ERR_CANCELED" });
    assert.equal(requests.length, 0);
    primaryStatus = 503;
    await assert.rejects(client.get(`${constants.HVAC_PRO_API}/attendance`));
    assert.equal(requests.length, 1);
    assert.equal(storage.size, 0);
  });

  await t.test("unavailable storage retains fallback in memory", async () => {
    const client = reset();
    const originalSetItem = window.localStorage.setItem;
    window.localStorage.setItem = () => { throw new Error("Storage unavailable"); };
    try {
      primaryStatus = 500;
      await client.get("/attendance");
      await client.get("/attendance");
      assert.deepEqual(requests.map((r) => r.name), ["primary", "fallback", "fallback"]);
    } finally {
      window.localStorage.setItem = originalSetItem;
    }
  });
});
