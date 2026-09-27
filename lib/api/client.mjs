import axios from "axios";

export function createApiClient(constants) {
  const primaryURL = constants.HVAC_PRO_API;
  const fallbackURL = constants.HVAC_FALLBACK_API;
  const normalize = (url) => url?.replace(/\/+$/, "");
  const storageKey = `hvac-api-fallback:${normalize(primaryURL)}:${normalize(fallbackURL)}`;
  let fallbackUntil = 0;

  function getFallbackUntil() {
    try {
      if (typeof window !== "undefined") {
        const stored = Number(window.localStorage.getItem(storageKey));
        if (Number.isFinite(stored)) fallbackUntil = Math.max(fallbackUntil, stored);
      }
    } catch {
      // Continue with in-memory state when browser storage is unavailable.
    }
    return fallbackUntil;
  }

  function activateFallback() {
    // Concurrent failures must not continually extend an already active window.
    if (getFallbackUntil() > Date.now()) return;
    fallbackUntil = Date.now() + constants.HVAC_API_FALLBACK_HOURS * 60 * 60 * 1000;
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, String(fallbackUntil));
      }
    } catch {
      // Requests still fail over if storage is blocked or full.
    }
  }

  const client = axios.create({
    headers: { "Content-Type": "application/json" },
    baseURL: primaryURL,
    timeout: constants.HVAC_API_TIMEOUT_MS,
  });
  const adapter = axios.getAdapter(client.defaults.adapter);

  // Retry at the transport layer so auth/error interceptors run only once,
  // against the final response. The already transformed payload is preserved.
  client.defaults.adapter = async (config) => {
    const isPrimaryRequest = normalize(config.baseURL) === normalize(primaryURL)
      && !/^([a-z][a-z\d+.-]*:)?\/\//i.test(config.url || "");
    const canFailOver = isPrimaryRequest && fallbackURL
      && normalize(fallbackURL) !== normalize(primaryURL);

    if (canFailOver && getFallbackUntil() > Date.now()) {
      return adapter({ ...config, baseURL: fallbackURL });
    }

    try {
      return await adapter(config);
    } catch (error) {
      const unavailable = error.response?.status >= 500
        || (!error.response && ["ERR_NETWORK", "ECONNABORTED", "ETIMEDOUT",
          "ECONNREFUSED", "ECONNRESET", "ENOTFOUND", "EAI_AGAIN"].includes(error.code));
      if (!canFailOver || !unavailable || axios.isCancel(error) || config.signal?.aborted) {
        throw error;
      }
      activateFallback();
      return adapter({ ...config, baseURL: fallbackURL });
    }
  };

  return client;
}
