"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AttendanceChart } from "@/components/attendance-chart"
import { PerformanceChart } from "@/components/performance-chart"
import { Users, Clock, MapPin, TrendingUp, CheckCircle, Calendar, BarChart3 } from "lucide-react"
import { AdminDashboardPageProvider, useAdminDashboardPageContext } from "./use-adminDashboard"
import withHOC from "@/utils/with-hoc"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Map from '../../../components/map-popover'

function AdminDashboardPage() {
  const {
    stats, recentActivity, upcomingSchedules, attendanceOverview, isFetching, handleGenerateReport
  } = useAdminDashboardPageContext();

  return (
    <div className="space-y-6">
      {/* Header sticky top-0 z-10 */}
      <div className=" bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4 mb-6">
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
            <Button onClick={handleGenerateReport} className="w-full sm:w-auto">
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
              {isFetching ?
                <div className="space-y-2">
                  <div className="h-8 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div> :
                <>
                  <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </>}
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
            <AttendanceChart attendanceOverview={attendanceOverview} />
          </CardContent>
        </Card>
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

                  <div className="flex gap-2">
                    {/* <img data-popover-target="popover-default" src={activity?.checkOutPhoto || activity?.checkInPhoto} className="w-8 h-8 rounded-full" /> */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <img data-popover-target="popover-default" src={activity?.checkOutPhoto || activity?.checkInPhoto} className="w-8 h-8 rounded-full" />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <img data-popover-target="popover-default" src={activity?.checkOutPhoto || activity?.checkInPhoto} className="w-1/4 h-1/4" />

                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground">
                      {activity.action} at {"  "}
                      <Map latitude={activity?.checkOutLocation?.latitude || activity?.checkInLocation?.latitude}
                        label={activity?.checkOutLocation?.address || activity?.checkInLocation?.address}
                        longitude={activity?.checkOutLocation?.longitude || activity?.checkInLocation?.longitude} />
                      {/* {activity.location} */}
                    </p>
                  </div>

                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge
                    variant={
                      activity.status === "late"
                        ? "destructive"
                        : (activity.status === "on-time" || activity.status === "present")
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

        {/* <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Team performance across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card> */}
      </div>

      {/* Activity and Schedule Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Upcoming Schedules */}
        <Card>
          <Badge variant="destructive" className="w-full whitespace-nowrap">
            Work Under Progress - we are working on this module
          </Badge>
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
        <Badge variant="destructive" className="w-full whitespace-nowrap">
          Work Under Progress - we are working on this module
        </Badge>
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

export default withHOC(AdminDashboardPageProvider, AdminDashboardPage);
