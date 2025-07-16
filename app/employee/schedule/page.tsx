"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Clock, User, Navigation, Phone, CalendarIcon, AlertCircle } from "lucide-react"

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const todaySchedule = {
    site: "Downtown Office Complex",
    address: "123 Business Ave, Downtown, NY 10001",
    startTime: "8:00 AM",
    endTime: "5:00 PM",
    supervisor: "Mike Johnson",
    supervisorPhone: "(555) 123-4567",
    tasks: [
      "HVAC system inspection - Floor 5-8",
      "Replace air filters in conference rooms",
      "Check thermostat calibration",
      "Document maintenance activities",
    ],
    notes: "Bring safety equipment for high-altitude work. Client meeting at 2 PM.",
  }

  const weekSchedule = [
    {
      date: "2024-01-15",
      day: "Monday",
      site: "Downtown Office Complex",
      startTime: "8:00 AM",
      endTime: "5:00 PM",
      supervisor: "Mike Johnson",
      status: "confirmed",
    },
    {
      date: "2024-01-16",
      day: "Tuesday",
      site: "Shopping Mall Project",
      startTime: "8:30 AM",
      endTime: "5:30 PM",
      supervisor: "Sarah Wilson",
      status: "confirmed",
    },
    {
      date: "2024-01-17",
      day: "Wednesday",
      site: "Residential Complex",
      startTime: "9:00 AM",
      endTime: "6:00 PM",
      supervisor: "Tom Brown",
      status: "pending",
    },
    {
      date: "2024-01-18",
      day: "Thursday",
      site: "Downtown Office Complex",
      startTime: "8:00 AM",
      endTime: "5:00 PM",
      supervisor: "Mike Johnson",
      status: "confirmed",
    },
    {
      date: "2024-01-19",
      day: "Friday",
      site: "Industrial Warehouse",
      startTime: "7:30 AM",
      endTime: "4:30 PM",
      supervisor: "Lisa Garcia",
      status: "confirmed",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Safety Training Session",
      date: "2024-01-20",
      time: "9:00 AM",
      duration: "3 hours",
      location: "Training Center",
      type: "training",
      mandatory: true,
    },
    {
      id: 2,
      title: "Team Meeting",
      date: "2024-01-22",
      time: "10:00 AM",
      duration: "1 hour",
      location: "Main Office",
      type: "meeting",
      mandatory: false,
    },
    {
      id: 3,
      title: "Equipment Maintenance",
      date: "2024-01-25",
      time: "8:00 AM",
      duration: "4 hours",
      location: "Equipment Yard",
      type: "maintenance",
      mandatory: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "training":
        return "bg-green-100 text-green-800 border-green-200"
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
        <Badge variant="destructive" className="w-full whitespace-nowrap">
          Work Under Progress - we are working on this module
        </Badge>
      <div>
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <p className="text-muted-foreground">View your work schedule and upcoming assignments</p>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Today's Assignment
          </CardTitle>
          <CardDescription>Your schedule for {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{todaySchedule.site}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {todaySchedule.address}
                    </p>
                  </div>
                  <Badge variant="default">Today</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {todaySchedule.startTime} - {todaySchedule.endTime}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{todaySchedule.supervisor}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Supervisor
                  </Button>
                </div>
              </div>

              {todaySchedule.notes && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{todaySchedule.notes}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Today's Tasks</h4>
                <div className="space-y-2">
                  {todaySchedule.tasks.map((task, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 border rounded">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Supervisor: {todaySchedule.supervisor}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{todaySchedule.supervisorPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Tabs */}
      <Tabs defaultValue="week" className="space-y-6">
        <TabsList>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Your assignments for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weekSchedule.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[60px]">
                        <p className="font-medium">{new Date(schedule.date).getDate()}</p>
                        <p className="text-xs text-muted-foreground">{schedule.day}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{schedule.site}</h4>
                          <Badge variant={getStatusColor(schedule.status)}>{schedule.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {schedule.supervisor}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Navigation className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Schedule Calendar</CardTitle>
                <CardDescription>View your schedule by date</CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle>Selected Date</CardTitle>
                <CardDescription>{selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="default">Scheduled</Badge>
                        <span className="text-sm text-muted-foreground">Full Day</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Site:</span>
                          <span className="font-medium">Downtown Office</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium">8:00 AM - 5:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Supervisor:</span>
                          <span className="font-medium">Mike Johnson</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Training sessions, meetings, and special assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>{event.type}</Badge>
                          {event.mandatory && (
                            <Badge variant="destructive" className="text-xs">
                              Mandatory
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time} ({event.duration})
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
