'use client'
import { Suspense, useEffect, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUserFromStorage } from '@/hooks/user.context'
import { useCapabilities } from '@/hooks/use-capabilities'
import { getPermissions, getRoles, getMemberships, createRole, assignRole, revokeRole } from '@/lib/api/access-api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCompanies } from '@/lib/api/company-api'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RoleBrowser } from './role-browser'
import { Label } from '@/components/ui/label'
import { Building2, ShieldCheck, Users, KeyRound, Search, Plus, CheckCircle2, Info } from 'lucide-react'

type Role = { id: string; name: string; code: string; permissions: string[] }
type Member = { id: string; isActive: boolean; user: { id: string; firstName: string; lastName: string; email: string; isActive: boolean; isPlatformAdmin: boolean } | null; roles: { assignmentId: string; roleId: string; name: string }[]; permissions: string[] }
const errorMessage = (error: any) => typeof error?.response?.data?.error === 'string' ? error.response.data.error : 'Unable to complete the request. Please try again.'
function RolesContent({ companyId }: { companyId?: string }) {
  const { user } = useUserFromStorage()
  const client = useQueryClient()
  const capabilities = useCapabilities(companyId)
  const granted: string[] = capabilities.data?.data?.data?.permissions || []
  const canView = capabilities.isSuccess && granted.includes('access.view')
  const canManage = canView && granted.includes('access.manage')
  const key = ['access', user.id, companyId || user.companyId]
  const [createOpen, setCreateOpen] = useState(false)
  useEffect(() => {
    if (!canManage) {
      setCreateOpen(false)
      setDraft({ code: '', name: '', permissions: [] })
    }
  }, [canManage])
  const [memberSearch, setMemberSearch] = useState('')
  const [activeTab, setActiveTab] = useState('members')
  const [rolePage, setRolePage] = useState(1)
  const [memberPage, setMemberPage] = useState(1)
  const roles = useQuery({ queryKey: [...key, 'roles', rolePage], queryFn: ({ signal }) => getRoles({ companyId, page: rolePage, signal }), enabled: canView, retry: false })
  const members = useQuery({ queryKey: [...key, 'members', memberPage], queryFn: ({ signal }) => getMemberships({ companyId, page: memberPage, signal }), enabled: canView, retry: false })
  const catalog = useQuery({ queryKey: [...key, 'catalog'], queryFn: ({ signal }) => getPermissions({ companyId, signal }), enabled: canView, retry: false })
  const [draft, setDraft] = useState({ code: '', name: '', permissions: [] as string[] })
  const [choices, setChoices] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')
  const [pendingRevoke, setPendingRevoke] = useState<{ assignmentId: string; name: string; person: string } | null>(null)
  const refresh = async () => {
    await Promise.all([client.invalidateQueries({ queryKey: ['access'] }), client.invalidateQueries({ queryKey: ['capabilities'] })])
  }
  const create = useMutation({ mutationFn: createRole, onSuccess: async () => { setDraft({ code: '', name: '', permissions: [] }); setCreateOpen(false); setNotice('Role created.'); await refresh() } })
  const assign = useMutation({ mutationFn: assignRole, onSuccess: async () => { setChoices({}); setNotice('Role assigned.'); await refresh() } })
  const revoke = useMutation({ mutationFn: revokeRole, onSuccess: async () => { setPendingRevoke(null); setNotice('Role revoked.'); await refresh() } })
  const busy = create.isPending || assign.isPending || revoke.isPending
  const rows: Role[] = roles.data?.data?.data || []
  const people: Member[] = members.data?.data?.data || []
  const permissions: string[] = catalog.data?.data?.data || []
  const filteredPeople = people.filter(member => `${member.user?.firstName || ''} ${member.user?.lastName || ''} ${member.user?.email || ''}`.toLowerCase().includes(memberSearch.toLowerCase().trim()))
  const permissionGroups = Array.from(new Set(permissions.map(code => code.split('.')[0])))
  const resetMessages = () => { setNotice(''); create.reset(); assign.reset(); revoke.reset() }
  if (capabilities.isPending) return <p role="status" className="p-6">Loading access permissions…</p>
  if (capabilities.isError) return <div className="p-6"><p role="alert">{errorMessage(capabilities.error)}</p><Button onClick={() => capabilities.refetch()}>Retry</Button></div>
  if (!canView) return <p role="alert" className="p-6">You do not have permission to view company roles.</p>
  const failed = roles.isError || members.isError || catalog.isError
  return <div className="space-y-6">
    {!canManage && <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-4 text-sm"><Info className="h-5 w-5 shrink-0" aria-hidden="true" />You have read-only access. You can review roles and members, but cannot make changes.</div>}
    <div className="grid gap-3 sm:grid-cols-3">
      {[{ label: 'Company roles', value: roles.isSuccess ? roles.data?.data?.meta?.total ?? rows.length : '—', icon: ShieldCheck, hint: 'Reusable sets of permissions' }, { label: 'Company members', value: members.isSuccess ? members.data?.data?.meta?.total ?? people.length : '—', icon: Users, hint: 'People in this workspace' }, { label: 'Available permissions', value: catalog.isSuccess ? permissions.length : '—', icon: KeyRound, hint: 'Access across your HRMS' }].map(item => <div key={item.label} className="flex items-center gap-4 rounded-xl border bg-card p-5"><div className="rounded-xl bg-primary/10 p-3 text-primary"><item.icon className="h-5 w-5" aria-hidden="true" /></div><div><p className="text-sm text-muted-foreground">{item.label}</p><p className="text-2xl font-semibold tracking-tight">{item.value}</p><p className="text-xs text-muted-foreground">{item.hint}</p></div></div>)}
    </div>
    {notice && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />{notice}</p>}
    {(assign.isError || revoke.isError) && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{errorMessage(assign.error || revoke.error)}</p>}
    {failed && <div><p role="alert">{errorMessage(roles.error || members.error || catalog.error)}</p><Button onClick={() => { roles.refetch(); members.refetch(); catalog.refetch() }}>Retry lists</Button></div>}
    {canManage && <Sheet open={createOpen} onOpenChange={open => {
      if (busy) return
      setCreateOpen(open)
      if (!open) { setDraft({ code: '', name: '', permissions: [] }); create.reset() }
    }}>
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Managing access for <span className="font-medium text-foreground">{capabilities.data?.data?.data?.companyName || 'this company'}</span></p><SheetTrigger asChild><Button onClick={resetMessages}><Plus className="mr-2 h-4 w-4" aria-hidden="true" />Create company role</Button></SheetTrigger></div>
      <SheetContent side="right" className="z-[600] flex w-full flex-col p-0 sm:max-w-xl">
        <SheetHeader className="shrink-0 border-b px-6 py-6 pr-12 text-left"><SheetTitle>Create company role</SheetTitle><SheetDescription>Choose the permissions for a new role in {capabilities.data?.data?.data?.companyName || 'this company'}.</SheetDescription></SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {create.isError && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{errorMessage(create.error)}</p>}
        {catalog.isError && <div className="mb-4 space-y-2"><p role="alert">Unable to load permissions. Please retry before creating a role.</p><Button variant="outline" onClick={() => catalog.refetch()}>Retry permissions</Button></div>}
      <form className="space-y-4" onSubmit={(event: FormEvent) => { event.preventDefault(); resetMessages(); create.mutate({ ...draft, companyId }) }}>
        <fieldset disabled={busy || catalog.isPending || catalog.isError} className="space-y-4">
          <div><Label htmlFor="role-name">Role name</Label><Input id="role-name" className="mt-2" placeholder="e.g. HR coordinator" required maxLength={120} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></div>
          <div><Label htmlFor="role-code">Unique role code</Label><Input id="role-code" className="mt-2" aria-describedby="role-code-help" required maxLength={80} pattern="[a-z][a-z0-9-]{0,79}" placeholder="settings-reviewer" value={draft.code} onChange={e => setDraft({ ...draft, code: e.target.value })} /><p id="role-code-help" className="mt-2 text-xs text-muted-foreground">Use lowercase letters, numbers, and hyphens. Start with a letter.</p></div>
          <fieldset className="space-y-3"><legend className="mb-1 flex w-full items-center justify-between text-sm font-medium">Permissions <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">{draft.permissions.length} selected</span></legend>
            <p className="text-xs text-muted-foreground">Select only the access this role needs. Members combine permissions from all their roles.</p>
            {catalog.isPending ? <p role="status">Loading permission catalog…</p> : permissionGroups.map(group => <div key={group} className="overflow-hidden rounded-lg border"><h3 className="border-b bg-muted/40 px-3 py-2 text-xs font-semibold capitalize">{group.replace(/-/g, ' ')}</h3><div className="grid gap-1 p-2 sm:grid-cols-2">{permissions.filter(code => code.split('.')[0] === group).map(code => <label className={`flex cursor-pointer items-start gap-3 rounded-md p-3 transition-colors hover:bg-muted ${draft.permissions.includes(code) ? 'bg-primary/5' : ''}`} key={code}><input className="mt-1 h-4 w-4 shrink-0 accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" type="checkbox" checked={draft.permissions.includes(code)} onChange={e => setDraft({ ...draft, permissions: e.target.checked ? [...draft.permissions, code] : draft.permissions.filter(item => item !== code) })} /><span className="min-w-0"><span className="block text-sm font-medium capitalize">{code.split('.').slice(1).join(' ').replace(/-/g, ' ')}</span><span className="block break-all text-xs text-muted-foreground">{code}</span></span></label>)}</div></div>)}
          </fieldset>
          <div className="flex items-center justify-between gap-3 border-t pt-4"><p className="text-xs text-muted-foreground">You can assign this role after creating it.</p><div className="flex shrink-0 gap-2"><Button type="button" variant="outline" onClick={() => { setCreateOpen(false); setDraft({ code: '', name: '', permissions: [] }); create.reset() }}>Cancel</Button><Button type="submit" className="shrink-0"><Plus className="mr-2 h-4 w-4" aria-hidden="true" />{create.isPending ? 'Creating…' : 'Create role'}</Button></div></div>
        </fieldset>
      </form>
        </div>
      </SheetContent>
    </Sheet>}
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex flex-col gap-3 border-b sm:flex-row sm:items-end sm:justify-between">
        <TabsList className="h-auto w-full justify-start gap-1 rounded-none bg-transparent p-0 sm:w-auto">
          <TabsTrigger value="members" aria-label="Show company members" className="flex-1 gap-2 rounded-none border-b-2 border-transparent px-4 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:flex-none"><Users className="h-4 w-4" aria-hidden="true" />Company members <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{members.data?.data?.meta?.total ?? people.length}</span></TabsTrigger>
          <TabsTrigger value="roles" aria-label="Show company roles" className="flex-1 gap-2 rounded-none border-b-2 border-transparent px-4 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:flex-none"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Company roles <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{roles.data?.data?.meta?.total ?? rows.length}</span></TabsTrigger>
        </TabsList>
        {activeTab === 'members' && <div className="relative mb-2 w-full sm:w-72"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" /><Input className="h-9 pl-9" aria-label="Search members on this page" placeholder="Search name or email…" value={memberSearch} onChange={event => setMemberSearch(event.target.value)} /></div>}
      </div>
      <TabsContent value="members" className="mt-0">
        <Card className="overflow-hidden rounded-xl shadow-sm"><CardHeader className="border-b bg-muted/20 px-4 py-3 md:px-5"><CardTitle className="text-base">Company members</CardTitle><p className="text-xs text-muted-foreground">Assign roles and review access without leaving the member list.</p></CardHeader><CardContent className="p-0">
          {members.isError ? <p className="p-5 text-sm text-muted-foreground">Members could not be loaded. Use Retry lists above to try again.</p> : members.isPending ? <p role="status" className="p-5">Loading members…</p> : !people.length ? <p className="p-5">No members on this page.</p> : !filteredPeople.length ? <p className="m-4 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No matching members on this page. Try another name or email.</p> : <div className="divide-y">{filteredPeople.map(member => {
            const name = member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Unavailable account'
            const active = member.isActive && member.user?.isActive
            return <section key={member.id} className="grid min-w-0 gap-3 px-4 py-3 transition-colors hover:bg-muted/20 md:grid-cols-[minmax(190px,1fr)_minmax(180px,1fr)_minmax(260px,1.2fr)] md:items-center md:px-5">
              <div className="flex min-w-0 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary" aria-hidden="true">{member.user ? `${member.user.firstName?.[0] || ''}${member.user.lastName?.[0] || ''}` : '?'}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-semibold">{name}</h3><span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>{active ? 'Active' : 'Inactive'}</span></div><p className="truncate text-xs text-muted-foreground">{member.user?.email || 'Email unavailable'}</p></div></div>
              <div className="min-w-0"><p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Assigned roles</p><div className="flex flex-wrap gap-1">{member.roles.length ? member.roles.map(role => <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary" key={role.assignmentId}><span className="truncate">{role.name}</span>{canManage && <button type="button" className="rounded px-1 text-primary/70 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" disabled={busy} aria-label={`Revoke ${role.name} from ${name}`} onClick={() => { resetMessages(); setPendingRevoke({ assignmentId: role.assignmentId, name: role.name, person: name }) }}>×</button>}</span>) : <span className="text-xs text-muted-foreground">No roles assigned</span>}</div><p className="mt-1 text-xs text-muted-foreground">{member.permissions.length} effective {member.permissions.length === 1 ? 'permission' : 'permissions'}{member.user?.isPlatformAdmin ? ' · Platform administrator' : ''}</p></div>
              {canManage ? <div className="flex min-w-0 items-end gap-2"><div className="min-w-0 flex-1"><Label className="sr-only" htmlFor={`assign-${member.id}`}>Assign role to {name}</Label><select id={`assign-${member.id}`} aria-label={`Assign role to ${name}`} className="block h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" disabled={busy || roles.isFetching || roles.isError || !active} value={choices[member.id] || ''} onChange={e => setChoices({ ...choices, [member.id]: e.target.value })}><option value="">Add a role…</option>{rows.filter(role => !member.roles.some(item => item.roleId === role.id)).map(role => <option value={role.id} key={role.id}>{role.name}</option>)}</select></div><Button size="sm" className="h-9 shrink-0" disabled={busy || roles.isFetching || roles.isError || !choices[member.id] || !active} onClick={() => { resetMessages(); assign.mutate({ companyId, membershipId: member.id, roleId: choices[member.id] }) }}>Assign</Button></div> : <p className="text-xs text-muted-foreground">Read-only access</p>}
            </section>
          })}</div>}
          <div className="flex items-center justify-between gap-2 border-t bg-muted/10 px-4 py-3 text-xs"><Button aria-label="Previous members page" variant="outline" size="sm" disabled={memberPage === 1 || members.isFetching || busy} onClick={() => { setMemberSearch(''); setMemberPage(memberPage - 1) }}>Previous</Button><span className="whitespace-nowrap text-muted-foreground">Page {memberPage} of {members.data?.data?.meta?.pages || 1}</span><Button aria-label="Next members page" variant="outline" size="sm" disabled={memberPage >= (members.data?.data?.meta?.pages || 1) || members.isFetching || busy} onClick={() => { setMemberSearch(''); setMemberPage(memberPage + 1) }}>Next</Button></div>
        </CardContent></Card>
      </TabsContent>
      <TabsContent value="roles" className="mt-0">
        <Card className="overflow-hidden rounded-xl shadow-sm"><CardHeader className="border-b px-4 py-4 md:px-5"><CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />Company roles</CardTitle><p className="text-sm text-muted-foreground">Choose a role to see exactly what access it includes.</p></CardHeader><CardContent className="p-0">
          {roles.isError ? <p className="p-6 text-sm text-muted-foreground">Roles could not be loaded. Use Retry lists above to try again.</p> : roles.isPending ? <p role="status" className="p-6 text-sm text-muted-foreground">Loading roles…</p> : !rows.length ? <div className="p-8 text-center"><ShieldCheck className="mx-auto mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" /><p className="font-medium">No roles on this page.</p><p className="mt-1 text-sm text-muted-foreground">{canManage ? 'Create a company role to define access for your team.' : 'Company roles will appear here when available.'}</p></div> : <RoleBrowser key={rolePage} roles={rows} />}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/10 px-4 py-3 text-xs"><Button variant="outline" size="sm" disabled={rolePage === 1 || roles.isFetching || busy} onClick={() => { setChoices({}); setRolePage(rolePage - 1) }}>Previous roles</Button><span className="text-muted-foreground">Page {rolePage} of {roles.data?.data?.meta?.pages || 1}</span><Button variant="outline" size="sm" disabled={rolePage >= (roles.data?.data?.meta?.pages || 1) || roles.isFetching || busy} onClick={() => { setChoices({}); setRolePage(rolePage + 1) }}>Next roles</Button></div>
        </CardContent></Card>
      </TabsContent>
    </Tabs>
    <AlertDialog open={!!pendingRevoke && canManage} onOpenChange={open => { if (!open && !busy) setPendingRevoke(null) }}>
      <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Revoke role?</AlertDialogTitle><AlertDialogDescription>Remove {pendingRevoke?.name} from {pendingRevoke?.person}? Access from this role will end on their next request. Removing your own administrator role may remove your access to this page.</AlertDialogDescription></AlertDialogHeader>
        {revoke.isError && <p role="alert">{errorMessage(revoke.error)}</p>}
        <AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel><Button disabled={busy} onClick={() => { if (pendingRevoke) revoke.mutate({ companyId, assignmentId: pendingRevoke.assignmentId }) }}>{revoke.isPending ? 'Revoking…' : 'Confirm revoke'}</Button></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
}

function SelectedCompanyRoles() {
  const params = useSearchParams()
  const router = useRouter()
  const { user } = useUserFromStorage()
  const platform = user.role === 'superAdmin'
  const ownCapabilities = useCapabilities(undefined, !platform)
  const companies = useQuery({ queryKey: ['role-company-options', user.id], queryFn: getCompanies, enabled: !!user.id && platform, retry: false })
  const ownCompany = ownCapabilities.data?.data?.data
  const options: { id: string; name: string }[] = platform
    ? (companies.isSuccess ? (companies.data?.data?.data || []).filter((company: { isActive: boolean }) => company.isActive) : [])
    : ownCapabilities.isSuccess && ownCompany?.companyId ? [{ id: ownCompany.companyId, name: ownCompany.companyName || 'Your company' }] : []
  const requestedCompany = params.get('companyId') || ''
  const companyId = options.some(company => company.id === requestedCompany) ? requestedCompany : ''
  const loading = platform ? companies.isPending : ownCapabilities.isPending
  const failed = platform ? companies.isError : ownCapabilities.isError
  const denied = !platform && ownCapabilities.isSuccess && !ownCompany?.permissions?.includes('access.view')
  return <div className="mx-auto max-w-7xl space-y-4">
    <header className="sticky top-0 z-30 flex flex-col justify-between gap-2 border-b bg-background py-2 lg:flex-row lg:items-center"><h1 className="min-w-0 text-xl font-bold tracking-tight sm:text-2xl">Roles & permissions</h1>
      {!denied && <div className="w-full space-y-2 lg:w-72 lg:shrink-0">
        <div className="flex items-center gap-2"><Building2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0 flex-1"><Label className="sr-only" htmlFor="roles-company">Company</Label><select id="roles-company" aria-describedby="roles-company-help" className="block h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 sm:max-w-md" value={companyId} disabled={loading || failed} onChange={event => {
          const next = new URLSearchParams(params.toString())
          if (event.target.value) next.set('companyId', event.target.value)
          else next.delete('companyId')
          router.replace(`/admin/roles${next.size ? `?${next.toString()}` : ''}`, { scroll: false })
        }}><option value="">{loading ? 'Loading companies…' : 'Select a company'}</option>{options.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}</select><p id="roles-company-help" className="sr-only">{platform ? 'Roles and members are shown only for the selected company.' : 'Your access is limited to your own company.'}</p></div></div>
        {failed && <div className="space-y-2"><p role="alert">Unable to load available companies. {errorMessage(platform ? companies.error : ownCapabilities.error)}</p><Button variant="outline" onClick={() => platform ? companies.refetch() : ownCapabilities.refetch()}>Retry companies</Button></div>}
        {!loading && !failed && !options.length && <p role="status" className="text-sm text-muted-foreground">No available companies.</p>}
        {requestedCompany && !companyId && !loading && !failed && <p role="alert" className="text-sm text-muted-foreground">This company is unavailable. Select an available company to continue.</p>}
      </div>}
    </header>
    {denied ? <p role="alert">You do not have permission to view company roles.</p> : <>
      {companyId ? <RolesContent key={`${user.id}:${companyId}`} companyId={companyId} /> : <Card className="rounded-xl border-dashed shadow-none"><CardContent className="flex flex-col items-center gap-3 py-12 text-center"><Users className="h-8 w-8 text-muted-foreground" aria-hidden="true" /><h2 className="font-semibold">Company members</h2><p className="text-sm text-muted-foreground">Select a company above to view its members and roles.</p></CardContent></Card>}
    </>}
  </div>
}
export default function RolesPage() {
  return <Suspense fallback={<p role="status" className="p-6">Loading access permissions…</p>}><SelectedCompanyRoles /></Suspense>
}
