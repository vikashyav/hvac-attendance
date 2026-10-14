import * as yup from 'yup'

const phone = yup.string().trim().matches(/^\+?[1-9]\d{5,15}$/, 'Use 6–16 digits, with an optional + country code').required('Phone number is required')
export const onboardingSchema = yup.object({
  firstName: yup.string().trim().min(2, 'Enter at least 2 characters').max(50).required('First name is required'),
  lastName: yup.string().trim().min(2, 'Enter at least 2 characters').max(50).required('Last name is required'),
  email: yup.string().trim().email('Enter a valid email address').max(254).required('Email is required'),
  phone,
  address: yup.string().trim().max(1000).required('Home address is required'),
  department: yup.string().trim().max(100).required('Department is required'),
  position: yup.string().trim().max(100).required('Job title is required'),
  hireDate: yup.string().required('Joining date is required').test('date', 'Enter a valid joining date', value => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
    const date = new Date(`${value}T00:00:00Z`)
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  }),
  salary: yup.string().test('salary', 'Enter a positive amount with up to 2 decimal places (maximum 99,999,999.99)', value => !value || (/^\d+(\.\d{1,2})?$/.test(value) && Number(value) > 0 && Number(value) <= 99999999.99)),
  skills: yup.string().max(1000, 'Keep skills within 1,000 characters'),
  notes: yup.string().trim().max(500, 'Keep notes within 500 characters'),
  emergencyContact: yup.object({
    name: yup.string().trim().max(100).required('Contact name is required'),
    relationship: yup.string().trim().max(100).required('Relationship is required'),
    phone,
  }),
})

export const initialOnboardingValues = {
  firstName: '', lastName: '', email: '', phone: '', address: '',
  department: '', position: '', hireDate: '', salary: '', skills: '', notes: '',
  emergencyContact: { name: '', relationship: '', phone: '' },
}
export type OnboardingValues = typeof initialOnboardingValues

export function onboardingPayload(values: OnboardingValues) {
  const clean = onboardingSchema.cast(values)
  return {
    firstName: clean.firstName, lastName: clean.lastName, email: clean.email, phone: clean.phone,
    address: clean.address, department: clean.department, position: clean.position, hireDate: clean.hireDate,
    ...(clean.salary ? { salary: Number(clean.salary) } : {}),
    emergencyContact: clean.emergencyContact,
    skills: [...new Set((clean.skills || '').split(',').map(skill => skill.trim()).filter(Boolean))],
    notes: clean.notes || '',
  }
}
