"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AttendanceChart } from "@/components/attendance-chart"
import { PerformanceChart } from "@/components/performance-chart"
import { Users, Clock, MapPin, TrendingUp, CheckCircle, Calendar, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Employees",
      value: "24",
      change: "+2 this month",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Present Today",
      value: "18",
      change: "75% attendance",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Active Job Sites",
      value: "8",
      change: "3 new this week",
      icon: MapPin,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Avg Performance",
      value: "87%",
      change: "+5% from last month",
      icon: TrendingUp,
      color: "text-orange-600 dark:text-orange-400",
    },
  ]

  const recentActivity = [
    {
      employee: "John Smith",
      action: "Checked in",
      location: "Downtown Office",
      time: "8:30 AM",
      status: "on-time",
    },
    {
      employee: "Sarah Johnson",
      action: "Checked out",
      location: "Residential Site A",
      time: "5:15 PM",
      status: "completed",
    },
    {
      employee: "Mike Wilson",
      action: "Late check-in",
      location: "Commercial Site B",
      time: "9:45 AM",
      status: "late",
    },
    {
      employee: "Emily Davis",
      action: "Break started",
      location: "Industrial Site C",
      time: "12:00 PM",
      status: "break",
    },
  ]

  const upcomingSchedules = [
    {
      site: "Downtown Office",
      employees: 6,
      time: "8:00 AM - 5:00 PM",
      date: "Today",
    },
    {
      site: "Residential Complex",
      employees: 4,
      time: "9:00 AM - 6:00 PM",
      date: "Tomorrow",
    },
    {
      site: "Shopping Mall",
      employees: 8,
      time: "7:00 AM - 4:00 PM",
      date: "Dec 15",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your team today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
            <Button className="w-full sm:w-auto">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Daily attendance for the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Team performance across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>
      </div>

      {/* Activity and Schedule Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest employee check-ins and activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.employee}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.action} at {activity.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge
                    variant={
                      activity.status === "late"
                        ? "destructive"
                        : activity.status === "on-time"
                          ? "default"
                          : activity.status === "completed"
                            ? "secondary"
                            : "outline"
                    }
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Schedules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Schedules
            </CardTitle>
            <CardDescription>Scheduled work assignments for the next few days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSchedules.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{schedule.site}</p>
                  <p className="text-xs text-muted-foreground">
                    {schedule.employees} employees • {schedule.time}
                  </p>
                </div>
                <Badge variant="outline" className="ml-4 whitespace-nowrap">
                  {schedule.date}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Users className="h-6 w-6" />
              <span className="text-sm">Add Employee</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <MapPin className="h-6 w-6" />
              <span className="text-sm">New Job Site</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Schedule Work</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
