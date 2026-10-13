'use client'

import { useState } from 'react'
import { Check, ChevronRight, KeyRound, Search, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Role = { id: string; name: string; code: string; permissions: string[] }

const modules: Record<string, string> = {
  settings: 'Company settings', access: 'Roles & access', leave: 'Leave requests',
  project: 'Projects & sites', task: 'Tasks & schedules', employee: 'Employees', report: 'Reports',
}
const permissionLabels: Record<string, string> = {
  'settings.view': 'View settings', 'settings.manage': 'Manage settings',
  'access.view': 'View roles & members', 'access.manage': 'Manage roles & assignments',
  'leave.approve': 'Review & approve leave', 'project.manage': 'Manage projects & sites',
  'task.manage': 'Manage tasks & schedules', 'employee.view': 'View company employees',
  'employee.manage': 'Create & update employees', 'report.view': 'Download reports',
}

export function RoleBrowser({ roles }: { roles: Role[] }) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const matches = roles.filter(role => `${role.name} ${role.code}`.toLowerCase().includes(search.trim().toLowerCase()))
  const selected = matches.find(role => role.id === selectedId) || matches[0]
  const groups = selected ? Array.from(new Set(selected.permissions.map(code => code.split('.')[0]))) : []

  return <div className="grid min-w-0 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)]">
    <div className="min-w-0 border-b bg-muted/20 p-4 lg:border-b-0 lg:border-r">
      <div className="relative"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" /><Input aria-label="Search roles on this page" placeholder="Find a role on this page…" className="bg-background pl-9" value={search} onChange={event => setSearch(event.target.value)} /></div>
      <div className="my-3 flex items-center justify-between gap-2 text-xs text-muted-foreground"><span>{matches.length} {matches.length === 1 ? 'role' : 'roles'} on this page</span><span>Select to preview</span></div>
      <fieldset className="max-h-60 space-y-2 overflow-y-auto p-1 lg:max-h-80">
        <legend className="sr-only">Choose a company role to preview permissions</legend>
        {matches.map(role => <label key={role.id} className="block cursor-pointer">
          <input type="radio" name="role-preview" className="peer sr-only" value={role.id} checked={selected?.id === role.id} onChange={() => setSelectedId(role.id)} aria-label={`Preview ${role.name}`} aria-controls="role-permission-preview" />
          <span className="flex items-center gap-3 rounded-lg border border-transparent bg-background p-3 transition-colors hover:border-primary/30 peer-checked:border-primary/50 peer-checked:bg-primary/5 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected?.id === role.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}><ShieldCheck className="h-4 w-4" aria-hidden="true" /></span>
            <span className="min-w-0 flex-1"><span className="block break-words text-sm font-semibold">{role.name}</span><span className="mt-1 block text-xs text-muted-foreground">{role.permissions.length} {role.permissions.length === 1 ? 'permission' : 'permissions'}</span></span>
            <ChevronRight className={`h-4 w-4 shrink-0 ${selected?.id === role.id ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
          </span>
        </label>)}
      </fieldset>
      {!matches.length && <div className="py-6 text-center"><p role="status" className="text-sm text-muted-foreground">No matching roles on this page.</p><Button variant="ghost" size="sm" className="mt-2" onClick={() => setSearch('')}>Clear role search</Button></div>}
    </div>
    <section id="role-permission-preview" aria-label="Selected role permissions" className="min-w-0 p-4 md:p-5">
      {selected ? <>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
          <div className="min-w-0"><p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Role overview</p><h3 className="break-words text-lg font-semibold">{selected.name}</h3><p className="mt-1 break-all font-mono text-xs text-muted-foreground">{selected.code}</p></div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"><KeyRound className="h-3.5 w-3.5" aria-hidden="true" />{selected.permissions.length} {selected.permissions.length === 1 ? 'permission' : 'permissions'}</span>
        </div>
        <div className="mt-4 max-h-80 space-y-4 overflow-y-auto pr-1">
          {groups.map(group => <div key={group}><h4 className="mb-2 text-xs font-semibold text-muted-foreground">{modules[group] || group}</h4><div className="grid gap-2 xl:grid-cols-2">{selected.permissions.filter(code => code.split('.')[0] === group).map(code => <div key={code} className="flex items-start gap-2 rounded-lg border bg-muted/10 px-3 py-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0"><p className="break-words text-sm font-medium">{permissionLabels[code] || code}</p><p className="mt-0.5 break-all text-xs text-muted-foreground">{code}</p></div></div>)}</div></div>)}
          {!groups.length && <div className="rounded-lg border border-dashed p-6 text-center"><KeyRound className="mx-auto mb-2 h-6 w-6 text-muted-foreground" aria-hidden="true" /><p className="text-sm font-medium">No permissions assigned</p><p className="mt-1 text-xs text-muted-foreground">This role does not grant any access on its own.</p></div>}
        </div>
        <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">Preview only. Assign roles to people in Company members below.</p>
      </> : <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground"><ShieldCheck className="h-8 w-8" aria-hidden="true" /><p className="text-sm">Choose a role to review its permissions.</p></div>}
    </section>
  </div>
}
