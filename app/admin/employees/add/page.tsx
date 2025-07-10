"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Grid3X3,
  List,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Briefcase,
  User,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  status: "active" | "inactive"
  joinDate: string
  location: string
  performance: number
  avatar?: string
  emergencyContact?: string
  address?: string
  salary?: number
}

interface AddEmployeeFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position: string
  location: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  salary: string
  startDate: string
  notes: string
}

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string()
    .matches(/^[+]?[1-9][\d]{0,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  department: Yup.string().required("Department is required"),
  position: Yup.string().required("Position is required"),
  location: Yup.string().required("Work location is required"),
  address: Yup.string().required("Address is required"),
  emergencyContact: Yup.string().required("Emergency contact name is required"),
  emergencyPhone: Yup.string()
    .matches(/^[+]?[1-9][\d]{0,15}$/, "Invalid emergency phone number")
    .required("Emergency phone is required"),
  salary: Yup.number().positive("Salary must be positive").required("Salary is required"),
  startDate: Yup.date().min(new Date(), "Start date cannot be in the past").required("Start date is required"),
  notes: Yup.string().max(500, "Notes must be less than 500 characters"),
})

export default function EmployeesPage() {
  const { toast } = useToast()
  const [view, setView] = useState<"grid" | "table">("table")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "EMP001",
      name: "John Smith",
      email: "john.smith@hvacpro.com",
      phone: "+1 (555) 123-4567",
      department: "Installation",
      position: "Senior Technician",
      status: "active",
      joinDate: "2023-01-15",
      location: "Downtown Office",
      performance: 92,
    },
    {
      id: "EMP002",
      name: "Sarah Johnson",
      email: "sarah.johnson@hvacpro.com",
      phone: "+1 (555) 234-5678",
      department: "Maintenance",
      position: "Lead Technician",
      status: "active",
      joinDate: "2022-08-20",
      location: "North Branch",
      performance: 88,
    },
    {
      id: "EMP003",
      name: "Mike Wilson",
      email: "mike.wilson@hvacpro.com",
      phone: "+1 (555) 345-6789",
      department: "Installation",
      position: "Technician",
      status: "active",
      joinDate: "2023-03-10",
      location: "South Branch",
      performance: 85,
    },
    {
      id: "EMP004",
      name: "Emily Davis",
      email: "emily.davis@hvacpro.com",
      phone: "+1 (555) 456-7890",
      department: "Repair",
      position: "Emergency Technician",
      status: "inactive",
      joinDate: "2022-11-05",
      location: "Downtown Office",
      performance: 90,
    },
    {
      id: "EMP005",
      name: "David Brown",
      email: "david.brown@hvacpro.com",
      phone: "+1 (555) 567-8901",
      department: "Maintenance",
      position: "Technician",
      status: "active",
      joinDate: "2023-06-12",
      location: "East Branch",
      performance: 87,
    },
  ])

  const departments = ["Installation", "Maintenance", "Repair", "Sales", "Administration"]
  const positions = {
    Installation: ["Technician", "Senior Technician", "Lead Installer", "Installation Manager"],
    Maintenance: ["Maintenance Technician", "Senior Maintenance Tech", "Maintenance Supervisor"],
    Repair: ["Repair Technician", "Emergency Technician", "Senior Repair Specialist"],
    Sales: ["Sales Representative", "Sales Manager", "Account Executive"],
    Administration: ["Office Manager", "HR Coordinator", "Administrative Assistant"],
  }

  const locations = ["Downtown Office", "North Branch", "South Branch", "East Branch", "West Branch"]

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const handleAddEmployee = (values: AddEmployeeFormValues, { setSubmitting, resetForm }: any) => {
    // Simulate API call
    setTimeout(() => {
      const employee: Employee = {
        id: `EMP${String(employees.length + 1).padStart(3, "0")}`,
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phone,
        department: values.department,
        position: values.position,
        status: "active",
        joinDate: values.startDate,
        location: values.location,
        performance: 0,
        emergencyContact: values.emergencyContact,
        address: values.address,
        salary: Number.parseFloat(values.salary),
      }

      setEmployees([...employees, employee])
      resetForm()
      setIsAddDrawerOpen(false)
      setSubmitting(false)

      toast({
        title: "Success!",
        description: `${employee.name} has been added to your team.`,
        duration: 5000,
      })
    }, 1000)
  }

  const handleEditEmployee = () => {
    if (!selectedEmployee) return

    setEmployees(employees.map((emp) => (emp.id === selectedEmployee.id ? selectedEmployee : emp)))
    setIsEditDialogOpen(false)
    setSelectedEmployee(null)

    toast({
      title: "Success",
      description: "Employee updated successfully.",
    })
  }

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId))
    toast({
      title: "Success",
      description: "Employee deleted successfully.",
    })
  }

  const handleToggleStatus = (employeeId: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId ? { ...emp, status: emp.status === "active" ? "inactive" : "active" } : emp,
      ),
    )

    const employee = employees.find((emp) => emp.id === employeeId)
    const newStatus = employee?.status === "active" ? "inactive" : "active"

    toast({
      title: "Success",
      description: `Employee ${newStatus === "active" ? "activated" : "deactivated"} successfully.`,
    })
  }

  const handleViewDetails = (employee: Employee) => {
    toast({
      title: "Employee Details",
      description: `Viewing details for ${employee.name} (${employee.id})`,
    })
  }

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee({ ...employee })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">Manage your team members and their information</p>
        </div>
        <Sheet open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
          <SheetTrigger asChild>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:w-[600px] overflow-y-auto">
            <SheetHeader className="space-y-3 pb-6">
              <SheetTitle className="text-2xl font-semibold flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                Add New Employee
              </SheetTitle>
              <SheetDescription className="text-base">
                Fill in the details below to add a new team member to your organization.
              </SheetDescription>
            </SheetHeader>

            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                department: "",
                position: "",
                location: "",
                address: "",
                emergencyContact: "",
                emergencyPhone: "",
                salary: "",
                startDate: "",
                notes: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleAddEmployee}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                <Form className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border">
                      <User className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold text-lg">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-medium">
                            First Name <span className="text-red-500">*</span>
                          </Label>
                          <Field
                            as={Input}
                            id="firstName"
                            name="firstName"
                            placeholder="Enter first name"
                            className={`transition-all ${
                              errors.firstName && touched.firstName
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "focus:border-blue-500 focus:ring-blue-500"
                            }`}
                          />
                          <ErrorMessage name="firstName">
                            {(msg) => (
                              <div className="text-red-500 text-sm flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-medium">
                            Last Name <span className="text-red-500">*</span>
                          </Label>
                          <Field
                            as={Input}
                            id="lastName"
                            name="lastName"
                            placeholder="Enter last name"
                            className={`transition-all ${
                              errors.lastName && touched.lastName
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "focus:border-blue-500 focus:ring-blue-500"
                            }`}
                          />
                          <ErrorMessage name="lastName">
                            {(msg) => (
                              <div className="text-red-500 text-sm flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter email address"
                          className={`transition-all ${
                            errors.email && touched.email
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                        <ErrorMessage name="email">
                          {(msg) => (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="phone"
                          name="phone"
                          placeholder="+1 (555) 123-4567"
                          className={`transition-all ${
                            errors.phone && touched.phone
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                        <ErrorMessage name="phone">
                          {(msg) => (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium">
                          Home Address <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Textarea}
                          id="address"
                          name="address"
                          placeholder="Enter full address"
                          rows={3}
                          className={`transition-all resize-none ${
                            errors.address && touched.address
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                        <ErrorMessage name="address">
                          {(msg) => (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                  </div>

                  {/* Work Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold text-lg">Work Information</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-sm font-medium">
                          Department <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={values.department}
                          onValueChange={(value) => {
                            setFieldValue("department", value)
                            setFieldValue("position", "") // Reset position when department changes
                          }}
                        >
                          <SelectTrigger
                            className={`transition-all ${
                              errors.department && touched.department
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "focus:border-blue-500 focus:ring-blue-500"
                            }`}
                          >
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage name="department">
                          {(msg) => (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position" className="text-sm font-medium">
                          Position <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={values.position}
                          onValueChange={(value) => setFieldValue("position", value)}
                          disabled={!values.department}
                        >
                          <SelectTrigger
                            className={`transition-all ${
                              errors.position && touched.position
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "focus:border-blue-500 focus:ring-blue-500"
                            }`}
                          >
                            <SelectValue
                              placeholder={values.department ? "Select position" : "Select department first"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {values.department &&
                              positions[values.department as keyof typeof positions]?.map((pos) => (
                                <SelectItem key={pos} value={pos}>
                                  {pos}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage name="position">
                          {(msg) => (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium">
                          Work Location <span className="text-red-500">*</span>
                        </Label>
                        <Select value={values.location} onValueChange={(value) => setFieldValue("location", value)}>
                          <SelectTrigger
                            className={`transition-all ${
                              errors.location && touched.location
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "focus:border-blue-500 focus:ring-blue-500"
                            }`}
                          >
                            <SelectValue placeholder="Select work location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc} value={loc}>
                                {loc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage name="location">
                          {(msg) => (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="startDate" className="text-sm font-medium">
                            Start Date <span className="text-red-500">*</span>
                          </Label>
                          <Field
                            as={Input}
                            id="startDate"
                            name="startDate"
                            type="date"
                            className={`transition-all ${
                              errors.startDate && touched.startDate
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "focus:border-blue-500 focus:ring-blue-500"
                            }`}
                          />
                          <ErrorMessage name="startDate">
                            {(msg) => (
                              <div className="text-red-500 text-sm flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="salary" className="text-sm font-medium">
                            Annual Salary (USD) <span className="text-red-500">*</span>
                          </Label>
                          <Field
                            as={Input}
                            id="salary"
                            name="salary"
                            type="number"
                            placeholder="50000"
                            className={`transition-all ${
                              errors.salary && touched.salary
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "focus:border-blue-500 focus:ring-blue-500"
                            }`}
                          />
                          <ErrorMessage name="salary">
                            {(msg) => (
                              <div className="text-red-500 text-sm flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold text-lg">Emergency Contact</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact" className="text-sm font-medium">
                          Contact Name <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="emergencyContact"
                          name="emergencyContact"
                          placeholder="Enter emergency contact name"
                          className={`transition-all ${
                            errors.emergencyContact && touched.emergencyContact
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                        <ErrorMessage name="emergencyContact">
                          {(msg) => (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone" className="text-sm font-medium">
                          Contact Phone <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="emergencyPhone"
                          name="emergencyPhone"
                          placeholder="+1 (555) 987-6543"
                          className={`transition-all ${
                            errors.emergencyPhone && touched.emergencyPhone
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                        <ErrorMessage name="emergencyPhone">
                          {(msg) => (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border">
                      <Edit className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold text-lg">Additional Information</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Notes (Optional)
                      </Label>
                      <Field
                        as={Textarea}
                        id="notes"
                        name="notes"
                        placeholder="Any additional notes about the employee..."
                        rows={4}
                        className="transition-all resize-none focus:border-blue-500 focus:ring-blue-500"
                      />
                      <ErrorMessage name="notes">
                        {(msg) => (
                          <div className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                      <p className="text-xs text-muted-foreground">{values.notes.length}/500 characters</p>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col gap-3 pt-6 border-t border-border">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding Employee...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Add Employee
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDrawerOpen(false)}
                      className="w-full"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </SheetContent>
        </Sheet>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.filter((e) => e.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.filter((e) => e.status === "inactive").length}</div>
            <p className="text-xs text-muted-foreground">On leave or inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(employees.reduce((acc, emp) => acc + emp.performance, 0) / employees.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-[300px]"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "table" ? "default" : "outline"} size="sm" onClick={() => setView("table")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant={view === "grid" ? "default" : "outline"} size="sm" onClick={() => setView("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs value={view} onValueChange={(value) => setView(value as "grid" | "table")}>
        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee List</CardTitle>
              <CardDescription>A comprehensive list of all employees with their details and actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-muted-foreground">{employee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${employee.performance}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{employee.performance}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDetails(employee)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(employee)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Employee
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleStatus(employee.id)}>
                                {employee.status === "active" ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Employee
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the employee record and
                                      remove all associated data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteEmployee(employee.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{employee.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{employee.id}</p>
                      </div>
                    </div>
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>{employee.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{employee.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-medium">{employee.department}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Position:</span>
                      <span className="font-medium">{employee.position}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Performance:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${employee.performance}%` }} />
                        </div>
                        <span className="font-medium">{employee.performance}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleViewDetails(employee)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => openEditDialog(employee)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggleStatus(employee.id)}>
                          {employee.status === "active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the employee record and
                                remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteEmployee(employee.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update the employee information below.</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={selectedEmployee.name}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedEmployee.email}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={selectedEmployee.phone}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={selectedEmployee.department}
                  onValueChange={(value) => setSelectedEmployee({ ...selectedEmployee, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value={selectedEmployee.position}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, position: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={selectedEmployee.location}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, location: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditEmployee}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
