"use client"

import { useQuery } from "@tanstack/react-query"
import { getAttendancePolicy } from "@/lib/api/settings-api"
import { companyMonthRange, workingHoursGoal } from "@/lib/employee-summary.mjs"
import { getAttendance } from "@/lib/api/attendance-api"
import { useUserFromStorage } from "@/hooks/user.context"
import moment from "moment"
import { Award, Calendar, Clock, Star, TrendingUp } from "lucide-react"

export function usePerformance() {
  const { user } = useUserFromStorage()
  const employeeId = user?.employee?.id
  const policyQuery = useQuery({
    queryKey: ["attendance-policy", user?.id, user?.companyId],
    queryFn: getAttendancePolicy,
    enabled: !!user?.id && !!employeeId,
  })
  const policy = policyQuery.data?.data?.data
  const range = policy ? companyMonthRange(policy.timezone) : {}

  const queryKey = [
    "performance",
    user?.id,
    user?.companyId,
    { ...range, employee_id: employeeId }
  ]

  const { data: attendanceRes, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: getAttendance,
    enabled: !!user?.id && !!employeeId && !!policy,
  })

  const raw = attendanceRes?.data || {}
  const overall = Number(raw.performance || 0)
  const attendance = Number(raw.attendanceRate || 0)
  const punctuality = Number(raw.punctualityRate || 0)
  const totalHours = Number(raw.totalHours || 0)
  const totalOvertimeHours = Number(raw.totalOvertimeHours || 0)
  const daysPresent = Number(raw.daysPresent || 0)
  const totalWorkingDays = Number(raw.totalWorkingDays || 0)
  const perfectWeeks = raw.perfectAttendance?.perfectWeeks || []
  const totalPerfectWeeks = raw.perfectAttendance?.totalPerfectWeeks || 0

  const performanceMetrics = {
    overall,
    attendance,
    punctuality,
    totalHours,
    totalOvertimeHours,
    daysPresent,
    totalWorkingDays,
  }

  const chartData = [
    {
      metric: "Attendance",
      score: attendance,
      target: 100,
      improvement: `${attendance}% of scheduled days`,
    },
    {
      metric: "Punctuality",
      score: punctuality,
      target: 100,
      improvement: `${punctuality}% of scheduled days`,
    },
    {
      metric: "Performance Index",
      score: overall,
      target: 100,
      improvement: overall >= 100 ? "+Met Target" : `${(overall - 100).toFixed(1)}%`,
    },
    {
      metric: "Working Days",
      score: totalWorkingDays > 0 ? Math.min(100, Math.round((daysPresent / totalWorkingDays) * 100)) : 0,
      target: 100,
      improvement: `${daysPresent}/${totalWorkingDays} days`,
    },
  ]

  const monthlyGoals = workingHoursGoal(raw, policy)

  const achievements = []
  if (totalPerfectWeeks > 0) {
    achievements.push({
      id: "perfect-attendance",
      title: "Perfect Attendance",
      description: `Maintained 100% attendance across ${totalPerfectWeeks} week(s) (${perfectWeeks.join(", ")})`,
      date: moment().format("YYYY-MM-DD"),
      icon: Calendar,
      color: "text-green-600",
    })
  }

  if (punctuality === 100 && daysPresent > 0) {
    achievements.push({
      id: "punctuality-star",
      title: "Punctuality Star",
      description: `Maintained high punctuality rate of ${punctuality}% on scheduled shifts`,
      date: moment().format("YYYY-MM-DD"),
      icon: Clock,
      color: "text-blue-600",
    })
  }

  if (totalOvertimeHours > 0) {
    achievements.push({
      id: "overtime-contributor",
      title: "Overtime Contributor",
      description: `Logged ${totalOvertimeHours} hours above the company overtime threshold`,
      date: moment().format("YYYY-MM-DD"),
      icon: TrendingUp,
      color: "text-purple-600",
    })
  }

  if (daysPresent > 0) {
    achievements.push({
      id: "active-presence",
      title: "Active Working Presence",
      description: `Completed ${daysPresent} active workday(s) recorded in the current period`,
      date: moment().format("YYYY-MM-DD"),
      icon: Star,
      color: "text-orange-600",
    })
  }

  return {
    performanceMetrics,
    chartData,
    monthlyGoals,
    achievements,
    hasEmployee: !!employeeId,
    isLoading: isLoading || policyQuery.isLoading,
    isError: isError || policyQuery.isError,
    refetch: () => { policyQuery.refetch(); if (policy && employeeId) refetch(); },
    user,
  }
}
