"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
import { getAttendance } from "@/lib/api/attendance-api"
import { getAttendancePolicy } from "@/lib/api/settings-api"
import generateContext from "@/utils/generate-context"
import { useUserFromStorage } from "@/hooks/user.context"
import { useSearchParams } from "next/navigation"
import { formatWorkingHours } from "@/utils/helper"

export function useAttendances(props) {
  const { user } = useUserFromStorage()
  const searchParams = useSearchParams()
  const employeeId = searchParams?.get("employee_id") || props?.searchParams?.employee_id
  const [visibleMonth, setVisibleMonth] = useState(() => moment().startOf("month").toDate())
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [dateRange, setDateRange] = useState({
    from: moment(searchParams?.get("from") || undefined).startOf("month").toDate(),
    to: moment(searchParams?.get("to") || undefined).endOf("day").toDate(),
  })
  const employeeView = user?.role === "employee"
  const from = employeeView ? moment(visibleMonth).startOf("month").format("YYYY-MM-DD") : searchParams?.get("from") || moment(dateRange.from).format("YYYY-MM-DD")
  const to = employeeView ? moment(visibleMonth).endOf("month").format("YYYY-MM-DD") : searchParams?.get("to") || moment(dateRange.to).format("YYYY-MM-DD")

  const attendanceQuery = useQuery({
    queryKey: ["attendance", user?.id, user?.companyId, { employee_id: employeeId, from, to }],
    queryFn: getAttendance,
    enabled: Boolean(user?.id),
  })
  const policyQuery = useQuery({
    queryKey: ["attendance-policy", user?.id, user?.companyId],
    queryFn: getAttendancePolicy,
    enabled: Boolean(user?.id) && employeeView,
  })

  const attendanceData = attendanceQuery.data?.data || {}
  const policy = policyQuery.data?.data?.data || null
  const attendanceHistory = useMemo(() => (attendanceData.data || []).map((item) => ({
    ...item,
    date: item.attendanceDate || moment(item.createdAt).format("YYYY-MM-DD"),
  })), [attendanceData.data])
  const attendanceByDate = useMemo(() => attendanceHistory.reduce((records, item) => {
    records[item.date] = item
    return records
  }, {}), [attendanceHistory])
  const displayHistory = useMemo(() => attendanceHistory.map(item => ({
    ...item,
    checkInTime: item.checkInTime && moment(item.checkInTime).isValid() ? moment(item.checkInTime).format("h:mm A") : "-",
    checkOutTime: item.checkOutTime && moment(item.checkOutTime).isValid() ? moment(item.checkOutTime).format("h:mm A") : "-",
    workHours: formatWorkingHours(item.workHours),
    overtimeHours: formatWorkingHours(item.overtimeHours),
    fullName: item?.employee?.user?.fullName || item?.fullName || user?.fullName,
  })), [attendanceHistory, user])
  const summary = {
    totalHours: formatWorkingHours(attendanceData.totalHours) || "0h 0m",
    attendanceRate: attendanceData.attendanceRate || "0",
    punctualityScore: attendanceData.punctualityRate || "0",
    totalOvertimeHours: formatWorkingHours(attendanceData.totalOvertimeHours) || "0m",
  }

  const goToMonth = (offset) => {
    const next = moment(visibleMonth).add(offset, "month").startOf("month")
    setVisibleMonth(next.toDate())
    setSelectedDate(next.toDate())
  }
  const goToToday = () => {
    const today = new Date()
    setVisibleMonth(moment(today).startOf("month").toDate())
    setSelectedDate(today)
  }

  return {
    visibleMonth, selectedDate, setSelectedDate, goToMonth, goToToday,
    attendanceByDate, attendanceData, policy, user, dateRange, setDateRange,
    attendanceHistory: displayHistory, monthlyStats: summary, monthlyTrends: attendanceData.monthlyTrends || [],
    queryParmas: { employee_id: employeeId },
    isLoading: attendanceQuery.isLoading || policyQuery.isLoading,
    isFetching: attendanceQuery.isFetching,
    isError: attendanceQuery.isError || policyQuery.isError,
    refetch: () => Promise.all([attendanceQuery.refetch(), policyQuery.refetch()]),
  }
}

export const [AttendancesPageProvider, useAttendancesPageContext] = generateContext(useAttendances)
