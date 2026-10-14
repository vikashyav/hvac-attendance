// Display helpers only: attendance totals and working-day counts come from the API.
export function companyMonthRange(timezone, now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now).map(part => [part.type, part.value]));
  return { from: `${parts.year}-${parts.month}-01`, to: `${parts.year}-${parts.month}-${parts.day}` };
}

export function workingHoursGoal(summary, policy) {
  const days = Number(summary.totalWorkingDays);
  const hours = Number(policy?.requiredHours);
  if (!Number.isFinite(days) || days <= 0 || !Number.isFinite(hours) || hours <= 0) return [];
  const target = Number((days * hours).toFixed(2));
  const current = Number(summary.totalHours || 0);
  return [{ id: 'working-hours', title: 'Required Work Hours', current, target,
    status: current >= target ? 'achieved' : 'in-progress',
    description: `${days} working days × ${hours} required hours under the current company policy, month to date.`,
  }];
}

export function assignedEmployeeTasks(tasks, employeeId) {
  if (!employeeId || !Array.isArray(tasks)) return [];
  return tasks.filter(task => String(task.assignTo || task.assignToEmployee?.id || '') === String(employeeId));
}
