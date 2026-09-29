"use client"

import { useState, useEffect } from "react"
import { useCapabilities } from "@/hooks/use-capabilities"
import { useToast } from "@/hooks/use-toast"
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createLeaveRequest, getLeaveRequest, updateLeaveRequest, updateLeaveStatus } from "@/lib/api/leave-api"
import generateContext from "@/utils/generate-context"
import { getIntialValues, LEAVE_TYPES, LEAVE_STATUSES } from "./form-helper"
import { useUserFromStorage } from "@/hooks/user.context"

export function useLeaveRequest() {
  const { toast } = useToast()
  const notificationModal = useNotificationModalContext()
  const { user } = useUserFromStorage()
  const capabilities = useCapabilities()
  const canApprove = capabilities.isSuccess && (capabilities.data?.data?.data?.permissions || []).includes("leave.approve")
  const isAdmin = canApprove

  const [view, setView] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [leaveRequestData, setLeaveRequestData] = useState(getIntialValues({}))
  const [leaveRequestUpdateByAdmin, setLeaveRequestUpdateByAdmin] = useState({})

  const { data: employeeData, isFetching, refetch } = useQuery({
    queryKey: ["leave-requests", user.id, user.companyId, canApprove],
    enabled: !!user.id && capabilities.isSuccess,
    queryFn: getLeaveRequest,
    retry: false,
  })

  const rawRequests = Array.isArray(employeeData?.data) ? employeeData.data : []

  const filteredRequests = rawRequests.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item?.fullName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item?.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item?.id?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item?.reason?.toLowerCase()?.includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.leaveType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const mutation = useMutation({
    mutationFn: createLeaveRequest,
  })

  const updateMutation = useMutation({
    mutationFn: updateLeaveRequest,
  })

  const updateLeaveStatusMutation = useMutation({
    mutationFn: updateLeaveStatus,
  })

  const handleAddEmployee = (values, { setSubmitting, resetForm }) => {
    notificationModal.progress({
      heading: "Please wait...",
    })
    const isEdit = Boolean(values?.id)
    const apiCall = isEdit ? updateMutation.mutate : mutation.mutate

    apiCall(values, {
      onSuccess: () => {
        refetch()
        setIsAddDrawerOpen(false)
        resetForm()
        notificationModal.success({
          heading: isEdit ? "Request Updated" : "Request Submitted",
          body: isEdit
            ? "Your leave request changes have been saved."
            : "Your leave request has been submitted for approval.",
        })
      },
      onError: (err) => {
        const message =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Unable to save leave request. Please check your inputs and try again."
        notificationModal.error({
          heading: "Submission Failed",
          body: message,
        })
      },
      onSettled: () => {
        if (typeof setSubmitting === "function") setSubmitting(false)
      },
    })
  }

  const openEditDialog = (request) => {
    if (request.status !== "PENDING" || request.userId !== user.id) return
    setLeaveRequestData(getIntialValues({ ...request }))
    setIsEditDialogOpen(true)
    setIsAddDrawerOpen(true)
  }

  const handleLeaveRequestUpdateByAdmin = (payload, status) => {
    if (payload.userId === user.id) {
      toast({
        title: "Action not permitted",
        description: "You cannot decide your own leave request.",
        variant: "destructive",
      })
      return
    }

    notificationModal.progress({
      heading: "Recording decision...",
    })

    const payloadData = {
      id: payload.id,
      remarks: leaveRequestUpdateByAdmin?.[payload.id]?.remarks || payload.remarks || "",
      status,
    }

    return updateLeaveStatusMutation.mutate(payloadData, {
      onSuccess: () => {
        refetch()
        notificationModal.success({
          heading: "Decision Recorded",
          body: `${payload.fullName || "Applicant"} leave request has been ${status}.`,
        })
      },
      onError: (err) => {
        const message =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Unable to record decision. Please try again."
        notificationModal.error({
          heading: "Decision Failed",
          body: message,
        })
      },
    })
  }

  return {
    view, setView,
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    typeFilter, setTypeFilter,
    isAddDrawerOpen, setIsAddDrawerOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    leaveRequestData, setLeaveRequestData,
    filteredEmployees: filteredRequests,
    filteredRequests,
    handleAddEmployee,
    openEditDialog,
    employeeData: rawRequests,
    isFetching,
    user,
    isAdmin,
    canApprove,
    capabilities,
    refetch,
    leaveRequestUpdateByAdmin,
    setLeaveRequestUpdateByAdmin,
    handleLeaveRequestUpdateByAdmin,
    LEAVE_TYPES,
    LEAVE_STATUSES,
  }
}

export const [EmployeesPageProvider, useEmployeesPageContext] = generateContext(useLeaveRequest)
export const useEmployees = useLeaveRequest
