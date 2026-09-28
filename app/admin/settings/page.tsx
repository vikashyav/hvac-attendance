"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2 } from "lucide-react"
import { useCapabilities } from "@/hooks/use-capabilities"
import { getSystemSettings, saveSystemSettings } from "@/lib/api/settings-api"

type Policy = {
  timezone: string; startTime: string; endTime: string; workDays: number[];
  requiredHours: number; halfDayHours: number; graceMinutes: number; breakMinutes: number;
  overtimeEnabled: boolean; overtimeAfterHours: number; allowNonWorkingDays: boolean;
  allowEarlyCheckout: boolean; requirePhoto: boolean; locationEnabled: boolean;
  geofencingEnabled: boolean; geofenceRadius: number;
}
type Settings = { company: { name: string; industry: string; email: string; phone: string; address: string }; attendance: Policy }
type SettingsDocument = { companyId: string; settings: Settings; revision: number }
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const errorMessage = (error: unknown) => {
  const e = error as { response?: { data?: { error?: string } }; message?: string }
  return typeof e?.response?.data?.error === 'string' ? e.response.data.error : e?.message || 'Unable to save settings. Please try again.'
}

export default function SettingsPage() {
  const client = useQueryClient()
  const [companyId, setCompanyId] = useState<string | undefined>(undefined)
  const [ready, setReady] = useState(false)
  useEffect(() => { setCompanyId(new URLSearchParams(window.location.search).get('companyId') || undefined); setReady(true) }, [])
  const capabilities = useCapabilities(companyId, ready)
  const canEdit = capabilities.isSuccess && (capabilities.data?.data?.data?.permissions || []).includes('settings.manage')
  const [draft, setDraft] = useState<SettingsDocument | null>(null)
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState('')
  const query = useQuery({ queryKey: ['system-settings', companyId], queryFn: ({ signal }) => getSystemSettings({ signal, companyId }), enabled: ready, retry: false, refetchOnWindowFocus: false })
  useEffect(() => {
    if (query.data?.data?.data && !dirty) setDraft(structuredClone(query.data.data.data))
  }, [query.data, dirty])
  const mutation = useMutation({
    mutationFn: saveSystemSettings,
    onSuccess: async (response) => {
      setDraft(structuredClone(response.data.data))
      setDirty(false)
      setMessage('Settings saved. Attendance and reports now use these rules.')
      client.setQueryData(['system-settings', companyId], response)
      await client.invalidateQueries({ predicate: query => query.queryKey[0] !== 'system-settings' })
    },
  })
  const changeCompany = (key: keyof Settings['company'], value: string) => {
    if (!draft || !canEdit) return
    setDraft({ ...draft, settings: { ...draft.settings, company: { ...draft.settings.company, [key]: value } } })
    setDirty(true); setMessage(''); mutation.reset()
  }
  const changePolicy = <K extends keyof Policy>(key: K, value: Policy[K]) => {
    if (!draft || !canEdit) return
    const attendance = { ...draft.settings.attendance, [key]: value }
    if (key === 'locationEnabled' && value === false) attendance.geofencingEnabled = false
    setDraft({ ...draft, settings: { ...draft.settings, attendance } })
    setDirty(true); setMessage(''); mutation.reset()
  }
  const submit = (event: FormEvent) => { event.preventDefault(); if (draft && canEdit) mutation.mutate(draft) }
  if (query.isPending) return <div className="p-6" role="status">Loading system settings…</div>
  if (query.isError) return <div className="p-6 space-y-4"><p role="alert">{errorMessage(query.error)}</p><Button onClick={() => query.refetch()}>Retry</Button></div>
  if (!draft) return <div className="p-6" role="alert">The server did not return system settings.</div>
  const { company, attendance: p } = draft.settings
  const toggle = (key: keyof Policy, label: string, description: string, disabled = false) => (
    <div className="flex items-center justify-between gap-4" key={key}>
      <div><Label htmlFor={key}>{label}</Label><p className="text-sm text-muted-foreground">{description}</p></div>
      <Switch id={key} checked={Boolean(p[key])} disabled={disabled || mutation.isPending || !canEdit} onCheckedChange={value => changePolicy(key, value)} />
    </div>
  )
  const numeric = (key: keyof Policy, label: string, min: number, max: number, step = 1) => (
    <div className="space-y-2" key={key}><Label htmlFor={key}>{label}</Label>
      <Input id={key} type="number" required min={min} max={max} step={step} value={Number.isNaN(p[key]) ? '' : Number(p[key])} onChange={e => changePolicy(key, e.target.value === '' ? NaN : Number(e.target.value))} />
    </div>
  )
  return (
    <form onSubmit={submit} className="p-4 md:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold">System Settings</h1><p className="text-muted-foreground">Manage your company and attendance policies</p></div>
        <Button type="submit" disabled={!dirty || mutation.isPending || !canEdit}>{mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Changes</Button>
      </div>
      <p className="text-sm text-muted-foreground">These company-wide rules apply to check-in, check-out, and all report periods, including historical reports. Changing rules recalculates reports from recorded times; it does not change those times.</p>
      {message && <p role="status" className="text-green-700">{message}</p>}
      {mutation.isError && <div role="alert" className="space-y-2 text-destructive"><p>{errorMessage(mutation.error)}</p><Button type="button" variant="outline" onClick={() => { setDirty(false); mutation.reset(); query.refetch() }}>Discard changes and reload</Button></div>}
      {!canEdit && <p role="status">{capabilities.isPending ? 'Checking editing permissions…' : capabilities.isError ? 'Unable to verify editing permissions. Reload the page to try again.' : 'You have read-only access to settings.'}</p>}
      <fieldset disabled={mutation.isPending} className="space-y-6">
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="company">Company</TabsTrigger><TabsTrigger value="schedule">Schedule</TabsTrigger><TabsTrigger value="attendance">Attendance</TabsTrigger></TabsList>
          <TabsContent value="company"><fieldset disabled={!canEdit}><Card><CardHeader><CardTitle>Company Information</CardTitle><CardDescription>Configure your organization for HVAC, IT, or any other industry.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {([['name', 'Company name'], ['industry', 'Industry'], ['email', 'Company email'], ['phone', 'Company phone']] as const).map(([key, label]) => (
                <div key={key} className="space-y-2"><Label htmlFor={key}>{label}</Label><Input id={key} type={key === 'email' ? 'email' : 'text'} required={key === 'name' || key === 'industry'} maxLength={200} value={company?.[key]} onChange={e => changeCompany(key, e.target.value)} /></div>
              ))}
              <div className="space-y-2 md:col-span-2"><Label htmlFor="address">Address</Label><Textarea id="address" maxLength={1000} value={company?.address} onChange={e => changeCompany('address', e.target.value)} /></div>
            </CardContent></Card></fieldset></TabsContent>
          <TabsContent value="schedule"><fieldset disabled={!canEdit}><Card><CardHeader><CardTitle>Working Schedule</CardTitle><CardDescription>An end time earlier than the start time defines an overnight shift. Working days refer to the day the shift starts.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {(['startTime', 'endTime'] as const).map(key => <div key={key} className="space-y-2"><Label htmlFor={key}>{key === 'startTime' ? 'Shift start' : 'Shift end'}</Label><Input id={key} type="time" required value={p?.[key]} onChange={e => changePolicy(key, e.target.value)} /></div>)}
                <div className="space-y-2"><Label htmlFor="timezone">Time zone (IANA)</Label><Input id="timezone" required list="timezones" value={p?.timezone} onChange={e => changePolicy('timezone', e.target.value)} /><datalist id="timezones">{['Asia/Kolkata', 'UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Asia/Dubai', 'Asia/Singapore', 'Australia/Sydney'].map(zone => <option key={zone} value={zone} />)}</datalist></div>
              </div>
              <div><Label>Working days</Label><div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">{days.map((day, index) => <div key={day} className="flex gap-2 items-center"><Switch id={day} checked={p?.workDays.includes(index)} onCheckedChange={checked => changePolicy('workDays', checked ? [...p.workDays, index] : p.workDays.filter(d => d !== index))} /><Label htmlFor={day}>{day}</Label></div>)}</div></div>
              <div className="grid gap-4 md:grid-cols-3">{numeric('requiredHours', 'Full-day hours (after breaks)', 0.25, 24, 0.25)}{numeric('halfDayHours', 'Minimum half-day hours', 0.25, 24, 0.25)}{numeric('breakMinutes', 'Unpaid break per shift (minutes)', 0, 720)}{numeric('graceMinutes', 'Late arrival grace (minutes)', 0, 720)}</div>
              {toggle('allowNonWorkingDays', 'Allow work on non-working days', 'Off-day hours are included in hours and overtime, but do not inflate scheduled-day attendance rates.')}
              {toggle('allowEarlyCheckout', 'Allow early check-out', 'When disabled, employees must wait until the shift ends to check out.')}
            </CardContent></Card></fieldset></TabsContent>
          <TabsContent value="attendance"><fieldset disabled={!canEdit}><Card><CardHeader><CardTitle>Attendance Rules</CardTitle><CardDescription>Requirements are enforced by the server for both check-in and check-out.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              {toggle('overtimeEnabled', 'Calculate overtime', 'Count net hours beyond the overtime threshold.')}
              {p.overtimeEnabled && numeric('overtimeAfterHours', 'Overtime begins after (hours)', 0.25, 24, 0.25)}
              {toggle('requirePhoto', 'Require attendance photo', 'Require a fresh photo for each check-in and check-out.')}
              {toggle('locationEnabled', 'Require GPS location', 'Collect location for attendance. Disable for teams that do not need location tracking.')}
              {toggle('geofencingEnabled', 'Restrict attendance to project sites', 'Use the company radius around active project sites. Check-out uses the check-in site when one was recorded.', !p.locationEnabled)}
              {p.geofencingEnabled && numeric('geofenceRadius', 'Allowed radius (meters)', 10, 100000)}
            </CardContent></Card></fieldset></TabsContent>
        </Tabs>
      </fieldset>
    </form>
  )
}
