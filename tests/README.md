# Role-management browser checks

Run these commands from `hvac-attendance/`. Use a separate terminal for each long-running process:

```sh
npm run build
npm run start -- --port 3107
```

Start a separate headless Chrome profile with a local debugging port:

```sh
google-chrome --headless --disable-gpu --remote-debugging-port=9333 --user-data-dir=/tmp/hrms-roles-test about:blank
```

Then run:

```sh
node tests/roles-browser.mjs http://127.0.0.1:3107 http://127.0.0.1:9333
```

The test uses Chrome DevTools Protocol through Node's built-in WebSocket (Node 22 used for verification). It intercepts every API request with synthetic company/account data and blocks other external requests. No real credentials, notification delivery or working database mutations are required. It closes its browser tab when finished; stop the test server and separate Chrome process afterward.

Coverage: create a role, assign it, inspect effective permissions, cancel and confirm revocation, read-only role access, read-only settings with accessible category tabs, denied access, empty lists, failed-list retry, selected-company requests, mobile layout, and leave approval by a non-admin with an explicit grant. API integration tests separately verify real persistence and authorization on a disposable schema.

Run `tsc --noEmit --incremental false` after the build finishes, not concurrently: Next recreates generated type files during build. The project currently has unrelated type errors, and production builds skip type/lint failures.
