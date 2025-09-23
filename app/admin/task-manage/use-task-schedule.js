"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import fakeData from "@/constants/fake-data";
import { useToast } from "@/hooks/use-toast"
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { TaskSchedulesRegistration, TaskSchedulesUpdate, getTaskSchedulesDetailById, getTaskSchedulesList } from "@/lib/api/task-schedules-api";
import generateContext from "@/utils/generate-context";
import { getIntialValues } from "./form-helper";
// import { useRouter } from 'next/router'
import { ToastAction } from "@/components/ui/toast";
import { getProjectsSitesList } from "@/lib/api/projects-sites-api";
import { getEmployeeList } from "@/lib/api/employee";
import { useSearchParams, useRouter, useParams } from 'next/navigation';

export function useTaskSchedule(props) {
  const notificationModal = useNotificationModalContext();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams()//.getAll();
  console.log(params);

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("month")
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTaskSchedules, setselectedTaskSchedules] = useState(getIntialValues({}))
  const [attachedFiles, setAttachedFiles] = useState([]);
  const events = [
    {
      id: 1,
      title: "Team Meeting - Downtown Site",
      date: "2024-01-15",
      time: "9:00 AM",
      duration: "1 hour",
      type: "meeting",
      location: "Downtown Office Complex",
      attendees: ["Mike Johnson", "Sarah Wilson", "John Smith"],
      description: "Weekly progress review and planning session",
      priority: "high",
    },
    {
      id: 2,
      title: "Safety Training Session",
      date: "2024-01-16",
      time: "2:00 PM",
      duration: "3 hours",
      type: "training",
      location: "Training Center",
      attendees: ["All Field Staff"],
      description: "Mandatory safety training for all field technicians",
      priority: "high",
    },
    {
      id: 3,
      title: "Client Presentation - Mall Project",
      date: "2024-01-17",
      time: "10:30 AM",
      duration: "2 hours",
      type: "presentation",
      location: "Client Office",
      attendees: ["Lisa Garcia", "Tom Brown"],
      description: "Project progress presentation to client stakeholders",
      priority: "medium",
    },
    {
      id: 4,
      title: "Equipment Maintenance",
      date: "2024-01-18",
      time: "8:00 AM",
      duration: "4 hours",
      type: "maintenance",
      location: "Equipment Yard",
      attendees: ["Maintenance Team"],
      description: "Scheduled maintenance for HVAC equipment and vehicles",
      priority: "medium",
    },
    {
      id: 5,
      title: "New Employee Orientation",
      date: "2024-01-19",
      time: "9:00 AM",
      duration: "6 hours",
      type: "orientation",
      location: "Main Office",
      attendees: ["HR Team", "New Hires"],
      description: "Comprehensive orientation program for new employees",
      priority: "low",
    },
  ]

  const shifts = [
    {
      id: 1,
      employee: "John Smith",
      site: "Downtown Office Complex",
      date: "2024-01-15",
      startTime: "8:00 AM",
      endTime: "5:00 PM",
      status: "scheduled",
    },
    {
      id: 2,
      employee: "Sarah Johnson",
      site: "Mall Project",
      date: "2024-01-15",
      startTime: "8:30 AM",
      endTime: "5:30 PM",
      status: "scheduled",
    },
    {
      id: 3,
      employee: "Mike Wilson",
      site: "Residential Complex",
      date: "2024-01-15",
      startTime: "9:00 AM",
      endTime: "6:00 PM",
      status: "scheduled",
    },
  ]

  const { data: TaskSchedulesDetail, isFetchingTaskSchedulesDetail, refetchTaskSchedulesDetail } = useQuery({
    queryKey: { id: params.task_id },
    queryFn: getTaskSchedulesDetailById,
    // queryKey: ['product', productId], 
    // The query function receives the query context, from which you can extract the query key
    // queryFn: ({ queryKey }) => fetchProductById(queryKey[1]), 
    // Other options like enabled, staleTime, etc. can be added here
    enabled: !!params.task_id, // Only fetch if task_id exists
  })
  const addMutation = useMutation({
    mutationFn: TaskSchedulesRegistration,
  })
  const udateMutation = useMutation({
    mutationFn: TaskSchedulesUpdate,
  })
  const { data: TaskSchedulesData, isFetching, refetch } = useQuery({
    // queryKey: ["useTaskSchedules"],
    queryFn: getTaskSchedulesList,
    enabled: params.task_id ? false : true, // Only fetch if task_id exists
  })
  const { data: projectsSitesData, isFetchingProjectList, refetchProjectList } = useQuery({
    queryKey: ["useProjectsSites"],
    queryFn: getProjectsSitesList,
  });
  const { data: employeeList, isFetchingEmployeeData, refetchEmployeeData } = useQuery({
    queryKey: { is_emp_stats: 0 },
    queryFn: getEmployeeList
  })
  useEffect(() => {
    if (TaskSchedulesDetail?.data) {
      const initial = getIntialValues(TaskSchedulesDetail?.data)
      setselectedTaskSchedules(initial)
    }
  }, [TaskSchedulesDetail?.data])

  const openEditDialog = (projectsSites) => {
    const initial = getIntialValues({ ...projectsSites })
    setselectedTaskSchedules(initial)
    setIsEditDialogOpen(true)
    setIsAddDrawerOpen(true);
  }

  const handleCloseDrawer = (isOpen) => {
    setIsAddDrawerOpen(isOpen)
    if (!isOpen) {
      router.push("?")
    }

  }
  const handleAddTaskSchedules = (values, { setSubmitting, resetForm }) => {
    notificationModal.progress({
      heading: `Adding ${values.title} , Please await!!`,
    });
    values.parentId = searchParams.get("parentId")
    const apiCall = values?.id ? udateMutation.mutate : addMutation.mutate;
    // const { ...payload}=values;
    apiCall(values, {
      onSuccess: (res) => {
        // console.log(res)
        refetch();
        notificationModal.success({ heading: "Success", body:`#${values?.id}_ ${values?.title} has been updated.` });

      },
      onError: (err) => {
        // alert('Something went wrong')
        notificationModal.error({ heading: "failed Something went wrong!!!", body: JSON.stringify(err) });
        console.error(err)
        setIsLoading(false)
      },
    })
  }

  // return useMemo(() => {
  //   return {
  //     selectedDate, setSelectedDate, viewMode, setViewMode, events, shifts, TaskSchedulesData, selectedTaskSchedules, openEditDialog,
  //     handleAddTaskSchedules,
  //     isAddDrawerOpen,
  //     setIsAddDrawerOpen,
  //     projectsSitesData,
  //     employeeList: employeeList?.data?.data,
  //     attachedFiles, setAttachedFiles,
  //     handleCloseDrawer,
  //     searchParams
  //   }
  // }, [
  //   selectedDate, setSelectedDate, viewMode, setViewMode, events, shifts, TaskSchedulesData, selectedTaskSchedules, openEditDialog,
  //   handleAddTaskSchedules,
  //   isAddDrawerOpen,
  //   setIsAddDrawerOpen,
  //   projectsSitesData,
  //   employeeList?.data?.data,
  //   attachedFiles, setAttachedFiles,
  //   handleCloseDrawer,
  //   searchParams
  // ])
   return {
      selectedDate, setSelectedDate, viewMode, setViewMode, events, shifts, TaskSchedulesData, selectedTaskSchedules, openEditDialog,
      handleAddTaskSchedules,
      isAddDrawerOpen,
      setIsAddDrawerOpen,
      projectsSitesData,
      employeeList: employeeList?.data?.data,
      attachedFiles, setAttachedFiles,
      handleCloseDrawer,
      searchParams,
      TaskSchedulesDetail,
      router
    }
}

export const [TaskSchedulePageProvider, useTaskSchedulePageContext] = generateContext(useTaskSchedule);
