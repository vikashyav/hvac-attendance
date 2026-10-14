"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Formik, Form, getIn, useFormikContext } from 'formik'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardCheck, BriefcaseBusiness, UserRound, HeartHandshake, Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useCapabilities } from '@/hooks/use-capabilities'
import { useUserFromStorage } from '@/hooks/user.context'
import { getEmployeeOptions } from '@/lib/api/employee-options'
import { employeeRegistration } from '@/lib/api/employee'
import { initialOnboardingValues, onboardingPayload, onboardingSchema, type OnboardingValues } from './onboarding-schema'

const steps = [
  { title: 'Personal details', description: 'Identity & contact', icon: UserRound, fields: ['firstName', 'lastName', 'email', 'phone', 'address'] },
  { title: 'Employment', description: 'Role & joining details', icon: BriefcaseBusiness, fields: ['department', 'position', 'hireDate', 'salary', 'skills', 'notes'] },
  { title: 'Emergency contact', description: 'Someone we can reach', icon: HeartHandshake, fields: ['emergencyContact.name', 'emergencyContact.relationship', 'emergencyContact.phone'] },
  { title: 'Review & create', description: 'Check before saving', icon: ClipboardCheck, fields: [] },
]

function OnboardingField({ name, label, hint, multiline = false, optional = false, ...props }: {
  name: string; label: string; hint?: string; multiline?: boolean; optional?: boolean
  type?: string; autoComplete?: string; placeholder?: string; maxLength?: number
}) {
  const form = useFormikContext<OnboardingValues>()
  const error = getIn(form.touched, name) && getIn(form.errors, name)
  const id = name.replaceAll('.', '-')
  const attributes = { ...form.getFieldProps(name), ...props, id, 'aria-invalid': Boolean(error), 'aria-required': !optional,
    'aria-describedby': `${id}-hint ${id}-error`, className: `bg-background ${error ? 'border-destructive' : ''}` }
  return <div className="space-y-2">
    <Label htmlFor={id}>{label} {optional ? <span className="font-normal text-muted-foreground">(optional)</span> : <span className="text-destructive" aria-hidden="true">*</span>}</Label>
    {multiline ? <Textarea {...attributes} rows={3} /> : <Input {...attributes} />}
    {hint && <p id={`${id}-hint`} className="text-xs leading-relaxed text-muted-foreground">{hint}</p>}
    {error && <p id={`${id}-error`} role="alert" className="text-sm text-destructive">{String(error)}</p>}
  </div>
}

function OnboardingForm({ companyName, saving, saveError }: { companyName: string; saving: boolean; saveError: string }) {
  const form = useFormikContext<OnboardingValues>()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [discard, setDiscard] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const { values } = form
  const { user } = useUserFromStorage()
  const optionsQuery = useQuery({ queryKey: ['employee-options', user?.id, user?.companyId], queryFn: getEmployeeOptions, retry: false })
  const options = optionsQuery.data?.data?.data || []
  useEffect(() => {
    if (!form.dirty || saving) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [form.dirty, saving])
  useEffect(() => { heading.current?.focus() }, [step])

  const next = async () => {
    const errors = await form.validateForm()
    if (step === 1) {
      if (!optionsQuery.isSuccess) return
      for (const [field, kind] of [['department', 'department'], ['position', 'job_title']]) {
        if (!options.some((option: any) => option.kind === kind && option.name === getIn(form.values, field))) {
          form.setFieldError(field, 'Select a configured company option'); form.setFieldTouched(field, true, false); return
        }
      }
    }
    const fields = steps[step].fields
    await Promise.all(fields.map(name => form.setFieldTouched(name, true, false)))
    const invalid = fields.find(name => getIn(errors, name))
    if (invalid) { document.getElementById(invalid.replaceAll('.', '-'))?.focus(); return }
    setStep(current => current + 1)
  }
  const cancel = () => form.dirty ? setDiscard(true) : router.push('/admin/employees')
  const review = [
    { title: 'Personal details', step: 0, rows: [['Full name', `${values.firstName} ${values.lastName}`], ['Email', values.email], ['Phone', values.phone], ['Home address', values.address]] },
    { title: 'Employment', step: 1, rows: [['Department', values.department], ['Job title', values.position], ['Joining date', values.hireDate], ['Annual salary', values.salary || 'Not provided'], ['Skills', values.skills || 'Not provided'], ['Notes', values.notes || 'Not provided']] },
    { title: 'Emergency contact', step: 2, rows: [['Contact name', values.emergencyContact.name], ['Relationship', values.emergencyContact.relationship], ['Contact phone', values.emergencyContact.phone]] },
  ]
  return <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
    <aside className="space-y-6">
      <nav aria-label="Onboarding progress" className="rounded-xl border bg-card p-3 lg:p-4">
        <ol className="grid grid-cols-4 gap-1 lg:grid-cols-1 lg:gap-3">
          {steps.map((item, index) => <li key={item.title}>
            <button type="button" disabled={index > step || saving} onClick={() => setStep(index)} aria-current={step === index ? 'step' : undefined}
              className={`flex w-full flex-col items-center gap-2 rounded-lg p-2 text-left lg:flex-row lg:gap-3 lg:p-3 ${step === index ? 'bg-primary/10 text-primary' : index < step ? 'text-foreground' : 'text-muted-foreground'} disabled:cursor-default`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${step === index ? 'border-primary bg-primary text-primary-foreground' : ''}`}>{index < step ? <Check className="h-4 w-4" /> : index + 1}</span>
              <span><span className="block text-center text-xs font-medium lg:text-left lg:text-sm">{item.title}</span><span className="hidden text-xs text-muted-foreground lg:block">{item.description}</span></span>
            </button>
          </li>)}
        </ol>
      </nav>
      <div className="hidden rounded-xl border border-dashed p-5 text-sm lg:block">
        <ShieldCheck className="mb-3 h-5 w-5 text-primary" /><p className="font-medium">A good start, all in one place.</p>
        <p className="mt-2 leading-relaxed text-muted-foreground">Keep the employee’s contact and joining details ready. You can review everything before creating their record.</p>
      </div>
    </aside>
    <Form noValidate onKeyDown={event => { if (event.key === 'Enter' && step < 3 && event.target instanceof HTMLInputElement) { event.preventDefault(); void next() } }} className="min-w-0">
      <Card className="overflow-hidden shadow-sm">
        <div className="border-b px-5 py-6 sm:px-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Step {step + 1} of 4</p>
          <h2 ref={heading} tabIndex={-1} className="text-xl font-semibold outline-none sm:text-2xl">{steps[step].title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{['Start with the details that identify and connect you with your new team member.', 'Set up where they belong and when their journey begins.', 'Add a trusted person to contact in an emergency.', 'Confirm these details. Creating the employee also creates their portal account.'][step]}</p>
        </div>
        <CardContent className="p-5 sm:p-8">
          <fieldset disabled={saving} className="min-w-0 space-y-6">
            {step === 0 && <>
              <div className="grid gap-5 sm:grid-cols-2"><OnboardingField name="firstName" label="First name" autoComplete="given-name" maxLength={50} /><OnboardingField name="lastName" label="Last name" autoComplete="family-name" maxLength={50} /></div>
              <div className="grid gap-5 sm:grid-cols-2"><OnboardingField name="email" label="Email address" type="email" autoComplete="email" hint="Used to sign in to the employee portal." /><OnboardingField name="phone" label="Phone number" type="tel" autoComplete="tel" hint="Include country code, without spaces or punctuation." /></div>
              <OnboardingField name="address" label="Home address" multiline autoComplete="street-address" maxLength={1000} hint="Include street, city, state or region, postal code, and country." />
            </>}
            {step === 1 && <>
              <div className="rounded-lg border bg-muted/30 p-4 text-sm">Choose from your company’s configured options. <Link href="/admin/employees/options" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline">Manage departments & job titles (new tab)</Link><Button type="button" size="sm" variant="ghost" onClick={() => optionsQuery.refetch()}>Refresh options</Button></div>
              {optionsQuery.isLoading && <p role="status">Loading company options…</p>}
              {optionsQuery.isError && <p role="alert" className="text-destructive">Unable to load options. Use Refresh options to try again.</p>}
              <div className="grid gap-5 sm:grid-cols-2">{[['department', 'department', 'Department'], ['position', 'job_title', 'Job title']].map(([field, kind, label]) => <div key={field} className="space-y-2"><Label htmlFor={field}>{label} <span className="text-destructive">*</span></Label><select id={field} {...form.getFieldProps(field)} disabled={!optionsQuery.isSuccess || saving} aria-required="true" aria-invalid={Boolean(getIn(form.touched, field) && getIn(form.errors, field))} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="">Select {label.toLowerCase()}</option>{options.filter((row: any) => row.kind === kind).map((row: any) => <option key={row.id} value={row.name}>{row.name}</option>)}</select>{getIn(form.touched, field) && getIn(form.errors, field) && <p role="alert" className="text-sm text-destructive">{getIn(form.errors, field)}</p>}{optionsQuery.isSuccess && !options.some((row: any) => row.kind === kind) && <p className="text-xs text-muted-foreground">No {label.toLowerCase()} options yet. Add one using Manage departments & job titles.</p>}</div>)}</div>
              <div className="grid gap-5 sm:grid-cols-2"><OnboardingField name="hireDate" label="Joining date" type="date" /><OnboardingField name="salary" label="Annual salary" optional type="text" hint="If available, enter the amount in your company’s payroll currency." /></div>
              <OnboardingField name="skills" label="Skills" optional maxLength={1000} placeholder="e.g. Project coordination, Excel, Customer support" hint="Separate skills with commas." />
              <OnboardingField name="notes" label="Onboarding notes" optional multiline maxLength={500} hint="Include any useful joining information. Up to 500 characters." />
            </>}
            {step === 2 && <>
              <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">Ask the employee for a contact who can be reached if they need assistance.</div>
              <div className="grid gap-5 sm:grid-cols-2"><OnboardingField name="emergencyContact.name" label="Contact full name" maxLength={100} /><OnboardingField name="emergencyContact.relationship" label="Relationship" placeholder="e.g. Parent, Spouse, Friend" maxLength={100} /></div>
              <div className="sm:max-w-sm"><OnboardingField name="emergencyContact.phone" label="Contact phone number" type="tel" hint="Include country code, without spaces or punctuation." /></div>
            </>}
            {step === 3 && <div className="space-y-5">
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">This employee will be added to <strong>{companyName}</strong>.</div>
              {review.map(section => <section key={section.title} className="rounded-lg border p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">{section.title}</h3><Button type="button" variant="ghost" size="sm" onClick={() => setStep(section.step)} aria-label={`Edit ${section.title.toLowerCase()}`}>Edit</Button></div>
                <dl className="grid gap-4 sm:grid-cols-2">{section.rows.map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm font-medium">{value}</dd></div>)}</dl>
              </section>)}
              <p className="text-xs leading-relaxed text-muted-foreground">Details are saved when you select Create employee. No invitation email is sent by this form.</p>
            </div>}
          </fieldset>
          {saveError && <div role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{saveError}</div>}
        </CardContent>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-5 py-4 sm:px-8">
          <Button type="button" variant="ghost" onClick={cancel} disabled={saving}>Cancel</Button>
          <div className="flex gap-2">
            {step > 0 && <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={saving}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>}
            {step < 3 ? <Button type="button" onClick={next}>Continue<ArrowRight className="ml-2 h-4 w-4" /></Button> : <Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}{saving ? 'Creating…' : 'Create employee'}</Button>}
          </div>
        </div>
      </Card>
      <p className="mt-4 text-xs text-muted-foreground">* Required fields · Unsaved details stay only on this page.</p>
      <AlertDialog open={discard} onOpenChange={setDiscard}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Discard this onboarding?</AlertDialogTitle><AlertDialogDescription>The employee has not been created. Your unsaved details will be lost.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep editing</AlertDialogCancel><AlertDialogAction onClick={() => router.push('/admin/employees')}>Discard details</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </Form>
  </div>
}

function Onboarding({ companyName, scope, recheck }: { companyName: string; scope: string[]; recheck: () => unknown }) {
  const queryClient = useQueryClient()
  const [saveError, setSaveError] = useState('')
  const [created, setCreated] = useState('')
  const mutation = useMutation({ mutationFn: employeeRegistration })
  const savingRef = useRef(false)
  if (created) return <Card className="mx-auto max-w-2xl text-center"><CardContent className="space-y-5 px-6 py-12"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" /><h2 className="text-2xl font-semibold">Employee created</h2><p className="text-muted-foreground"><strong className="text-foreground">{created}</strong> has been added to {companyName}. Their employee record and portal account are ready.</p><div className="flex flex-wrap justify-center gap-3"><Button asChild><Link href="/admin/employees">View employees</Link></Button><Button variant="outline" onClick={() => { setCreated(''); setSaveError('') }}>Add another employee</Button></div></CardContent></Card>
  return <Formik initialValues={initialOnboardingValues} validationSchema={onboardingSchema} onSubmit={async values => {
    if (savingRef.current) return
    savingRef.current = true
    setSaveError('')
    try {
      await mutation.mutateAsync(onboardingPayload(values))
      void queryClient.invalidateQueries({ queryKey: ['employees', ...scope] })
      void queryClient.invalidateQueries({ queryKey: ['taskEmployees', ...scope] })
      setCreated(`${values.firstName.trim()} ${values.lastName.trim()}`)
    } catch (error: any) {
      if (error?.response?.status === 403) { setSaveError('Your permission to create employees has changed. Contact your administrator.'); recheck() }
      else if ([409, 400, 422].includes(error?.response?.status)) setSaveError('Unable to create the employee. Check the details and whether this email is already registered, then try again.')
      else setSaveError('The employee could not be created. Your details are still here. Check the employee list before retrying if the connection was interrupted.')
    } finally { savingRef.current = false }
  }}><OnboardingForm companyName={companyName} saving={mutation.isPending} saveError={saveError} /></Formik>
}

export default function EmployeeOnboardingPage() {
  const { user } = useUserFromStorage()
  const capabilities = useCapabilities(undefined)
  const access = capabilities.data?.data?.data
  const allowed = capabilities.isSuccess && (user?.role === 'superAdmin' || access?.permissions?.includes('employee.manage'))
  return <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
    <header className="space-y-4"><Link href="/admin/employees" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Employees</Link>
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Employee onboarding</p><h1 className="text-3xl font-bold tracking-tight">Add new employee</h1><p className="mt-2 text-sm text-muted-foreground">A thoughtful first step for your newest team member.</p></div>{access?.companyName && <span className="rounded-full border bg-card px-3 py-1.5 text-sm font-medium">{access.companyName}</span>}</div>
    </header>
    {!user?.id || capabilities.isLoading ? <div role="status" className="flex items-center gap-3 rounded-xl border p-8"><Loader2 className="h-5 w-5 animate-spin" />Checking employee management access…</div> : capabilities.isError ? <div role="alert" className="rounded-xl border p-6"><p>Unable to verify employee management permissions.</p><Button className="mt-4" variant="outline" onClick={() => capabilities.refetch()}>Retry permissions</Button></div> : !allowed ? <div role="alert" className="rounded-xl border p-6">You do not have permission to create employees. Contact your company administrator.</div> : <Onboarding key={`${user.id}:${user.companyId}`} companyName={access?.companyName || 'your company'} scope={[user.id, user.companyId]} recheck={capabilities.refetch} />}
  </div>
}
