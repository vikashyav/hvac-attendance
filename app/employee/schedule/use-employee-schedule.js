"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getTaskSchedulesList } from "@/lib/api/task-schedules-api"
import { useUserFromStorage } from "@/hooks/user.context"
import moment from "moment"

export function useEmployeeSchedule() {
  const { user } = useUserFromStorage()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const queryKey = [
    "employeeSchedules",
    user?.id,
    user?.companyId
  ]

  const { data: scheduleRes, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: ({ signal }) => getTaskSchedulesList({ signal }),
    enabled: !!user?.id,
  })

  const rawTasks = useMemo(() => {
    if (!scheduleRes?.data) return []
    const list = Array.isArray(scheduleRes.data) ? scheduleRes.data : []
    // Filter tasks assigned to this employee or where assignTo matches employee ID
    const empId = user?.employee?.id
    if (!empId) return list
    return list.filter((task) => {
      const assigned = task.assignTo === empId || task.assignToEmployee?.id === empId
      // Also show company-wide visits/training or tasks created by or assigned to self
      return assigned || task.createdBy === user.id
    })
  }, [scheduleRes, user])

  const selectedDateStr = moment(selectedDate).format("YYYY-MM-DD")
  const todayStr = moment().format("YYYY-MM-DD")

  const todayTasks = useMemo(() => {
    return rawTasks.filter((task) => {
      const taskDate = task.startDate ? moment(task.startDate).format("YYYY-MM-DD") : null
      return taskDate === todayStr
    })
  }, [rawTasks, todayStr])

  const selectedDateTasks = useMemo(() => {
    return rawTasks.filter((task) => {
      const taskDate = task.startDate ? moment(task.startDate).format("YYYY-MM-DD") : null
      return taskDate === selectedDateStr
    })
  }, [rawTasks, selectedDateStr])

  const upcomingTasks = useMemo(() => {
    return rawTasks
      .filter((task) => {
        if (!task.startDate) return true
        const taskDate = moment(task.startDate).format("YYYY-MM-DD")
        return taskDate >= todayStr
      })
      .sort((a, b) => (new Date(a.startDate || 0)).getTime() - (new Date(b.startDate || 0)).getTime())
  }, [rawTasks, todayStr])

  return {
    user,
    selectedDate,
    setSelectedDate,
    selectedDateStr,
    allTasks: rawTasks,
    todayTasks,
    selectedDateTasks,
    upcomingTasks,
    isLoading,
    isError,
    refetch,
  }
}
