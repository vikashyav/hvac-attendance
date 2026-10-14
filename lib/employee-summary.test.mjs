import test from 'node:test';
import assert from 'node:assert/strict';
import { assignedEmployeeTasks, companyMonthRange, workingHoursGoal } from './employee-summary.mjs';

test('work goals use persisted hours, including fractional hours and empty periods', () => {
  assert.equal(workingHoursGoal({ totalWorkingDays: 3, totalHours: 20 }, { requiredHours: 7.5 })[0].target, 22.5);
  assert.equal(workingHoursGoal({ totalWorkingDays: 3, totalHours: 23 }, { requiredHours: 7.5 })[0].status, 'achieved');
  assert.deepEqual(workingHoursGoal({ totalWorkingDays: 0 }, { requiredHours: 7.5 }), []);
  assert.deepEqual(workingHoursGoal({ totalWorkingDays: 3 }, null), []);
});

test('company timezone determines month boundaries independently of browser timezone', () => {
  const now = new Date('2026-11-01T00:30:00Z');
  assert.deepEqual(companyMonthRange('America/Los_Angeles', now), { from: '2026-10-01', to: '2026-10-31' });
  assert.deepEqual(companyMonthRange('Asia/Kolkata', now), { from: '2026-11-01', to: '2026-11-01' });
});

test('personal schedules exclude unassigned, self-created and other-employee tasks', () => {
  const tasks = [{ id: 1, assignTo: 'own' }, { id: 2, assignToEmployee: { id: 'own' } },
    { id: 3, assignTo: 'other', createdBy: 'self' }, { id: 4, createdBy: 'self' },
    { id: 5, assignTo: 'other', assignToEmployee: { id: 'own' } }];
  assert.deepEqual(assignedEmployeeTasks(tasks, 'own').map(task => task.id), [1, 2]);
  assert.deepEqual(assignedEmployeeTasks(tasks, undefined), []);
  assert.deepEqual(assignedEmployeeTasks(null, 'own'), []);
});
