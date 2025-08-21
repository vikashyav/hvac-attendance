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
import { useToast } from "@/hooks/use-toast"

import fakeData from "@/constants/fake-data";
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
  CheckCircle,
  Cross,
  CircleCheck,
} from "lucide-react"
import EmployeeForm from "./add-form";
import withHOC from "@/utils/with-hoc";
import { useEmployeesPageContext, EmployeesPageProvider } from "./use-leaveRequest";
import { useRouter } from 'next/navigation'

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
  reason: string
}


function EmployeesPage() {
  const { toast } = useToast()
  const router = useRouter();

  // const [view, setView] = useState<"grid" | "table">("table")
  // const [searchTerm, setSearchTerm] = useState("")
  // const [selectedDepartment, setSelectedDepartment] = useState("all")
  // const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  // const [leaveRequestData, setLeaveRequestData] = useState<Employee | null>(null)

  // const [employees, setEmployees] = useState<Employee[]>(fakeData.employee)

  const {
    view, setView,
    searchTerm, setSearchTerm,
    selectedDepartment, setSelectedDepartment,
    isAddDrawerOpen, setIsAddDrawerOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    leaveRequestData, setLeaveRequestData,
    employees, setEmployees,
    departments, positions, locations, filteredEmployees, handleAddEmployee, handleEditEmployee, handleDeleteEmployee,
    handleToggleStatus, handleViewDetails, openEditDialog, employeeData, isFetching, user
    // handleAttendanceReport
  } = useEmployeesPageContext();

  const handleAttendanceReport = (employee) => {
    //   router.push({
    //   pathname: '/employee/attendance',
    //   query: { employee_id: employee?.id },
    // })
    router.push(`/employee/attendance?employee_id=${employee?.id}`)
  }

  const dropdownMenuItems = (employee) => {
    return <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => handleAttendanceReport(employee)}>
        <Eye className="mr-2 h-4 w-4" />
        View Attendance Reports
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleViewDetails(employee)}>
        <Eye className="mr-2 h-4 w-4" />
        View Details
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => openEditDialog(employee)} disabled={employee.status !== "PENDING"}>
        <Edit className="mr-2 h-4 w-4" />
        Edit Request
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
  }

  const totalEmployee = employeeData?.paging?.total;
  const activeEmp = employeeData?.data?.filter((emp) => emp?.isActive)?.length;
  const inActiveEmp = (totalEmployee - activeEmp) || 0;
  const averagePerformance = employeeData?.stats?.averagePerformance || 0
  const isAdmin = user?.role === "admin"
  const isEmployee = user?.role === "employee"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground">Manage your team members and their information</p>
        </div>
        <EmployeeForm isAddDrawerOpen={isAddDrawerOpen} setIsAddDrawerOpen={setIsAddDrawerOpen} handleAddEmployee={handleAddEmployee} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"></div>

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
            <Button variant={view === "grid" ? "default" : "outline"} size="sm" onClick={() => setView("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button> 
            <Button variant={view === "table" ? "default" : "outline"} size="sm" onClick={() => setView("table")}>
              <List className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs value={view} onValueChange={(value) => setView(value as "grid" | "table")}>
        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              {/* <CardTitle>Employee List</CardTitle> */}
              {/* <CardDescription>A comprehensive list of all employees with their details and actions.</CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Days</TableHead>
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
                                {employee?.fullName
                                  ?.split(" ")
                                  ?.map((n) => n[0])
                                  ?.join("")}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{employee.fullName}</div>
                              <div className="text-sm text-muted-foreground">{employee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{employee.startDate}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{employee.endDate}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={employee.isActive ? "default" : "secondary"}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {employee.days}

                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            {dropdownMenuItems(employee)}
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
                    {isAdmin ? <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {employee.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{employee.fullName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{employee.id}</p>
                      </div>
                    </div>:<div></div>}
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
                      <span className="text-muted-foreground">Leave Type:</span>
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Days: {`${employee.days} from ${employee.startDate} to ${employee.endDate}`}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      {/* <span className="text-muted-foreground">Reason:</span> */}
                      <span className="font-medium whitespace-pre-wrap">{employee?.reason || "-"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleViewDetails(employee)}
                    // onClick={() => openEditDialog(employee)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => openEditDialog(employee)}
                    >
                      <X className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                      Reject
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      {dropdownMenuItems(employee)}
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
export default withHOC(EmployeesPageProvider, EmployeesPage);
