"use client"
import DOMPurify from "dompurify"; // सुरक्षा खातिर
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Clock, MapPin, Users, CalendarIcon, Edit, Trash2, AlertCircle, Eye, MoreHorizontal, CheckCircle2, MoreVerticalIcon } from "lucide-react"
import AddForm from "./add-form";
import { TaskSchedulePageProvider, useTaskSchedulePageContext } from "./use-task-schedule";
import withHOC from "@/utils/with-hoc";
import TaskSchedulesForm from "./add-task";
// import { Combobox } from "react-widgets/cjs";
// import { ComboBox } from "react-widgets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useSearchParams, useRouter } from 'next/navigation';
import Link from "next/link";
import { cn } from "@/lib/utils";
import TaskList, { TaskCardSkeleton } from "./task-list";

const statusColors = {
  scheduled: "bg-blue-500 text-white",
  in_progress: "bg-orange-500 text-white",
  completed: "bg-green-500 text-white",
  cancelled: "bg-red-500 text-white",
  on_hold: "bg-yellow-500 text-black",
};

function TaskSchedulePage() {
  const router = useRouter();
  const { selectedDate, setSelectedDate, viewMode, setViewMode, events, shifts, TaskSchedulesData,
    openEditDialog, isFetchingTaskList
  } = useTaskSchedulePageContext()
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "training":
        return "bg-green-100 text-green-800 border-green-200"
      case "task":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "schedule_visit":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600"
      case "normal":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const todaysEvents = events.filter(
    (event) => new Date(event.date).toDateString() === (selectedDate || new Date()).toDateString(),
  )
  const cleanHTML = (content) => DOMPurify.sanitize(content);
  const dropdownMenuItems = (request) => {
    return <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => {
        router.push(`?parentId=${request.id}&ProjectsSiteId=${request?.ProjectsSiteId}`)
        openEditDialog({ ProjectsSiteId: request?.ProjectsSiteId, parentId: request.id })
      }}>
        {/* <Eye className="mr-2 h-4 w-4" /> */}
        <Plus className="mr-2 h-4 w-4" />
        Add Sub Task
      </DropdownMenuItem>
      <DropdownMenuItem >
        <Eye className="mr-2 h-4 w-4" />
        View Details
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => openEditDialog(request)} disabled={request.status !== "PENDING"}>
        <Edit className="mr-2 h-4 w-4" />
        Edit Request
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={request.status !== "PENDING"}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the employee record and
              remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuContent>
  }
  return (
    <div className="">
      {/* Header p-6 space-y-6*/}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar & Scheduling</h1>
          <p className="text-muted-foreground">Manage events, meetings, and employee schedules</p>
        </div>
        <div className="flex space-x-2">
          {/* <AddForm /> */}
          <TaskSchedulesForm />
        </div>
      </div>

      {/* Calendar Tabs */}
      <Tabs defaultValue="events" className="">
        {/* space-y-6 */}
        <TabsList>
          <TabsTrigger value="events">Schedule/Task List</TabsTrigger>
          <TabsTrigger value="calendar" disabled>Calendar View</TabsTrigger>
          <TabsTrigger value="schedule" disabled>Employee Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Calendar</CardTitle>
                  <Select value={viewMode} onValueChange={setViewMode}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Events</CardTitle>
                  <CardDescription>
                    {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todaysEvents.length > 0 ? (
                      todaysEvents.map((event) => (
                        <div key={event.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>{event.type}</Badge>
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.time} ({event.duration})
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {Array.isArray(event.attendees) ? event.attendees.length : 1} attendees
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No events scheduled for this date</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Assign Shifts
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Clock className="h-4 w-4 mr-2" />
                    View Availability
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Shifts</CardTitle>
                <CardDescription>Daily shift assignments and schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{shift.employee}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {shift.site}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{shift.status}</Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule Overview</CardTitle>
                <CardDescription>Weekly schedule summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div key={day} className="font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }, (_, i) => (
                      <div key={i} className="space-y-1">
                        <div className="text-center text-sm font-medium">{15 + i}</div>
                        <div className="space-y-1">
                          <div className="h-2 bg-blue-200 rounded"></div>
                          <div className="h-2 bg-green-200 rounded"></div>
                          <div className="h-2 bg-orange-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-200 rounded mr-1"></div>
                        <span>Morning Shift</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-200 rounded mr-1"></div>
                        <span>Day Shift</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-200 rounded mr-1"></div>
                        <span>Evening Shift</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="">
          {/* space-y-6 */}
          <Card>
            <CardHeader>
              <CardTitle>All Schedule/Task List</CardTitle>
              <CardDescription>Complete list of scheduled events and tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {
                isFetchingTaskList ? <>
                <TaskCardSkeleton />
                <TaskCardSkeleton />
                <TaskCardSkeleton />
                <TaskCardSkeleton />
                </>: <TaskList TaskSchedulesData={TaskSchedulesData?.data} openEditDialog={openEditDialog} router={router} />
              }
              
              {/* <div className="space-y-2">
                {TaskSchedulesData?.data?.map((event) => (
                  <div key={event.id} className="p-2 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-1">
                      <div className="space-y-1 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">
                            <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>{event.type}</Badge>
                            <Link href={`task-manage/${event.id}`}>
                              #{event.id.split("-")[4]} :
                            </Link>

                            {" "}
                            {event.title}
                          </h3>
                          <AlertCircle className={`h-4 w-4 ${getPriorityColor(event.priority)}`} />
                          <samp className="text-muted-foreground">
                            Priority:{event.priority}
                          </samp>

                          <Badge className={`text-xs ${statusColors[event?.status?.toLowerCase()]}`}>{event.status}</Badge>
                         
                        </div>

                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          {dropdownMenuItems(event)}
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="mb-2 px-2 ">
                      <samp className="text-sm">Projects/Sites:{event?.ProjectsSite?.name}</samp>
                      <div className="text-sm">Discription:</div>
                      <div
                        className="p-2 prose prose-sm text-gray-700 line-clamp-2 bg-gray-100"
                        dangerouslySetInnerHTML={{ __html: cleanHTML(event.taskDescription) }}
                      />
                    </div>

                    <div className="grid grid-flow-col  gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.startTime} ({event.estimatedHours})hrs
                      </div>
                      <div className="flex items-center text-muted-foreground cursor-pointer"
                        title={event?.ProjectsSite?.address}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        <div >
                          {event?.ProjectsSite?.name}
                          <samp>
                          </samp>
                        </div>

                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {event?.assignToEmployee?.user?.fullName}
                      </div>
                      {event?.subTasks.length > 0 && <div className="flex items-center text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        SubTasks:  {event?.subTasks.length}
                      </div>}
                      <div className="flex items-center text-muted-foreground">
                        created by:{event?.createBy?.fullName}
                      </div>
                    </div>

                    {/* {Array.isArray(event.attendees) && event.attendees.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Attendees:</p>
                        <div className="flex flex-wrap gap-1">
                          {event.attendees.map((attendee, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {attendee}
                            </Badge>
                          ))}
                        </div>
                      </div>
                  </div>
                ))}
              </div> */}

              {/* end */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default withHOC(TaskSchedulePageProvider, TaskSchedulePage);
