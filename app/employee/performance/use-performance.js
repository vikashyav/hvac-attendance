"use client"

import { useQuery } from "@tanstack/react-query"
import { getAttendance } from "@/lib/api/attendance-api"
import { useUserFromStorage } from "@/hooks/user.context"
import moment from "moment"
import { Award, Calendar, Clock, Star, TrendingUp } from "lucide-react"

export function usePerformance() {
  const { user } = useUserFromStorage()
  const today = moment()
  const from = moment(today).startOf("month").format("YYYY-MM-DD")
  const to = moment(today).endOf("day").format("YYYY-MM-DD")

  const queryKey = [
    "performance",
    user?.id,
    user?.companyId,
    { from, to }
  ]

  const { data: attendanceRes, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: getAttendance,
    enabled: !!user?.id,
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
      target: 95,
      improvement: attendance >= 95 ? "+On Target" : `${(attendance - 95).toFixed(1)}%`,
    },
    {
      metric: "Punctuality",
      score: punctuality,
      target: 90,
      improvement: punctuality >= 90 ? "+On Target" : `${(punctuality - 90).toFixed(1)}%`,
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

  const monthlyGoals = [
    {
      id: 1,
      title: "Maintain 95%+ Attendance",
      current: attendance,
      target: 95,
      status: attendance >= 95 ? "achieved" : "in-progress",
      description: "Keep consistent check-ins across scheduled working days",
    },
    {
      id: 2,
      title: "Improve Punctuality to 90%",
      current: punctuality,
      target: 90,
      status: punctuality >= 90 ? "achieved" : "in-progress",
      description: "Arrive on time within the company grace period",
    },
    {
      id: 3,
      title: "Complete Working Hours Target",
      current: totalHours,
      target: totalWorkingDays > 0 ? Number((totalWorkingDays * 8).toFixed(1)) : 40,
      status: totalWorkingDays > 0 && totalHours >= totalWorkingDays * 8 ? "achieved" : "in-progress",
      description: "Deliver required scheduled hours based on active company policy",
    },
    {
      id: 4,
      title: "100% Performance Efficiency",
      current: overall,
      target: 100,
      status: overall >= 100 ? "achieved" : "in-progress",
      description: "Achieve optimal ratio of delivered work hours to required schedule",
    },
  ]

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

  if (punctuality >= 90 && daysPresent > 0) {
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
      description: `Logged ${totalOvertimeHours} hours of authorized overtime support`,
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
    isLoading,
    isError,
    refetch,
    user,
  }
}
