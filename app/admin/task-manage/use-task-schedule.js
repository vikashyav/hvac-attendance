"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { TaskSchedulesRegistration, TaskSchedulesUpdate, getTaskSchedulesDetailById, getTaskSchedulesList } from "@/lib/api/task-schedules-api"
import { getProjectsSitesList } from "@/lib/api/projects-sites-api"
import { getEmployeeList } from "@/lib/api/employee"
import { useCapabilities } from "@/hooks/use-capabilities"
import { useUserFromStorage } from "@/hooks/user.context"
import { useParams } from "next/navigation"
import generateContext from "@/utils/generate-context"
import { getIntialValues } from "./form-helper"

export function useTaskSchedule() {
  const { user } = useUserFromStorage()
  const { task_id: taskId } = useParams()
  const capabilities = useCapabilities()
  const canManage = capabilities.isSuccess && (capabilities.data?.data?.data?.permissions || []).includes("task.manage")
  const client = useQueryClient()
  const scope = `${user.id || ""}:${user.companyId || ""}:${taskId || ""}`
  const [editorScope, setEditorScope] = useState(scope)
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [selectedTaskSchedules, setSelectedTaskSchedules] = useState(getIntialValues({}))
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("month")
  const tasks = useQuery({
    queryKey: ["tasks", user.id, user.companyId, taskId || "list"],
    queryFn: ({ signal }) => taskId ? getTaskSchedulesDetailById({ id: taskId, signal }) : getTaskSchedulesList({ signal }),
    enabled: !!user.id, retry: false,
  })
  const editorOpen = isAddDrawerOpen && canManage && editorScope === scope
  const projects = useQuery({
    queryKey: ["useProjectsSites", user.id, user.companyId],
    queryFn: ({ signal }) => getProjectsSitesList({ signal }),
    enabled: editorOpen, retry: false,
  })
  const employees = useQuery({
    queryKey: ["taskEmployees", user.id, user.companyId],
    queryFn: ({ signal }) => getEmployeeList({ signal, queryKey: { is_emp_stats: 0 } }),
    enabled: editorOpen, retry: false,
  })
  const mutation = useMutation({ mutationFn: values => values.id ? TaskSchedulesUpdate(values) : TaskSchedulesRegistration(values) })
  useEffect(() => {
    if (!canManage || editorScope !== scope) setIsAddDrawerOpen(false)
  }, [canManage, editorScope, scope])
  const openEditDialog = (task) => {
    if (!canManage) return
    setSelectedTaskSchedules(getIntialValues(task || {}))
    setEditorScope(scope)
    setSaveError("")
    setSaveSuccess("")
    setIsAddDrawerOpen(true)
  }
  const handleAddTaskSchedules = async (values, { setSubmitting }) => {
    if (!canManage || editorScope !== scope) {
      setSaveError("You do not have permission to manage tasks.")
      setSubmitting(false)
      return
    }
    setSaveError("")
    setSaveSuccess("")
    try {
      await mutation.mutateAsync(values)
      setIsAddDrawerOpen(false)
      setSaveSuccess(`${values.title} ${values.id ? "updated" : "created"} successfully.`)
      await client.invalidateQueries({ queryKey: ["tasks"] })
    } catch (error) {
      setSaveError(error?.response?.data?.error || "Unable to save the task. Please try again.")
      if (error?.response?.status === 403) await capabilities.refetch()
    } finally {
      setSubmitting(false)
    }
  }
  return {
    canManage, capabilities, tasks, projects, employees, saveError, saveSuccess,
    isAddDrawerOpen: editorOpen, handleCloseDrawer: setIsAddDrawerOpen,
    selectedTaskSchedules, openEditDialog, handleAddTaskSchedules,
    projectsSitesData: projects.data, employeeList: employees.data?.data?.data,
    TaskSchedulesData: tasks.data, TaskSchedulesDetail: tasks.data,
    isFetchingTaskList: tasks.isPending,
    selectedDate, setSelectedDate, viewMode, setViewMode, events: [], shifts: [],
  }
}

export const [TaskSchedulePageProvider, useTaskSchedulePageContext] = generateContext(useTaskSchedule)
