"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Building2, BriefcaseBusiness, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useUserFromStorage } from '@/hooks/user.context'
import { useCapabilities } from '@/hooks/use-capabilities'
import { getEmployeeOptions, addEmployeeOption } from '@/lib/api/employee-options'

function OptionList({ kind, title, rows, onSaved, onDenied }: { kind: string; title: string; rows: any[]; onSaved: () => void; onDenied: () => void }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const mutation = useMutation({ mutationFn: addEmployeeOption })
  return <Card><CardHeader><CardTitle className="flex items-center gap-2">{kind === 'department' ? <Building2 className="h-5 w-5" /> : <BriefcaseBusiness className="h-5 w-5" />}{title}</CardTitle><CardDescription>{rows.length} company option{rows.length === 1 ? '' : 's'}</CardDescription></CardHeader>
    <CardContent className="space-y-5">
      <form className="space-y-2" onSubmit={async event => {
        event.preventDefault(); if (!name.trim() || mutation.isPending) return
        setError(''); setSuccess('')
        try { await mutation.mutateAsync({ kind, name: name.trim() }); setName(''); setSuccess(`${name.trim()} added.`); onSaved() }
        catch (error: any) { if (error?.response?.status === 403) { onDenied(); setError('Your permission has changed. Contact your administrator.') } else setError(error?.response?.status === 409 ? 'This option already exists.' : 'Unable to save. Please try again.') }
      }}>
        <Label htmlFor={kind}>New {kind === 'department' ? 'department' : 'job title'}</Label>
        <div className="flex gap-2"><Input id={kind} value={name} required maxLength={100} disabled={mutation.isPending} onChange={event => setName(event.target.value)} /><Button type="submit" disabled={!name.trim() || mutation.isPending} aria-label={`Add ${kind === 'department' ? 'department' : 'job title'}`}>{mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}<span className="ml-2">Add</span></Button></div>
      </form>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}{success && <p role="status" className="text-sm text-emerald-700">{success}</p>}
      {rows.length ? <ul className="max-h-96 divide-y overflow-auto rounded-lg border">{rows.map(row => <li key={row.id} className="break-words px-4 py-3 text-sm">{row.name}</li>)}</ul> : <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">No {title.toLowerCase()} yet. Add the first option above.</p>}
    </CardContent></Card>
}
export default function EmployeeOptionsPage() {
  const { user } = useUserFromStorage()
  const capabilities = useCapabilities(undefined)
  const access = capabilities.data?.data?.data
  const allowed = capabilities.isSuccess && (user?.role === 'superAdmin' || access?.permissions?.includes('employee.manage'))
  const client = useQueryClient()
  const queryKey = ['employee-options', user?.id, user?.companyId]
  const options = useQuery({ queryKey, queryFn: getEmployeeOptions, enabled: !!allowed, retry: false })
  return <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
    <Link href="/admin/employees" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" />Employees</Link>
    <header><h1 className="text-3xl font-bold">Departments & job titles</h1><p className="mt-2 text-muted-foreground">Manage the options available when onboarding employees{access?.companyName ? ` at ${access.companyName}` : ''}.</p><p className="mt-2 text-sm text-muted-foreground">Job titles are available across departments. HR users need the employee management permission.</p></header>
    {!user?.id || capabilities.isLoading ? <p role="status">Checking permissions…</p> : capabilities.isError ? <div role="alert">Unable to verify permissions. <Button variant="outline" onClick={() => capabilities.refetch()}>Retry permissions</Button></div> : !allowed ? <p role="alert">You do not have permission to manage employee options.</p> : options.isLoading ? <p role="status">Loading company options…</p> : options.isError ? <div role="alert">Unable to load company options. <Button variant="outline" onClick={() => options.refetch()}>Retry options</Button></div> : <div className="grid gap-6 md:grid-cols-2">{[['department', 'Departments'], ['job_title', 'Job titles']].map(([kind, title]) => <OptionList key={`${user.id}:${user.companyId}:${kind}`} kind={kind} title={title} rows={(options.data?.data?.data || []).filter((row: any) => row.kind === kind)} onSaved={() => { void client.invalidateQueries({ queryKey }) }} onDenied={() => { void capabilities.refetch() }} />)}</div>}
    <Button asChild variant="outline"><Link href="/admin/employees/add">Start employee onboarding</Link></Button>
  </div>
}
