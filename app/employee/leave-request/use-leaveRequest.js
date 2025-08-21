"use client"

import { useState, useCallback } from "react"
import fakeData from "@/constants/fake-data";
import { useToast } from "@/hooks/use-toast"
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createLeaveRequest, getLeaveRequest, updateLeaveRequest, updateLeaveStatus } from "@/lib/api/leave-api";
import generateContext from "@/utils/generate-context";
import { getIntialValues } from "./form-helper";
import { useRouter } from 'next/router'
import { useUserFromStorage } from "@/hooks/user.context";


export function useEmployees() {
  // const router = useRouter()
  const { toast } = useToast()
  const notificationModal = useNotificationModalContext();
  const { user, } = useUserFromStorage();
  const isAdmin = user?.role === "admin"

  const [view, setView] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [leaveRequestData, setLeaveRequestData] = useState(getIntialValues({}))
  const [leaveRequestUpdateByAdmin, setLeaveRequestUpdateByAdmin] = useState({});

  const [employees, setEmployees] = useState([]) //::Todo fake data for demo fakeData.employee

  const departments = fakeData.departments
  const positions = fakeData.positions

  const locations = fakeData.locations
  const { data: employeeData, isFetching, refetch } = useQuery({
    queryKey: ["useEmployees"],
    queryFn: getLeaveRequest
  })
  const filteredEmployees = (employeeData?.data || []).filter((employee) => {
    const matchesSearch =
      employee?.fullName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const mutation = useMutation({
    mutationFn: createLeaveRequest,
  })

  const udateMutation = useMutation({
    mutationFn: updateLeaveRequest,
  })
  const udateLeaveStatusMutation = useMutation({
    mutationFn: updateLeaveStatus,
  })
  const handleAddEmployee = (values, { setSubmitting, resetForm }) => {

    notificationModal.progress({
      heading: `Please await...!!`,
    });
    const apiCall = values?.id ? udateMutation.mutate : mutation.mutate
    apiCall(values, {
      onSuccess: (res) => {
        refetch();
        notificationModal.success({ heading: "Request Submitted", body: `Your leave request has been submitted for approval.` });

      },
      onError: (err) => {
        notificationModal.error({ heading: "failed Something went wrong!!!", body: JSON.stringify(err) });
        setIsLoading(false)
      },
    })
  }

  const handleEditEmployee = () => {
    if (!leaveRequestData) return

    setEmployees(employees.map((emp) => (emp.id === leaveRequestData.id ? leaveRequestData : emp)))
    setIsEditDialogOpen(false)
    setLeaveRequestData(null)

    toast({
      title: "Success",
      description: "Employee updated successfully.",
    })
  }

  const handleDeleteEmployee = (employeeId) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId))
    toast({
      title: "Success",
      description: "Employee deleted successfully.",
    })
  }

  const handleToggleStatus = (employeeId) => {
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

  const handleViewDetails = (employee) => {
    toast({
      title: "Employee Details",
      description: `Viewing details for ${employee.name} (${employee.id})`,
    })
    openEditDialog(employee)
    // setIsAddDrawerOpen(true);
  }

  const openEditDialog = (employee) => {
    setLeaveRequestData(getIntialValues({ ...employee }))
    setIsEditDialogOpen(true)
    setIsAddDrawerOpen(true);
  }

  const handleLeaveRequestUpdateByAdmin = (payload, status) => {
    notificationModal.progress({
      heading: `Please await...!!`,
    })
    const payload_ = {
      id: payload.id,
      remarks: leaveRequestUpdateByAdmin?.[payload.id]?.["remarks"] || payload.remarks,
      status: status
    };
    return udateLeaveStatusMutation.mutate(payload_, {
      onSuccess: (res) => {
        refetch();
        notificationModal.success({ heading: "Success", body: `${payload.fullName} leave request has been ${status}` });
      },
      onError: (err) => {
        notificationModal.error({ heading: "failed Something went wrong!!!", body: JSON.stringify(err) });
        setIsLoading(false)
      },
    })
  }


  return {
    view, setView,
    searchTerm, setSearchTerm,
    selectedDepartment, setSelectedDepartment,
    isAddDrawerOpen, setIsAddDrawerOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    leaveRequestData, setLeaveRequestData,
    employees, setEmployees,
    departments, positions, locations, filteredEmployees, handleAddEmployee, handleEditEmployee, handleDeleteEmployee,
    handleToggleStatus, handleViewDetails, openEditDialog,
    employeeData: employeeData?.data, isFetching,
    user, leaveRequestUpdateByAdmin, setLeaveRequestUpdateByAdmin, handleLeaveRequestUpdateByAdmin
    // handleAttendanceReport
  }
}

export const [EmployeesPageProvider, useEmployeesPageContext] = generateContext(useEmployees);
