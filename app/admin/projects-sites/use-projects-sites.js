"use client"

import { useState, useCallback } from "react"
import fakeData from "@/constants/fake-data";
import { useToast } from "@/hooks/use-toast"
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { projectsSitesRegistration, projectsSitesUpdate, getProjectsSitesList } from "@/lib/api/projects-sites-api";
import generateContext from "@/utils/generate-context";
import { getIntialValues } from "./form-helper";
import { useRouter } from 'next/router'
import { ToastAction } from "@/components/ui/toast";


export function useProjectsSites() {
  // const router = useRouter()
  const { toast } = useToast()
  const notificationModal = useNotificationModalContext();

  const [view, setView] = useState("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProjectsSites, setSelectedProjectsSites] = useState(getIntialValues({}))

  const [projectsSites, setProjectsSites] = useState([]) //::Todo fake data for demo fakeData.projectsSites

  const departments = fakeData.departments
  const positions = fakeData.positions

  const locations = fakeData.locations
  const { data: projectsSitesData, isFetching, refetch } = useQuery({
    queryKey: ["useProjectsSites"],
    queryFn: getProjectsSitesList
  })
  const filteredProjectsSites = (projectsSitesData?.data || projectsSites).filter((site) => {
    const matchesSearch =
      site?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site?.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site?.address?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || site?.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const mutation = useMutation({
    mutationFn: projectsSitesRegistration,
  })

  const udateMutation = useMutation({
    mutationFn: projectsSitesUpdate,
  })
  const handleAddProjectsSites = (values, { setSubmitting, resetForm }) => {
    notificationModal.progress({
      heading: `Adding ${values.name} to your team, Please await!!`,
    });
    const apiCall = values?.id ? udateMutation.mutate : mutation.mutate
    apiCall(values, {
      onSuccess: (res) => {
        // console.log(res)
        refetch();
        notificationModal.success({ heading: "Success", body: `${values?.firstName} has been added to your team.` });

      },
      onError: (err) => {
        // alert('Something went wrong')
        notificationModal.error({ heading: "failed Something went wrong!!!", body: JSON.stringify(err) });
        console.error(err)
        setIsLoading(false)
      },
    })
  }

  const handleEditProjectsSites = (selectedProjectsSites) => {
    if (!selectedProjectsSites) return

    setProjectsSites(projectsSites.map((emp) => (emp.id === selectedProjectsSites.id ? selectedProjectsSites : emp)))
    setIsEditDialogOpen(false)
    setSelectedProjectsSites(null)

    toast({
      title: "Success",
      description: "ProjectsSites updated successfully.",
    })
  }

  const handleDeleteProjectsSites = (projectsSitesId) => {
    // setProjectsSites(projectsSites.filter((emp) => emp.id !== projectsSitesId))
    toast({
      title: "are you sure ???",
      description: "Do you want to delete",
      action: (
        <ToastAction altText="Confirm"
          // onClick={handleInstallClick}
        >
          Confirm
        </ToastAction>
      ),
      duration: 180000, // auto-hide after 3min
    })
  }

  const handleToggleStatus = (projectsSitesId) => {
    setProjectsSites(
      projectsSites.map((emp) =>
        emp.id === projectsSitesId ? { ...emp, status: emp.status === "active" ? "inactive" : "active" } : emp,
      ),
    )

    const projectsSites = projectsSites.find((emp) => emp.id === projectsSitesId)
    const newStatus = projectsSites?.status === "active" ? "inactive" : "active"

    toast({
      title: "Success",
      description: `ProjectsSites ${newStatus === "active" ? "activated" : "deactivated"} successfully.`,
    })
  }

  const handleViewDetails = (projectsSites) => {
    toast({
      title: "ProjectsSites Details",
      description: `Viewing details for ${projectsSites.name} (${projectsSites.id})`,
    })
    openEditDialog(projectsSites)
    // setIsAddDrawerOpen(true);
  }

  const openEditDialog = (projectsSites) => {
    const initial = getIntialValues({ ...projectsSites })
    setSelectedProjectsSites(initial)
    setIsEditDialogOpen(true)
    setIsAddDrawerOpen(true);
  }



  return {
    view, setView,
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    selectedDepartment, setSelectedDepartment,
    isAddDrawerOpen, setIsAddDrawerOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    selectedProjectsSites, setSelectedProjectsSites,
    projectsSites, setProjectsSites,
    departments, positions, locations, filteredProjectsSites, handleAddProjectsSites, handleEditProjectsSites, handleDeleteProjectsSites,
    handleToggleStatus, handleViewDetails, openEditDialog,
    projectsSitesData: projectsSitesData?.data, isFetching, 
    // handleAttendanceReport
  }
}

export const [ProjectsSitesPageProvider, useProjectsSitesPageContext] = generateContext(useProjectsSites);
