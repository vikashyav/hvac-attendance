'use client'
import { Suspense, useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUserFromStorage } from '@/hooks/user.context'
import { useCapabilities } from '@/hooks/use-capabilities'
import { getPermissions, getRoles, getMemberships, createRole, assignRole, revokeRole } from '@/lib/api/access-api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
  const create = useMutation({ mutationFn: createRole, onSuccess: async () => { setDraft({ code: '', name: '', permissions: [] }); setNotice('Role created.'); await refresh() } })
  const assign = useMutation({ mutationFn: assignRole, onSuccess: async () => { setChoices({}); setNotice('Role assigned.'); await refresh() } })
  const revoke = useMutation({ mutationFn: revokeRole, onSuccess: async () => { setPendingRevoke(null); setNotice('Role revoked.'); await refresh() } })
  const busy = create.isPending || assign.isPending || revoke.isPending
  const rows: Role[] = roles.data?.data?.data || []
  const people: Member[] = members.data?.data?.data || []
  const permissions: string[] = catalog.data?.data?.data || []
  const resetMessages = () => { setNotice(''); create.reset(); assign.reset(); revoke.reset() }
  if (capabilities.isPending) return <p role="status" className="p-6">Loading access permissions…</p>
  if (capabilities.isError) return <div className="p-6"><p role="alert">{errorMessage(capabilities.error)}</p><Button onClick={() => capabilities.refetch()}>Retry</Button></div>
  if (!canView) return <p role="alert" className="p-6">You do not have permission to view company roles.</p>
  const failed = roles.isError || members.isError || catalog.isError
  return <div className="p-4 md:p-6 space-y-6">
    <header><h1 className="text-3xl font-bold">Roles & permissions</h1><p className="text-muted-foreground">Manage access to settings and role administration for this company.</p><p className="text-sm">Company: {capabilities.data?.data?.data?.companyName || 'Current company'}</p>{!canManage && <p>You have read-only access.</p>}</header>
    {notice && <p role="status" className="text-green-700">{notice}</p>}
    {(create.isError || assign.isError || revoke.isError) && <p role="alert">{errorMessage(create.error || assign.error || revoke.error)}</p>}
    {failed && <div><p role="alert">{errorMessage(roles.error || members.error || catalog.error)}</p><Button onClick={() => { roles.refetch(); members.refetch(); catalog.refetch() }}>Retry lists</Button></div>}
    {canManage && <Card><CardHeader><CardTitle>Create company role</CardTitle></CardHeader><CardContent>
      <form className="space-y-4" onSubmit={(event: FormEvent) => { event.preventDefault(); resetMessages(); create.mutate({ ...draft, companyId }) }}>
        <fieldset disabled={busy || catalog.isPending || catalog.isError} className="space-y-4">
          <div><Label htmlFor="role-name">Role name</Label><Input id="role-name" required maxLength={120} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></div>
          <div><Label htmlFor="role-code">Unique role code</Label><Input id="role-code" required maxLength={80} pattern="[a-z][a-z0-9-]{0,79}" placeholder="settings-reviewer" value={draft.code} onChange={e => setDraft({ ...draft, code: e.target.value })} /></div>
          <fieldset><legend className="font-medium mb-2">Permissions</legend>{catalog.isPending ? <p role="status">Loading permission catalog…</p> : permissions.map(code => <label className="flex items-center gap-2 py-1" key={code}><input type="checkbox" checked={draft.permissions.includes(code)} onChange={e => setDraft({ ...draft, permissions: e.target.checked ? [...draft.permissions, code] : draft.permissions.filter(item => item !== code) })} />{code}</label>)}</fieldset>
          <Button type="submit">{create.isPending ? 'Creating…' : 'Create role'}</Button>
        </fieldset>
      </form>
    </CardContent></Card>}
    <Card><CardHeader><CardTitle>Company roles</CardTitle></CardHeader><CardContent className="space-y-4">
      {roles.isPending ? <p role="status">Loading roles…</p> : !roles.isError && !rows.length ? <p>No roles on this page.</p> : rows.map(role => <div key={role.id} className="border-b pb-3"><h3 className="font-medium">{role.name}</h3><p className="text-sm text-muted-foreground">{role.code}</p><p className="text-sm break-words">{role.permissions.join(', ') || 'No permissions'}</p></div>)}
      <div className="flex items-center gap-3"><Button variant="outline" disabled={rolePage === 1 || roles.isFetching || busy} onClick={() => { setChoices({}); setRolePage(rolePage - 1) }}>Previous roles</Button><span>Page {rolePage}</span><Button variant="outline" disabled={rolePage >= (roles.data?.data?.meta?.pages || 1) || roles.isFetching || busy} onClick={() => { setChoices({}); setRolePage(rolePage + 1) }}>Next roles</Button></div>
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Company members</CardTitle></CardHeader><CardContent className="space-y-6">
      {members.isPending ? <p role="status">Loading members…</p> : !members.isError && !people.length ? <p>No members on this page.</p> : people.map(member => {
        const name = member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Unavailable account'
        return <section key={member.id} className="border-b pb-5 space-y-2">
          <h3 className="font-semibold">{name}</h3><p className="text-sm break-all">{member.user?.email}</p>
          <p className="text-sm">{member.isActive && member.user?.isActive ? 'Active' : 'Inactive'}{member.user?.isPlatformAdmin ? ' · Platform administrator' : ''}</p>
          <div className="flex flex-wrap gap-2">{member.roles.length ? member.roles.map(role => <div className="border rounded p-2 flex gap-2 items-center" key={role.assignmentId}><span>{role.name}</span>{canManage && <Button variant="outline" size="sm" disabled={busy} aria-label={`Revoke ${role.name} from ${name}`} onClick={() => { resetMessages(); setPendingRevoke({ assignmentId: role.assignmentId, name: role.name, person: name }) }}>Revoke</Button>}</div>) : <p>No assigned roles.</p>}</div>
          <p className="text-sm break-words">Effective permissions: {member.permissions.join(', ') || 'None'}</p>
          {canManage && <div className="flex flex-wrap gap-2 items-end"><div><Label htmlFor={`assign-${member.id}`}>Assign role to {name}</Label><select id={`assign-${member.id}`} className="block w-full rounded border p-2 bg-background" disabled={busy || roles.isFetching || roles.isError || !member.isActive || !member.user?.isActive} value={choices[member.id] || ''} onChange={e => setChoices({ ...choices, [member.id]: e.target.value })}><option value="">Choose a role from the roles page above</option>{rows.filter(role => !member.roles.some(item => item.roleId === role.id)).map(role => <option value={role.id} key={role.id}>{role.name}</option>)}</select></div><Button disabled={busy || roles.isFetching || roles.isError || !choices[member.id] || !member.isActive || !member.user?.isActive} onClick={() => { resetMessages(); assign.mutate({ companyId, membershipId: member.id, roleId: choices[member.id] }) }}>Assign role</Button></div>}
        </section>
      })}
      <div className="flex items-center gap-3"><Button variant="outline" disabled={memberPage === 1 || members.isFetching || busy} onClick={() => setMemberPage(memberPage - 1)}>Previous members</Button><span>Page {memberPage}</span><Button variant="outline" disabled={memberPage >= (members.data?.data?.meta?.pages || 1) || members.isFetching || busy} onClick={() => setMemberPage(memberPage + 1)}>Next members</Button></div>
    </CardContent></Card>
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
  const companyId = params.get('companyId') || undefined
  return <RolesContent key={companyId || 'current-company'} companyId={companyId} />
}
export default function RolesPage() {
  return <Suspense fallback={<p role="status" className="p-6">Loading access permissions…</p>}><SelectedCompanyRoles /></Suspense>
}
