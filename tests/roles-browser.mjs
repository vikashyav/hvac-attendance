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
let taskRows = [], taskWrites = [], taskSaveStatus = 200, taskRevoked = false;
let holdProjectPermissions = false, heldPermissionRequests = [];
let projectRows = [], projectWrites = [], projectSaveStatus = 200, projectRevoked = false, projectPermissionsFail = false;
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
    if (path.endsWith('/access/me') && holdProjectPermissions) { heldPermissionRequests.push(event); return; }
    if (path.endsWith('/access/me') && projectPermissionsFail) return fulfill(event, 400, { error: 'Fixture permission failure' });
    if (path.endsWith('/access/me')) return fulfill(event, 200, { data: { companyId, companyName: companyId === 'company-b' ? 'Fixture Company B' : 'Fixture Company A', permissions: scenario === 'task-manager' ? (taskRevoked ? [] : ['task.manage']) : scenario === 'task-viewer' ? [] : scenario === 'project-manager' ? (projectRevoked ? [] : ['project.manage']) : scenario === 'project-viewer' ? [] : scenario === 'applicant' ? [] : scenario === 'approver' ? ['leave.approve'] : scenario === 'denied' ? [] : scenario === 'viewer' ? ['access.view', 'settings.view'] : permissions } });
    if (path.endsWith('/settings')) return fulfill(event, 200, { data: { companyId, revision: 1, settings: { company: { name: 'Fixture Company', industry: 'IT', email: '', phone: '', address: '' }, attendance: { timezone: 'UTC', startTime: '09:00', endTime: '17:00', workDays: [1,2,3,4,5], requiredHours: 8, halfDayHours: 4, graceMinutes: 0, breakMinutes: 0, overtimeEnabled: true, overtimeAfterHours: 8, allowNonWorkingDays: false, allowEarlyCheckout: true, requirePhoto: false, locationEnabled: false, geofencingEnabled: false, geofenceRadius: 100 } } } });
    if (path.endsWith('/leave-request/leave-fixture/admin')) {
      lastDecision = JSON.parse(event.request.postData); leaveStatus = lastDecision.status;
      return fulfill(event, 200, {});
    }
    if (path.endsWith('/leave-request')) return fulfill(event, 201, [{ id: 'leave-fixture', userId: scenario === 'applicant' ? 'browser-applicant' : 'other-user', fullName: 'Leave Applicant', firstName: 'Leave', lastName: 'Applicant', email: 'leave@example.test', isActive: true, leaveType: 'CASUAL', startDate: '2026-10-01', endDate: '2026-10-02', days: 2, reason: 'Fixture leave', status: leaveStatus, remarks: '' }]);
    if (path.includes('/schedule_tasks-manage')) {
      if (event.request.method === 'GET') {
        if (failLists) return fulfill(event, 400, { error: 'Fixture task failure' });
        const task = taskRows.find(row => path.endsWith('/' + row.id));
        return fulfill(event, 200, path.endsWith('/schedule_tasks-manage') ? taskRows : task ? { ...task, subTasks: taskRows.filter(row => row.parentId === task.id) } : null);
      }
      const body = JSON.parse(event.request.postData);
      taskWrites.push({ method: event.request.method, body });
      if (taskSaveStatus !== 200) return fulfill(event, taskSaveStatus, { error: 'Fixture task save denied' });
      if (event.request.method === 'POST') taskRows.push({ ...body, id: `task-${taskRows.length + 1}`, subTasks: [] });
      else taskRows = taskRows.map(row => path.endsWith('/' + row.id) ? { ...row, ...body } : row);
      return fulfill(event, 200, {});
    }
    if (path.endsWith('/employees')) return fulfill(event, 200, { data: [] });
    if (path.endsWith('/projects-sites') && event.request.method === 'GET') return fulfill(event, failLists ? 400 : 201, failLists ? { error: 'Fixture list failure' } : projectRows);
    if (path.includes('/projects-sites') && ['POST', 'PUT'].includes(event.request.method)) {
      const body = JSON.parse(event.request.postData);
      projectWrites.push({ method: event.request.method, body });
      if (projectSaveStatus !== 200) return fulfill(event, projectSaveStatus, { error: 'Fixture save denied' });
      if (event.request.method === 'POST') projectRows.push({ ...body, id: 'project-new', status: 'active' });
      else projectRows = projectRows.map(row => path.endsWith('/' + row.id) ? { ...row, ...body } : row);
      return fulfill(event, 200, {});
    }
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
  const user = { id: `browser-${next}`, role: ['approver', 'applicant', 'project-manager', 'task-manager'].includes(next) ? 'employee' : query ? 'superAdmin' : 'admin', companyId: 'company-a', firstName: 'Browser', lastName: 'Fixture', email: 'browser@example.test' };
  const token = { access_token: 'fixture-only' };
  const source = `localStorage.clear(); localStorage.setItem('user', btoa(${JSON.stringify(JSON.stringify(user))})); localStorage.setItem('token', btoa(${JSON.stringify(JSON.stringify(token))}));`;
  sourceId = (await send('Page.addScriptToEvaluateOnNewDocument', { source })).identifier;
  await send('Network.setCookies', { cookies: [{ name: 'token', value: encodeURIComponent(JSON.stringify(token)), url: site }, { name: 'userInfo', value: encodeURIComponent(JSON.stringify(user)), url: site }] });
  await send('Page.navigate', { url: site + path + query });
  await waitFor(`document.body.innerText.includes(${JSON.stringify(next === 'denied' ? 'You do not have permission' : path === '/admin/task-manage' ? 'Calendar & Scheduling' : path.startsWith('/admin/task-manage/') ? 'Schedule/Task' : path.endsWith('/projects-sites') ? 'Projects / Sites' : path.endsWith('/leave-request') ? 'Leave Management' : path.endsWith('/settings') ? 'System Settings' : 'Roles & permissions')})`, next);
}
const clickText = text => evaluate(`[...document.querySelectorAll('button')].find(b=>b.getClientRects().length && b.textContent.trim()===${JSON.stringify(text)}).click()`);
const setInput = (selector, value) => evaluate(`(()=>{const node=document.querySelector(${JSON.stringify(selector)}); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(node,${JSON.stringify(value)}); node.dispatchEvent(new Event('input',{bubbles:true}));})()`);
try {
  await navigate('admin');
  await waitFor("document.body.innerText.includes('Staff Fixture')", 'members');
  assert.equal(await evaluate("document.querySelectorAll('nav a[href=\"/admin/roles\"]').length"), 1, 'Desktop sidebar renders once');
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
  assert.equal(await evaluate("document.querySelectorAll('nav a[href=\"/employee/leave-request\"]').length"), 1, 'Employee sidebar renders once');
  assert.equal(await evaluate("!!document.querySelector('nav a[href=\"/admin/projects-sites\"]')"), false, 'Ordinary employee has no project-management link');
  assert.equal(await evaluate("[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='Approve')"), false);
  projectRows = [{ id: 'project-fixture', name: 'Fixture Site', address: 'Fixture address', clientName: 'Fixture Client', status: 'active', startDate: '2026-10-01', endDate: '2026-10-30', latitude: '20', longitude: '70', clientContact: {} }];
  holdProjectPermissions = true;
  await navigate('project-manager', '', '/admin/projects-sites');
  await waitFor("document.body.innerText.includes('Checking editing permissions') && document.body.innerText.includes('Fixture Site')", 'project permission loading');
  assert.equal(await evaluate("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Add Projects/Site'))"), false);
  holdProjectPermissions = false;
  for (const event of heldPermissionRequests) await fulfill(event, 200, { data: { permissions: ['project.manage'] } });
  heldPermissionRequests = [];
  await waitFor("!!document.querySelector('button[aria-label=\"Edit Fixture Site\"]')", 'project permissions loaded');
  assert.equal(await evaluate("!!document.querySelector('nav a[href=\"/admin/projects-sites\"]')"), true, 'Custom employee grant exposes project navigation');
  await navigate('project-viewer', '', '/admin/projects-sites');
  await waitFor("document.body.innerText.includes('read-only access to projects') && document.body.innerText.includes('Fixture Site')", 'project read only');
  assert.equal(await evaluate("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Add Projects/Site') || b.getAttribute('aria-label')==='Edit Fixture Site')"), false);
  assert.equal(projectWrites.length, 0);
  projectPermissionsFail = true;
  await navigate('project-manager', '', '/admin/projects-sites');
  await waitFor("document.body.innerText.includes('Unable to verify editing permissions')", 'project permissions fail closed');
  assert.equal(await evaluate("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Add Projects/Site'))"), false);
  projectPermissionsFail = false; await clickText('Retry permissions');
  await waitFor("!!document.querySelector('button[aria-label=\"Edit Fixture Site\"]')", 'employee granted project management');
  await evaluate("document.querySelector('button[aria-label=\"Edit Fixture Site\"]').click()");
  await waitFor("!!document.querySelector('#name')", 'project editor');
  await setInput('#name', 'Updated Fixture Site');
  projectSaveStatus = 400;
  await clickText('Update Project');
  await waitFor("document.body.innerText.includes('Fixture save denied') && [...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='Update Project' && !b.disabled)", 'failed save recoverable');
  assert.equal(await evaluate("document.querySelector('#name').value"), 'Updated Fixture Site');
  projectSaveStatus = 200; await clickText('Update Project');
  await waitFor("document.body.innerText.includes('Updated Fixture Site updated successfully.') && !document.querySelector('#name')", 'project updated');
  assert.equal(projectWrites.at(-1).method, 'PUT');
  await clickText('Add Projects/Site'); await waitFor("!!document.querySelector('#name')", 'project create');
  await setInput('#name', 'New Fixture Site');
  await setInput('#startDate', '2026-10-01'); await setInput('#endDate', '2026-10-30');
  await clickText('Add Project');
  await waitFor("document.body.innerText.includes('New Fixture Site created successfully.') && !document.querySelector('#name')", 'project created');
  assert.equal(projectWrites.at(-1).method, 'POST');
  // Server revocation while an editor is open must close it after the denied write.
  await clickText('Add Projects/Site'); await waitFor("!!document.querySelector('#name')", 'editor before revoke');
  await setInput('#name', 'Revoked save'); projectRevoked = true; projectSaveStatus = 403;
  await clickText('Add Project');
  await waitFor("document.body.innerText.includes('read-only access to projects') && !document.querySelector('#name')", 'revoked editor closed');
  assert.equal(await evaluate("!!localStorage.getItem('token')"), true, 'Permission denial must not log out');
  assert.equal(await evaluate("!!document.querySelector('nav a[href=\"/admin/projects-sites\"]')"), false, 'Revoking custom grant removes project navigation');
  projectRevoked = false; projectSaveStatus = 200;
  failLists = true; await navigate('project-viewer', '', '/admin/projects-sites');
  await waitFor("document.body.innerText.includes('Unable to load projects')", 'project list error');
  failLists = false; await clickText('Retry projects');
  await waitFor("document.body.innerText.includes('Updated Fixture Site')", 'project list retry');
  projectRows = []; await navigate('project-viewer', '', '/admin/projects-sites');
  await waitFor("document.body.innerText.includes('No projects match your filters')", 'empty project list');
  taskRows = [{ id: 'task-root', title: 'Fixture Task', type: 'task', status: 'scheduled', priority: 'normal', taskDescription: '<p>Fixture description</p>', startDate: '2026-10-01', startTime: '09:00', estimatedHours: '1.00', parentId: null, ProjectsSiteId: 'project-fixture', subTasks: [] }];
  holdProjectPermissions = true;
  await navigate('task-manager', '', '/admin/task-manage');
  await waitFor("document.body.innerText.includes('Checking task editing permissions') && document.body.innerText.includes('Fixture Task')", 'task permissions loading');
  assert.equal(await evaluate("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Add Schedule/Task'))"), false);
  holdProjectPermissions = false;
  for (const event of heldPermissionRequests) await fulfill(event, 200, { data: { permissions: ['task.manage'] } });
  heldPermissionRequests = [];
  await waitFor("!!document.querySelector('button[aria-label=\"Edit Fixture Task\"]')", 'task permissions loaded');
  projectPermissionsFail = true; await navigate('task-manager', '', '/admin/task-manage');
  await waitFor("document.body.innerText.includes('Unable to verify task editing permissions')", 'task permissions error');
  assert.equal(await evaluate("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Add Schedule/Task'))"), false);
  projectPermissionsFail = false; await clickText('Retry task permissions');
  await waitFor("!!document.querySelector('button[aria-label=\"Edit Fixture Task\"]')", 'task permissions retry');
  await navigate('task-viewer', '', '/admin/task-manage');
  await waitFor("document.body.innerText.includes('read-only access to tasks') && document.body.innerText.includes('Fixture Task')", 'task read only');
  assert.equal(await evaluate("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Add Schedule/Task') || b.getAttribute('aria-label')==='Edit Fixture Task')"), false);
  await navigate('task-viewer', '', '/admin/task-manage/task-root');
  await waitFor("document.body.innerText.includes('Fixture description')", 'direct read-only task');
  assert.equal(await evaluate("document.querySelector('nav a[href=\"/admin/task-manage\"]').getAttribute('aria-current')"), 'page', 'Task detail highlights task navigation');
  assert.equal(await evaluate("!!document.querySelector('#title')"), false);
  assert.equal(await evaluate("document.querySelector('.prose').classList.contains('line-clamp-2')"), false, 'Detail description is not truncated');
  assert.equal(taskWrites.length, 0);
  await navigate('task-manager', '', '/admin/task-manage/task-root');
  await waitFor("!!document.querySelector('button[aria-label=\"Edit Fixture Task\"]')", 'task grant');
  await evaluate("document.querySelector('button[aria-label=\"Edit Fixture Task\"]').click()");
  await waitFor("!!document.querySelector('#title')", 'task editor');
  await setInput('#title', 'Updated Task'); taskSaveStatus = 400;
  await clickText('Update Task/Schedule');
  await waitFor("document.body.innerText.includes('Fixture task save denied') && [...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='Update Task/Schedule' && !b.disabled)", 'task failure recovery');
  taskSaveStatus = 200; await clickText('Update Task/Schedule');
  await waitFor("document.body.innerText.includes('Updated Task updated successfully.') && !document.querySelector('#title')", 'task update');
  assert.equal(taskWrites.at(-1).body.parentId, null);
  await clickText('Sub Task'); await waitFor("!!document.querySelector('#title')", 'subtask editor');
  await setInput('#title', 'Child Task'); await clickText('Add Task/Schedule');
  await waitFor("document.body.innerText.includes('Child Task created successfully.') && !document.querySelector('#title')", 'subtask create');
  assert.equal(taskWrites.at(-1).body.parentId, 'task-root');
  assert.equal(taskWrites.at(-1).body.ProjectsSiteId, 'project-fixture');
  await waitFor("!!document.querySelector('button[aria-label=\"Edit Child Task\"]')", 'refreshed subtask list');
  await evaluate("document.querySelector('button[aria-label=\"Edit Child Task\"]').click()");
  await waitFor("!!document.querySelector('#title')", 'edit child');
  await setInput('#title', 'Updated Child'); await clickText('Update Task/Schedule');
  await waitFor("document.body.innerText.includes('Updated Child updated successfully.') && !document.querySelector('#title')", 'child update');
  assert.equal(taskWrites.at(-1).body.parentId, 'task-root', 'Editing a child preserves its parent');
  await clickText('Add Schedule/Task'); await waitFor("!!document.querySelector('#title')", 'fresh root task');
  await setInput('#title', 'New Root'); await clickText('Add Task/Schedule');
  await waitFor("document.body.innerText.includes('New Root created successfully.') && !document.querySelector('#title')", 'root created');
  assert.equal(taskWrites.at(-1).body.parentId, null, 'New root does not inherit previous parent');
  await clickText('Add Schedule/Task'); await waitFor("!!document.querySelector('#title')", 'task revoke editor');
  await setInput('#title', 'Denied Task'); taskRevoked = true; taskSaveStatus = 403;
  await clickText('Add Task/Schedule');
  await waitFor("document.body.innerText.includes('read-only access to tasks') && !document.querySelector('#title')", 'task revoked');
  taskRevoked = false; taskSaveStatus = 200;
  failLists = true; await navigate('task-viewer', '', '/admin/task-manage');
  await waitFor("document.body.innerText.includes('Unable to load tasks')", 'task list failed');
  failLists = false; await clickText('Retry tasks');
  await waitFor("document.body.innerText.includes('Updated Task')", 'task list retry');
  await navigate('task-viewer', '', '/admin/task-manage/missing');
  await waitFor("document.body.innerText.includes('Task not found.')", 'missing task');
  taskRows = []; await navigate('task-viewer', '', '/admin/task-manage');
  await waitFor("document.body.innerText.includes('No tasks to display.')", 'empty tasks');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate('task-manager', '', '/admin/task-manage');
  await waitFor("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Add Schedule/Task'))", 'mobile task manager');
  await clickText('Add Schedule/Task'); await waitFor("!!document.querySelector('#title')", 'mobile task editor');
  await waitFor("(()=>{const r=document.querySelector('[role=dialog]').getBoundingClientRect();return r.left>=0 && r.right<=window.innerWidth;})()", 'task editor fits mobile viewport');
  await clickText('Cancel');
  await waitFor("!document.querySelector('#title')", 'task cancel closes editor');
  await navigate('project-manager', '', '/admin/projects-sites');
  await waitFor("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Add Projects/Site'))", 'mobile project manager');
  await clickText('Add Projects/Site'); await waitFor("!!document.querySelector('#name')", 'mobile project editor');
  await waitFor("(()=>{const r=document.querySelector('[role=dialog]').getBoundingClientRect();return r.left>=0 && r.right<=window.innerWidth;})()", 'project editor fits mobile viewport after opening animation');
  await clickText('Cancel');
  await navigate('project-manager', '', '/employee/leave-request');
  await clickText('Toggle navigation menu');
  await waitFor("!!document.querySelector('[role=dialog] nav a[href=\"/admin/projects-sites\"]')", 'employee mobile granted navigation');
  await evaluate("document.querySelector('[role=dialog] nav a[href=\"/admin/projects-sites\"]').click()");
  await waitFor("location.pathname === '/admin/projects-sites' && !document.querySelector('[role=dialog]')", 'mobile link navigates and closes drawer');
  await navigate('admin', '?companyId=company-b');
  await waitFor("document.body.innerText.includes('Company: Fixture Company B') && document.body.innerText.includes('Staff Fixture')", 'company selection/mobile');
  assert.equal(await evaluate("document.querySelectorAll('h1').length"), 2); // Mobile brand heading plus page heading.
  assert.equal(await evaluate("document.documentElement.scrollWidth <= window.innerWidth"), true, 'No horizontal page overflow');
  assert.deepEqual(errors, []);
  console.log('Browser checks passed: create, assign, effective permissions, cancel/revoke, read-only, denied, empty, retry, company selection, mobile, custom leave approver/applicant, project read-only/granted/revoked access, save failure/retry, create/update, permission retry, empty lists; task permissions, direct details, create/update/subtasks, parent preservation, retries, revocation, missing/empty tasks mobile cancellation, grant-aware navigation, single sidebars, nested active links and mobile navigation dismissal.');
} finally {
  await send('Page.close'); ws.close();
}
