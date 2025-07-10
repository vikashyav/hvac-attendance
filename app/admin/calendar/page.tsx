"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Clock, MapPin, Users, CalendarIcon, Edit, Trash2, AlertCircle } from "lucide-react"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState("month")

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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "training":
        return "bg-green-100 text-green-800 border-green-200"
      case "presentation":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "orientation":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar & Scheduling</h1>
          <p className="text-muted-foreground">Manage events, meetings, and employee schedules</p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Schedule a new event or meeting</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" placeholder="Enter event title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 minutes</SelectItem>
                      <SelectItem value="1hour">1 hour</SelectItem>
                      <SelectItem value="2hours">2 hours</SelectItem>
                      <SelectItem value="4hours">4 hours</SelectItem>
                      <SelectItem value="allday">All day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="orientation">Orientation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Enter location" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="attendees">Attendees</Label>
                  <Input id="attendees" placeholder="Select attendees" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Event description..." />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Tabs */}
      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="schedule">Employee Schedule</TabsTrigger>
          <TabsTrigger value="events">Event List</TabsTrigger>
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

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>Complete list of scheduled events and meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{event.title}</h3>
                          <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>{event.type}</Badge>
                          <AlertCircle className={`h-4 w-4 ${getPriorityColor(event.priority)}`} />
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {Array.isArray(event.attendees) ? event.attendees.length : 1} attendees
                      </div>
                    </div>

                    {Array.isArray(event.attendees) && event.attendees.length > 0 && (
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
                    )}
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
