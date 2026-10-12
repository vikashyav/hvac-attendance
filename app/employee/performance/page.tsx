"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Clock, Award, CheckCircle, AlertCircle, Calendar, Star, RefreshCw, MessageSquare } from "lucide-react"
import { PerformanceChart } from "@/components/performance-chart"
import { usePerformance } from "./use-performance"

export default function PerformancePage() {
  const {
    performanceMetrics,
    chartData,
    monthlyGoals,
    achievements,
    isLoading,
    isError,
    refetch,
    user,
  } = usePerformance()

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "text-green-600"
      case "in-progress":
        return "text-blue-600"
      case "at-risk":
        return "text-orange-600"
      case "missed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getGoalStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return CheckCircle
      case "in-progress":
        return Clock
      case "at-risk":
        return AlertCircle
      case "missed":
        return AlertCircle
      default:
        return Clock
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
        <Skeleton className="h-80 rounded-lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Unable to Load Performance Data
            </CardTitle>
            <CardDescription>
              We encountered an issue fetching your attendance records and performance metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-muted-foreground">
            Live attendance and efficiency metrics calculated under your active company policy
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 self-start sm:self-auto">
          <RefreshCw className="h-4 w-4" />
          Refresh Stats
        </Button>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{performanceMetrics.overall}%</div>
            <p className="text-xs text-muted-foreground">Ratio of delivered work hours to scheduled hours</p>
            <Progress value={Math.min(100, performanceMetrics.overall)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{performanceMetrics.attendance}%</div>
            <p className="text-xs text-muted-foreground">
              {performanceMetrics.daysPresent} present out of {performanceMetrics.totalWorkingDays} working days
            </p>
            <Progress value={Math.min(100, performanceMetrics.attendance)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Punctuality Score</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{performanceMetrics.punctuality}%</div>
            <p className="text-xs text-muted-foreground">On-time check-ins within company grace period</p>
            <Progress value={Math.min(100, performanceMetrics.punctuality)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Tabs */}
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>Current performance scores measured against target baselines</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart data={chartData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
                <CardDescription>Actual recorded work and attendance statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Attendance Rate</span>
                    <span className="font-semibold text-green-600">{performanceMetrics.attendance}%</span>
                  </div>
                  <Progress value={Math.min(100, performanceMetrics.attendance)} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Punctuality</span>
                    <span className="font-semibold text-blue-600">{performanceMetrics.punctuality}%</span>
                  </div>
                  <Progress value={Math.min(100, performanceMetrics.punctuality)} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Total Work Hours</span>
                    <span className="font-semibold text-purple-600">{performanceMetrics.totalHours} hrs</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Delivered across {performanceMetrics.daysPresent} active working days
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Overtime Hours</span>
                    <span className="font-semibold text-orange-600">{performanceMetrics.totalOvertimeHours} hrs</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Hours accumulated past company overtime threshold
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Goals & Targets</CardTitle>
              <CardDescription>Dynamic progress tracking based on policy benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyGoals.map((goal) => {
                  const StatusIcon = getGoalStatusIcon(goal.status)
                  const progress = Math.min((goal.current / goal.target) * 100, 100)

                  return (
                    <div key={goal.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{goal.title}</h4>
                            <StatusIcon className={`h-4 w-4 ${getGoalStatusColor(goal.status)}`} />
                          </div>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                        <Badge variant={goal.status === "achieved" ? "default" : "secondary"}>
                          {goal.status === "achieved" ? "Achieved" : "In Progress"}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {typeof goal.current === "number" ? goal.current.toFixed(1) : goal.current}
                            {goal.title.includes("%") ? "%" : ""} / {goal.target}
                            {goal.title.includes("%") ? "%" : ""}
                          </span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Earned Achievements</CardTitle>
              <CardDescription>Milestones awarded based on your verified attendance record</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="space-y-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon
                    return (
                      <div key={achievement.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className={`p-2 rounded-full bg-muted ${achievement.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Active as of {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">No Milestones Recorded Yet</p>
                  <p className="text-xs mt-1">
                    Maintain consistent on-time attendance to unlock performance achievements.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supervisor Feedback & Appraisals</CardTitle>
              <CardDescription>Official reviews and comments from managerial staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 space-y-3">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <div className="space-y-1">
                  <h4 className="font-medium text-base">No Appraisals Published Yet</h4>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Formal performance appraisals and manager review comments will appear here once submitted by your supervisor for the current evaluation period.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
