// Browser UI regression against fixture API responses; never sends API calls to
// the configured working/production backend. Start Next and headless Chrome first.
import assert from 'node:assert/strict';
const site = process.argv[2] || 'http://127.0.0.1:3107';
const debuggerUrl = process.argv[3] || 'http://127.0.0.1:9333';
for (const value of [site, debuggerUrl]) if (!['127.0.0.1', 'localhost'].includes(new URL(value).hostname)) throw Error('Browser tests require local servers');
const target = await (await fetch(`${debuggerUrl}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0, scenario = 'admin', failLists = false, sourceId;
const calls = new Map(), pending = new Map(), errors = [];
const permissions = ['settings.view', 'settings.manage', 'access.view', 'access.manage'];
let roles, assignments, leaveStatus = 'PENDING', lastDecision;
function reset() {
  roles = [{ id: 'role-admin', name: 'Administrator', code: 'administrator', permissions }];
  assignments = [];
}
reset();
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    ws.send(JSON.stringify({ id: requestId, method, params }));
  });
}
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
};
const waitFor = async (expression, label) => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(`document.body && (${expression})`)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw Error(`Timed out: ${label}`);
};
async function fulfill(event, status, value) {
  return send('Fetch.fulfillRequest', { requestId: event.requestId, responseCode: status,
    responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Access-Control-Allow-Origin', value: site }, { name: 'Access-Control-Allow-Headers', value: '*' }, { name: 'Access-Control-Allow-Methods', value: 'GET,POST,DELETE,PUT,OPTIONS' }],
    body: Buffer.from(status === 204 ? '' : JSON.stringify(value)).toString('base64') });
}
async function intercept(event) {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) {
    if (event.request.method === 'OPTIONS') return fulfill(event, 204, null);
    const path = url.pathname.replace(/\/$/, '');
    calls.set(path, (calls.get(path) || 0) + 1);
    const headers = event.request.headers;
    const companyId = headers['X-Company-Id'] || headers['x-company-id'] || 'company-a';
    if (path.endsWith('/access/me')) return fulfill(event, 200, { data: { companyId, companyName: companyId === 'company-b' ? 'Fixture Company B' : 'Fixture Company A', permissions: scenario === 'applicant' ? [] : scenario === 'approver' ? ['leave.approve'] : scenario === 'denied' ? [] : scenario === 'viewer' ? ['access.view', 'settings.view'] : permissions } });
    if (path.endsWith('/settings')) return fulfill(event, 200, { data: { companyId, revision: 1, settings: { company: { name: 'Fixture Company', industry: 'IT', email: '', phone: '', address: '' }, attendance: { timezone: 'UTC', startTime: '09:00', endTime: '17:00', workDays: [1,2,3,4,5], requiredHours: 8, halfDayHours: 4, graceMinutes: 0, breakMinutes: 0, overtimeEnabled: true, overtimeAfterHours: 8, allowNonWorkingDays: false, allowEarlyCheckout: true, requirePhoto: false, locationEnabled: false, geofencingEnabled: false, geofenceRadius: 100 } } } });
    if (path.endsWith('/leave-request/leave-fixture/admin')) {
      lastDecision = JSON.parse(event.request.postData); leaveStatus = lastDecision.status;
      return fulfill(event, 200, {});
    }
    if (path.endsWith('/leave-request')) return fulfill(event, 201, [{ id: 'leave-fixture', userId: scenario === 'applicant' ? 'browser-applicant' : 'other-user', fullName: 'Leave Applicant', firstName: 'Leave', lastName: 'Applicant', email: 'leave@example.test', isActive: true, leaveType: 'CASUAL', startDate: '2026-10-01', endDate: '2026-10-02', days: 2, reason: 'Fixture leave', status: leaveStatus, remarks: '' }]);
    if (failLists) return fulfill(event, 400, { error: 'Fixture list failure' });
    if (path.endsWith('/access/permissions')) return fulfill(event, 200, { data: permissions });
    if (path.endsWith('/access/roles')) {
      if (event.request.method === 'POST') {
        const role = { id: 'role-custom', ...JSON.parse(event.request.postData) };
        roles.push(role); return fulfill(event, 201, { data: role });
      }
      return fulfill(event, 200, { data: scenario === 'empty' ? [] : roles, meta: { pages: 1, total: roles.length } });
    }
    if (path.endsWith('/access/memberships/member-1/roles')) {
      const { roleId } = JSON.parse(event.request.postData);
      assignments = [{ assignmentId: 'assignment-1', roleId, name: roles.find(role => role.id === roleId).name }];
      return fulfill(event, 201, { data: { id: 'assignment-1' } });
    }
    if (path.endsWith('/access/assignments/assignment-1')) { assignments = []; return fulfill(event, 204, null); }
    if (path.endsWith('/access/memberships')) return fulfill(event, 200, { data: scenario === 'empty' ? [] : [{ id: 'member-1', isActive: true, user: { id: 'staff-1', firstName: 'Staff', lastName: 'Fixture', email: 'staff@example.test', isActive: true }, roles: assignments, permissions: assignments.flatMap(item => roles.find(role => role.id === item.roleId).permissions) }], meta: { pages: 1, total: scenario === 'empty' ? 0 : 1 } });
    return fulfill(event, 404, { error: 'Unmocked API route' });
  }
  if (url.origin === site || url.protocol === 'data:' || url.protocol === 'about:') return send('Fetch.continueRequest', { requestId: event.requestId });
  return send('Fetch.failRequest', { requestId: event.requestId, errorReason: 'BlockedByClient' });
}
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const request = pending.get(message.id); pending.delete(message.id);
    if (message.error) request?.reject(Error(message.error.message)); else request?.resolve(message.result);
  } else if (message.method === 'Fetch.requestPaused') intercept(message.params).catch(error => errors.push(error.message));
});
await send('Page.enable'); await send('Network.enable');
await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
async function navigate(next, query = '', path = '/admin/roles') {
  scenario = next; calls.clear();
  if (sourceId) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: sourceId });
  const user = { id: `browser-${next}`, role: ['approver', 'applicant'].includes(next) ? 'employee' : query ? 'superAdmin' : 'admin', companyId: 'company-a', firstName: 'Browser', lastName: 'Fixture', email: 'browser@example.test' };
  const token = { access_token: 'fixture-only' };
  const source = `localStorage.clear(); localStorage.setItem('user', btoa(${JSON.stringify(JSON.stringify(user))})); localStorage.setItem('token', btoa(${JSON.stringify(JSON.stringify(token))}));`;
  sourceId = (await send('Page.addScriptToEvaluateOnNewDocument', { source })).identifier;
  await send('Network.setCookies', { cookies: [{ name: 'token', value: encodeURIComponent(JSON.stringify(token)), url: site }, { name: 'userInfo', value: encodeURIComponent(JSON.stringify(user)), url: site }] });
  await send('Page.navigate', { url: site + path + query });
  await waitFor(`document.body.innerText.includes(${JSON.stringify(next === 'denied' ? 'You do not have permission' : path.endsWith('/leave-request') ? 'Leave Management' : path.endsWith('/settings') ? 'System Settings' : 'Roles & permissions')})`, next);
}
const clickText = text => evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)}).click()`);
const setInput = (selector, value) => evaluate(`(()=>{const node=document.querySelector(${JSON.stringify(selector)}); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(node,${JSON.stringify(value)}); node.dispatchEvent(new Event('input',{bubbles:true}));})()`);
try {
  await navigate('admin');
  await waitFor("document.body.innerText.includes('Staff Fixture')", 'members');
  assert.equal(await evaluate("[...document.querySelectorAll('h1')].filter(h=>h.textContent==='Roles & permissions').length"), 1, 'Page should mount once');
  await setInput('#role-name', 'Settings Reviewer'); await setInput('#role-code', 'settings-reviewer');
  await evaluate("[...document.querySelectorAll('label')].find(l=>l.textContent==='settings.view').querySelector('input').click()");
  await clickText('Create role');
  await waitFor("document.body.innerText.includes('Role created.') && !!document.querySelector('#assign-member-1 option[value=role-custom]') && !document.querySelector('#assign-member-1').disabled", 'create success');
  await evaluate("(()=>{const s=document.querySelector('#assign-member-1');s.value='role-custom';s.dispatchEvent(new Event('change',{bubbles:true}));})()");
  await waitFor("[...document.querySelectorAll('button')].some(b=>b.textContent==='Assign role' && !b.disabled)", 'assignment ready');
  await clickText('Assign role'); await waitFor("document.body.innerText.includes('Role assigned.')", 'assign success');
  await waitFor("document.body.innerText.includes('Effective permissions: settings.view')", 'effective permissions');
  await clickText('Revoke'); await waitFor("!!document.querySelector('[role=alertdialog]')", 'confirmation');
  await clickText('Cancel'); assert.equal(assignments.length, 1);
  await clickText('Revoke'); await clickText('Confirm revoke');
  await waitFor("document.body.innerText.includes('Role revoked.')", 'revoke success');
  assert.equal(assignments.length, 0);
  await navigate('viewer'); await waitFor("document.body.innerText.includes('read-only access')", 'read only');
  assert.equal(await evaluate("!!document.querySelector('#role-name')"), false);
  await navigate('viewer', '', '/admin/settings');
  await waitFor("document.body.innerText.includes('read-only access to settings')", 'read-only settings');
  assert.equal(await evaluate("document.querySelector('#name').matches(':disabled')"), true);
  await evaluate("[...document.querySelectorAll('[role=tab]')].find(b=>b.textContent==='Schedule').dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0}))");
  await waitFor("!!document.querySelector('#timezone')", 'read-only schedule tab');
  assert.equal(await evaluate("document.querySelector('#timezone').matches(':disabled')"), true);
  await navigate('denied'); assert.equal(calls.has('/api/v1/access/memberships'), false);
  await navigate('empty'); await waitFor("document.body.innerText.includes('No members on this page.')", 'empty');
  failLists = true; await navigate('admin'); await waitFor("document.body.innerText.includes('Fixture list failure')", 'error');
  failLists = false; await clickText('Retry lists'); await waitFor("document.body.innerText.includes('Staff Fixture')", 'retry');
  await navigate('approver', '', '/employee/leave-request');
  await waitFor("[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='Approve' && !b.disabled)", 'custom approver');
  await evaluate("(()=>{const node=document.querySelector('textarea[name=remarks]');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(node,'Reviewed');node.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await clickText('Approve');
  await waitFor("document.body.innerText.includes('APPROVED')", 'leave decision');
  assert.equal(lastDecision.status, 'APPROVED'); assert.equal(lastDecision.remarks, 'Reviewed');
  await navigate('applicant', '', '/employee/leave-request');
  await waitFor("document.body.innerText.includes('Fixture leave')", 'applicant own leave');
  assert.equal(await evaluate("[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='Approve')"), false);
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate('admin', '?companyId=company-b');
  await waitFor("document.body.innerText.includes('Company: Fixture Company B') && document.body.innerText.includes('Staff Fixture')", 'company selection/mobile');
  assert.equal(await evaluate("document.querySelectorAll('h1').length"), 2); // Mobile brand heading plus page heading.
  assert.equal(await evaluate("document.documentElement.scrollWidth <= window.innerWidth"), true, 'No horizontal page overflow');
  assert.deepEqual(errors, []);
  console.log('Browser checks passed: create, assign, effective permissions, cancel/revoke, read-only, denied, empty, retry, company selection, mobile, custom leave approver and applicant.');
} finally {
  await send('Page.close'); ws.close();
}
