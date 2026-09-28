"use client"
import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useUserFromStorage } from '@/hooks/user.context'
import { getCompanies, createCompany, getCompanyAdmins, createCompanyAdmin } from '@/lib/api/company-api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Company = { id: string; name: string; slug: string; industry: string }
type Admin = { id: string; email: string; firstName: string; lastName: string; companyId: string; isActive: boolean }
const message = (error: any) => error?.response?.data?.error || error?.message || 'Request failed'
export default function CompaniesPage() {
  const { user } = useUserFromStorage()
  const enabled = user.role === 'superAdmin'
  const client = useQueryClient()
  const companies = useQuery({ queryKey: ['companies'], queryFn: getCompanies, enabled, retry: false })
  const admins = useQuery({ queryKey: ['company-admins'], queryFn: getCompanyAdmins, enabled, retry: false })
  const [company, setCompany] = useState({ name: '', slug: '', industry: '' })
  const [admin, setAdmin] = useState({ companyId: '', email: '', firstName: '', lastName: '', password: '' })
  const [success, setSuccess] = useState('')
  const companyMutation = useMutation({ mutationFn: createCompany, onSuccess: async () => {
    setCompany({ name: '', slug: '', industry: '' }); setSuccess('Company created with its own attendance settings.'); await client.invalidateQueries({ queryKey: ['companies'] })
  } })
  const adminMutation = useMutation({ mutationFn: createCompanyAdmin, onSuccess: async () => {
    setAdmin({ companyId: '', email: '', firstName: '', lastName: '', password: '' }); setSuccess('Admin account created. Share the password securely with the administrator.'); await client.invalidateQueries({ queryKey: ['company-admins'] })
  } })
  if (!enabled) return <div className="p-6">Super-admin access is required.</div>
  const rows: Company[] = companies.data?.data?.data || []
  const accounts: Admin[] = admins.data?.data?.data || []
  return <div className="p-4 md:p-6 space-y-6">
    <div><h1 className="text-3xl font-bold">Companies & Admins</h1><p className="text-muted-foreground">Create companies and administrators. Each company has its own attendance settings.</p></div>
    {success && <p role="status" className="text-green-700">{success}</p>}
    {(companies.isError || admins.isError) && <p role="alert">{message(companies.error || admins.error)}</p>}
    <div className="grid gap-6 lg:grid-cols-2">
      <Card><CardHeader><CardTitle>Create company</CardTitle></CardHeader><CardContent>
        <form className="space-y-4" onSubmit={(e: FormEvent) => { e.preventDefault(); setSuccess(''); companyMutation.mutate(company) }}>
          {([['name','Company name'],['slug','Company code'],['industry','Industry']] as const).map(([key,label]) => <div className="space-y-2" key={key}><Label htmlFor={`company-${key}`}>{label}</Label><Input id={`company-${key}`} required maxLength={key === 'slug' ? 100 : 200} pattern={key === 'slug' ? '[a-z0-9]+(-[a-z0-9]+)*' : undefined} value={company[key]} onChange={e => setCompany({ ...company, [key]: e.target.value })} /></div>)}
          <p className="text-sm text-muted-foreground">Use a unique lowercase code, such as thermopharm or acme-it.</p>
          {companyMutation.isError && <p role="alert">{message(companyMutation.error)}</p>}
          <Button disabled={companyMutation.isPending}>Create company</Button>
        </form>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Create company admin</CardTitle></CardHeader><CardContent>
        <form className="space-y-4" onSubmit={(e: FormEvent) => { e.preventDefault(); setSuccess(''); adminMutation.mutate(admin) }}>
          <div className="space-y-2"><Label htmlFor="admin-company">Company</Label><select id="admin-company" className="w-full border rounded-md p-2 bg-background" required value={admin.companyId} onChange={e => setAdmin({ ...admin, companyId: e.target.value })}><option value="">Select company</option>{rows.map(row => <option key={row.id} value={row.id}>{row.name}</option>)}</select></div>
          {([['firstName','First name'],['lastName','Last name'],['email','Login email'],['password','Initial password']] as const).map(([key,label]) => <div className="space-y-2" key={key}><Label htmlFor={`admin-${key}`}>{label}</Label><Input id={`admin-${key}`} type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'} minLength={key === 'password' ? 12 : key === 'email' ? undefined : 2} maxLength={key === 'password' ? 72 : key === 'email' ? 254 : 50} autoComplete={key === 'password' ? 'new-password' : 'off'} required value={admin[key]} onChange={e => setAdmin({ ...admin, [key]: e.target.value })} /></div>)}
          {adminMutation.isError && <p role="alert">{message(adminMutation.error)}</p>}
          <Button disabled={adminMutation.isPending || !rows.length}>Create admin</Button>
        </form>
      </CardContent></Card>
    </div>
    <Card><CardHeader><CardTitle>Companies</CardTitle></CardHeader><CardContent className="space-y-3">{companies.isPending ? <p>Loading…</p> : rows.map(row => <div className="flex flex-wrap justify-between gap-3 border-b pb-3" key={row.id}><div><p className="font-medium">{row.name}</p><p className="text-sm text-muted-foreground">{row.industry} · {row.slug}</p></div><div className="flex gap-4"><Link className="underline" href={`/admin/roles?companyId=${encodeURIComponent(row.id)}`}>Manage roles</Link><Link className="underline" href={`/admin/settings?companyId=${encodeURIComponent(row.id)}`}>Manage settings</Link></div></div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle>Company administrators</CardTitle></CardHeader><CardContent className="space-y-3">{admins.isPending ? <p>Loading…</p> : accounts.map(row => <div key={row.id} className="border-b pb-3"><p className="font-medium">{row.firstName} {row.lastName}</p><p className="text-sm break-all">{row.email}</p><p className="text-sm text-muted-foreground">{rows.find(company => company.id === row.companyId)?.name || row.companyId} · {row.isActive ? 'Active' : 'Inactive'}</p></div>)}</CardContent></Card>
  </div>
}
