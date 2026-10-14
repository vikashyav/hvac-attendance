"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Clock, User, CalendarIcon, AlertCircle, CheckCircle2, RefreshCw, Briefcase, ListTodo } from "lucide-react"
import { useEmployeeSchedule } from "./use-employee-schedule"
import moment from "moment"

export default function SchedulePage() {
  const {
    user,
    hasEmployee,
    selectedDate,
    setSelectedDate,
    selectedDateStr,
    allTasks,
    todayTasks,
    selectedDateTasks,
    upcomingTasks,
    isLoading,
    isError,
    refetch,
  } = useEmployeeSchedule()

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "on_hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "normal":
        return <Badge variant="secondary">Normal</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const getEventTypeColor = (type?: string) => {
    switch (type) {
      case "training":
        return "bg-green-100 text-green-800 border-green-200"
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "schedule_visit":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!hasEmployee) return <div className="p-6">No employee profile is linked to this account. Contact your administrator.</div>

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
        </div>
        <Skeleton className="h-96 rounded-lg" />
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
              Unable to Load Schedule
            </CardTitle>
            <CardDescription>
              We encountered an issue fetching your scheduled tasks and shift assignments.
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
          <h1 className="text-3xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground">
            View your scheduled shifts, field visits, and assigned tasks
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 self-start sm:self-auto">
          <RefreshCw className="h-4 w-4" />
          Refresh Schedule
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayTasks.length > 0 ? "Assignments scheduled for today" : "No tasks scheduled for today"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected Date ({moment(selectedDate).format("MMM D")})</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{selectedDateTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {selectedDateTasks.length > 0 ? "Tasks assigned on selected date" : "Clear schedule for selected date"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Assignments</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{upcomingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled future assignments and visits</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Schedule Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Selection Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Select Date</CardTitle>
              <CardDescription>Pick a date to inspect scheduled shifts</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                className="rounded-md border shadow-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Task Details for Selected Date & Upcoming Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="day" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full sm:w-auto">
              <TabsTrigger value="day">
                Day View ({moment(selectedDate).format("MMM D")})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                All Upcoming ({upcomingTasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="day" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Assignments for {moment(selectedDate).format("dddd, MMMM D, YYYY")}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateTasks.length} assignment(s) recorded for this day
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedDateTasks.length > 0 ? (
                    selectedDateTasks.map((task: any) => (
                      <div key={task.id} className="p-4 border rounded-lg space-y-3 bg-card hover:border-primary/40 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-base">{task.title}</h4>
                              {getPriorityBadge(task.priority)}
                              {task.type && (
                                <Badge className={`text-xs ${getEventTypeColor(task.type)}`}>
                                  {task.type.replace("_", " ")}
                                </Badge>
                              )}
                            </div>
                            {task.taskDescription && (
                              <p className="text-sm text-muted-foreground">{task.taskDescription}</p>
                            )}
                          </div>
                          <Badge className={`text-xs capitalize self-start ${getStatusColor(task.status)}`}>
                            {(task.status || "pending").replace("_", " ")}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t">
                          {(task.startTime || task.endTime) && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{task.startTime || "--"} {task.endTime ? `- ${task.endTime}` : ""}</span>
                            </div>
                          )}
                          {task.ProjectsSite && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-primary" />
                              <span>{task.ProjectsSite.name} {task.ProjectsSite.address ? `(${task.ProjectsSite.address})` : ""}</span>
                            </div>
                          )}
                          {task.createBy && (
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              <span>Assigned by: {task.createBy.fullName || task.createBy.firstName}</span>
                            </div>
                          )}
                          {Array.isArray(task.subTasks) && task.subTasks.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <ListTodo className="h-3.5 w-3.5" />
                              <span>{task.subTasks.length} subtask(s)</span>
                            </div>
                          )}
                        </div>

                        {task.notes && (
                          <div className="p-2.5 rounded bg-muted/50 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Notes: </span>
                            {task.notes}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground space-y-2">
                      <CheckCircle2 className="h-10 w-10 mx-auto text-green-500/70" />
                      <p className="font-medium text-base">No Assignments Scheduled</p>
                      <p className="text-xs max-w-sm mx-auto">
                        You have no job site visits or scheduled tasks on {moment(selectedDate).format("MMMM D, YYYY")}.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Shifts & Tasks</CardTitle>
                  <CardDescription>All pending and upcoming assignments assigned to you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingTasks.length > 0 ? (
                    upcomingTasks.map((task: any) => (
                      <div key={task.id} className="p-4 border rounded-lg space-y-2.5 hover:border-primary/40 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">{task.title}</span>
                              {getPriorityBadge(task.priority)}
                              {task.type && (
                                <Badge className={`text-xs ${getEventTypeColor(task.type)}`}>
                                  {task.type.replace("_", " ")}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {task.startDate && (
                                <span className="flex items-center gap-1 font-medium text-foreground">
                                  <CalendarIcon className="h-3 w-3" />
                                  {moment(task.startDate).format("ddd, MMM D, YYYY")}
                                </span>
                              )}
                              {task.ProjectsSite && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-primary" />
                                  {task.ProjectsSite.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge className={`text-xs capitalize self-start ${getStatusColor(task.status)}`}>
                            {(task.status || "pending").replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground space-y-2">
                      <Briefcase className="h-10 w-10 mx-auto opacity-50" />
                      <p className="font-medium text-base">No Upcoming Tasks</p>
                      <p className="text-xs">You currently have no future assignments or visits queued.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
