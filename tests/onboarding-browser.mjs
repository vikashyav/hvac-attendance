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
let employeeWrites = [], saveStatus = 201, optionFailure = false, optionWrites = [];
let employeeOptions = [];
const permissions = ['employee.manage', 'settings.view', 'settings.manage', 'access.view', 'access.manage'];
let taskRows = [], taskWrites = [], taskSaveStatus = 200, taskRevoked = false;
let holdProjectPermissions = false, heldPermissionRequests = [];
let projectRows = [], projectWrites = [], projectSaveStatus = 200, projectRevoked = false, projectPermissionsFail = false;
let failCompanies = false, emptyCompanies = false, roleSaveStatus = 201, roleRevoked = false;
const accessRequests = [];
let companyRows = [{ id: 'company-a', name: 'Fixture Company A', slug: 'fixture-a', industry: 'IT', isActive: true }, { id: 'company-b', name: 'Fixture Company B', slug: 'fixture-b', industry: 'HVAC', isActive: true }];
let companyAdmins = [{ id: 'company-admin-1', companyId: 'company-a', firstName: 'Company', lastName: 'Admin', email: 'company-admin@example.test', isActive: true }];
const attendanceRows = [
  { id: 'attendance-1', employeeId: 'employee-fixture', attendanceDate: '2026-10-12', checkInTime: '2026-10-12T09:00:00.000Z', checkOutTime: '2026-10-12T17:45:00.000Z', checkInLocation: { address: 'Fixture office' }, workHours: 8.75, overtimeHours: 0.75, status: 'present', isLate: false },
  { id: 'attendance-2', employeeId: 'employee-fixture', attendanceDate: '2026-10-13', checkInTime: '2026-10-13T09:20:00.000Z', checkOutTime: '2026-10-13T17:00:00.000Z', checkInLocation: { latitude: 28.6139, longitude: 77.209 }, workHours: 7.67, overtimeHours: 0, status: 'late', isLate: true },
];
let personalFailure = '', personalEmpty = false, missingEmployee = false, passwordStatus = 400;
let roles, assignments, leaveStatus = 'PENDING', lastDecision;
function reset() {
  roles = [{ id: 'role-admin', name: 'Administrator', code: 'administrator', permissions }, { id: 'role-none', name: 'No access', code: 'no-access', permissions: [] }];
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
  throw Error(`Timed out: ${label}; page: ${await evaluate('document.body.innerText.slice(0, 2500)')}`);
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
    if (path.includes('/access/')) accessRequests.push({ path, companyId, method: event.request.method });
    if (path.endsWith('/companies/admins')) {
      if (event.request.method === 'POST') { const row = { id: `company-admin-${companyAdmins.length + 1}`, isActive: true, ...JSON.parse(event.request.postData) }; companyAdmins.push(row); return fulfill(event, 201, { data: row }); }
      return fulfill(event, 200, { data: companyAdmins });
    }
    if (path.endsWith('/companies')) {
      if (event.request.method === 'POST') { const row = { id: `company-${companyRows.length + 1}`, isActive: true, ...JSON.parse(event.request.postData) }; companyRows.push(row); return fulfill(event, 201, { data: row }); }
      return fulfill(event, failCompanies ? 400 : 200, failCompanies ? { error: 'Fixture company failure' } : { data: emptyCompanies ? [] : companyRows });
    }
    if (path.endsWith('/access/me') && roleRevoked) return fulfill(event, 200, { data: { companyId, companyName: 'Fixture Company A', permissions: ['access.view'] } });
    if (path.endsWith('/access/me') && holdProjectPermissions) { heldPermissionRequests.push(event); return; }
    if (path.endsWith('/access/me') && projectPermissionsFail) return fulfill(event, 400, { error: 'Fixture permission failure' });
    if (path.endsWith('/access/me')) return fulfill(event, 200, { data: { companyId, companyName: companyId === 'company-b' ? 'Fixture Company B' : 'Fixture Company A', permissions: scenario === 'task-manager' ? (taskRevoked ? [] : ['task.manage']) : scenario === 'task-viewer' ? [] : scenario === 'project-manager' ? (projectRevoked ? [] : ['project.manage']) : scenario === 'project-viewer' ? [] : scenario === 'applicant' ? [] : scenario === 'approver' ? ['leave.approve'] : scenario === 'denied' ? [] : scenario === 'viewer' ? ['access.view', 'settings.view'] : permissions } });
    if (path.endsWith('/settings')) return fulfill(event, 200, { data: { companyId, revision: 1, settings: { company: { name: 'Fixture Company', industry: 'IT', email: '', phone: '', address: '' }, attendance: { timezone: 'UTC', startTime: '09:00', endTime: '17:00', workDays: [1,2,3,4,5], requiredHours: 8, halfDayHours: 4, graceMinutes: 0, breakMinutes: 0, overtimeEnabled: true, overtimeAfterHours: 8, allowNonWorkingDays: false, allowEarlyCheckout: true, requirePhoto: false, locationEnabled: false, geofencingEnabled: false, geofenceRadius: 100 } } } });
    if ((personalFailure === 'policy' && path.endsWith('/settings/attendance-policy')) || (personalFailure === 'attendance' && path.endsWith('/attendance')) || (personalFailure === 'schedule' && path.includes('/schedule_tasks-manage'))) return fulfill(event, 403, { error: 'Fixture unavailable' });
    if (path.endsWith('/user/change-password')) return fulfill(event, passwordStatus, { message: 'Fixture password response' });
    if (personalEmpty && path.endsWith('/attendance')) return fulfill(event, 200, { data: [], totalWorkingDays: 0 });
    if (path.endsWith('/settings/attendance-policy')) return fulfill(event, 200, { data: { timezone: 'UTC', startTime: '09:00', endTime: '17:00', workDays: [1,2,3,4,5], requiredHours: 7.5, halfDayHours: 4, graceMinutes: 10, breakMinutes: 0, overtimeEnabled: true, overtimeAfterHours: 8 } });
    if (path.endsWith('/attendance')) return fulfill(event, 200, { data: attendanceRows, employeeCount: 4, dailyStatusCounts: { '2026-10-12': { present: 1, late: 0, half_day: 0, absent: 3 }, '2026-10-13': { present: 0, late: 1, half_day: 0, absent: 3 } }, daysPresent: 2, totalWorkingDays: 22, attendanceRate: '9.1', punctualityRate: '4.5', totalHours: 16.42, totalOvertimeHours: 0.75 });
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
    if (path.endsWith('/employee-options')) {
      if (optionFailure) return fulfill(event, 400, { error: 'Fixture failure' });
      if (event.request.method === 'POST') { const body = JSON.parse(event.request.postData); optionWrites.push(body); if (employeeOptions.some(row => row.kind === body.kind && row.name.toLowerCase() === body.name.toLowerCase())) return fulfill(event, 409, {}); const row = { ...body, id: `option-${employeeOptions.length}` }; employeeOptions.push(row); return fulfill(event, 201, { data: row }); }
      return fulfill(event, 200, { data: employeeOptions });
    }
    if (path.endsWith('/employees') && event.request.method === 'POST') { employeeWrites.push(JSON.parse(event.request.postData)); return fulfill(event, saveStatus, { success: saveStatus === 201 }); }
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
        if (roleSaveStatus !== 201) return fulfill(event, roleSaveStatus, { error: 'Fixture role save denied' });
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
    if (path.endsWith('/access/memberships')) return fulfill(event, 200, { data: scenario === 'empty' ? [] : [{ id: 'member-1', isActive: true, user: { id: 'staff-1', firstName: companyId === 'company-b' ? 'Other' : 'Staff', lastName: 'Fixture', email: 'staff@example.test', isActive: true }, roles: assignments, permissions: assignments.flatMap(item => roles.find(role => role.id === item.roleId).permissions) }], meta: { pages: 1, total: scenario === 'empty' ? 0 : 1 } });
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
  } else if (message.method === 'Fetch.requestPaused') intercept(message.params).catch(error => {
    // A request can disappear between Fetch.requestPaused and fulfillment when
    // company selection replaces the URL. Chrome reports that navigation race
    // as Invalid InterceptionId; every other interception failure stays fatal.
    if (error.message !== 'Invalid InterceptionId.') errors.push(error.message);
  });
});
await send('Page.enable'); await send('Network.enable');
await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
async function navigate(next, query = '', path = '/admin/roles', selectCompany = true) {
  scenario = next; calls.clear();
  if (sourceId) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: sourceId });
  const user = { id: `browser-${next}`, role: ['approver', 'applicant', 'project-manager', 'task-manager'].includes(next) ? 'employee' : query || next === 'platform' ? 'superAdmin' : 'admin', companyId: 'company-a', firstName: 'Browser', lastName: 'Fixture', email: 'browser@example.test', employee: missingEmployee ? undefined : { id: 'employee-fixture', skills: [], certifications: [] } };
  const token = { access_token: 'fixture-only' };
  const source = `if (location.pathname !== '/login') { localStorage.clear(); localStorage.setItem('user', btoa(${JSON.stringify(JSON.stringify(user))})); localStorage.setItem('token', btoa(${JSON.stringify(JSON.stringify(token))})); }`;
  sourceId = (await send('Page.addScriptToEvaluateOnNewDocument', { source })).identifier;
  await send('Network.setCookies', { cookies: [{ name: 'token', value: encodeURIComponent(JSON.stringify(token)), url: site }, { name: 'userInfo', value: encodeURIComponent(JSON.stringify(user)), url: site }] });
  await send('Page.navigate', { url: site + path + query });
  await waitFor(`document.body.innerText.includes(${JSON.stringify(next === 'denied' ? 'You do not have permission' : path === '/admin/employees/options' ? 'Departments & job titles' : path === '/admin/employees/add' ? 'Add new employee' : path === '/admin/employees' ? 'Employee Management' : path === '/admin/task-manage' ? 'Calendar & Scheduling' : path.startsWith('/admin/task-manage/') ? 'Schedule/Task' : path.endsWith('/projects-sites') ? 'Projects / Sites' : path.endsWith('/leave-request') ? 'Leave Management' : path.endsWith('/employee/attendance') ? (next === 'applicant' ? 'My Attendance' : 'Attendance Tracking') : path.endsWith('/performance') ? (missingEmployee ? 'No employee profile' : personalFailure ? 'Unable to Load' : 'Performance Dashboard') : path.endsWith('/schedule') ? (missingEmployee ? 'No employee profile' : personalFailure ? 'Unable to Load' : 'My Schedule') : path.endsWith('/profile') ? 'My Profile' : path.endsWith('/settings') ? 'System Settings' : path.endsWith('/companies') ? 'Companies & Admins' : 'Roles & permissions')})`, next);
  if (path === '/admin/roles' && !query && next !== 'denied' && selectCompany) {
    await waitFor("!!document.querySelector('#roles-company option[value=company-a]')", 'available company');
    await evaluate("(()=>{const s=document.querySelector('#roles-company');s.value='company-a';s.dispatchEvent(new Event('change',{bubbles:true}));})()");
    await waitFor("location.search.includes('companyId=company-a')", 'company selected');
  }
}
const clickText = text => evaluate(`[...document.querySelectorAll('button')].find(b=>b.getClientRects().length && b.textContent.trim()===${JSON.stringify(text)}).click()`);
const selectTab = text => evaluate(`[...document.querySelectorAll('[role=tab]')].find(b=>b.textContent.trim()===${JSON.stringify(text)}).dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0}))`);
const setInput = (selector, value) => evaluate(`(()=>{const node=document.querySelector(${JSON.stringify(selector)}); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(node,${JSON.stringify(value)}); node.dispatchEvent(new Event('input',{bubbles:true}));})()`);

try {
  await navigate('viewer', '', '/admin/employees/options');
  await waitFor("document.body.innerText.includes('You do not have permission to manage employee options')", 'options denied');
  optionFailure = true;
  await navigate('admin', '', '/admin/employees/options');
  await waitFor("document.body.innerText.includes('Unable to load company options')", 'options failed');
  optionFailure = false; await clickText('Retry options');
  await waitFor("!!document.querySelector('#department')", 'options retry');
  assert.equal(await evaluate("document.body.innerText.includes('No departments yet')"), true);
  await setInput('#department', 'Engineering');
  await evaluate("document.querySelector('[aria-label=\"Add department\"]').click()");
  await waitFor("document.body.innerText.includes('Engineering added.')", 'department created');
  await setInput('#department', 'Engineering');
  await evaluate("document.querySelector('[aria-label=\"Add department\"]').click()");
  await waitFor("document.body.innerText.includes('This option already exists.')", 'duplicate option');
  await setInput('#job_title', 'Developer');
  await evaluate("document.querySelector('[aria-label=\"Add job title\"]').click()");
  await waitFor("document.body.innerText.includes('Developer added.')", 'job title created');
  assert.deepEqual(optionWrites[0], { kind: 'department', name: 'Engineering' });
  await navigate('viewer' , '', '/admin/employees/add');
  await waitFor("document.body.innerText.includes('You do not have permission to create employees')", 'denied onboarding');
  await navigate('admin', '', '/admin/employees/add');
  await waitFor("!!document.querySelector('#firstName')", 'onboarding form');
  await clickText('Continue');
  await waitFor("document.body.innerText.includes('First name is required')", 'required fields');
  for (const [name, value] of Object.entries({firstName:'Avery', lastName:'Morgan', email:'avery@example.test', phone:'+919876543210'})) await setInput('#'+name,value);
  await evaluate("(()=>{const n=document.querySelector('#address');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(n,'14 Example Street, Pune');n.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await clickText('Continue');
  await waitFor("!!document.querySelector('#department')", 'employment');
  for (const [name,value] of Object.entries({hireDate:'2026-11-01', skills:'Testing, JavaScript, Testing'})) await setInput('#'+name,value);
  await waitFor("!!document.querySelector('#department option[value=Engineering]') && !!document.querySelector('#position option[value=Developer]')", 'configured options');
  assert.equal(await evaluate("document.querySelector('#department').tagName"), 'SELECT');
  for (const [name, value] of [['department', 'Engineering'], ['position', 'Developer']]) await evaluate(`(()=>{const n=document.querySelector('#${name}');n.value=${JSON.stringify(value)};n.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await clickText('Continue');
  await waitFor("!!document.querySelector('#emergencyContact-name')", 'emergency');
  for (const [name,value] of Object.entries({name:'Taylor Morgan', relationship:'Sibling', phone:'+919876543211'})) await setInput('#emergencyContact-'+name,value);
  await clickText('Continue');
  await waitFor("document.body.innerText.includes('This employee will be added to')", 'review');
  assert.equal(employeeWrites.length,0);
  saveStatus=409; await clickText('Create employee');
  await waitFor("document.body.innerText.includes('whether this email is already registered')", 'recoverable save');
  saveStatus=201; await clickText('Create employee');
  await waitFor("document.body.innerText.includes('Employee created')", 'success');
  assert.deepEqual(employeeWrites[1].skills,['Testing','JavaScript']);
  assert.equal('companyId' in employeeWrites[1],false);
  await clickText('Add another employee');
  await waitFor("document.querySelector('#firstName')?.value === ''", 'reset');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'),true);
  await setInput('#firstName','Unsaved'); await clickText('Cancel');
  await waitFor("document.body.innerText.includes('Discard this onboarding?')", 'discard');
  await clickText('Keep editing');
  assert.equal(await evaluate("document.querySelector('#firstName').value"),'Unsaved');
  await clickText('Cancel'); await clickText('Discard details');
  await waitFor("location.pathname === '/admin/employees'", 'return');
  assert.deepEqual(errors,[]);
  console.log('Onboarding browser checks passed: permissions, validation, steps, review, recovery, payload, reset, mobile and cancellation.');
} finally { await send('Page.close'); ws.close(); }
