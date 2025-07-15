"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, MapPin, CheckCircle, TrendingUp } from "lucide-react"
import withHOC from "@/utils/with-hoc"
import { AttendancesPageProvider, useAttendancesPageContext } from "./use-attendance";
import { formatWorkingHours } from "@/utils/helper"

function AttendancePage() {
  const {
    selectedDate, setSelectedDate,
      attendanceHistory,
      monthlyStats,
      monthlyTrends,
      handleCalenderSelectDate,
    calendarSelectedData
  }=useAttendancesPageContext();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Tracking</h1>
        <p className="text-gray-600">Monitor your attendance history and performance metrics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Months</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyStats.totalHours}</p>
                <p className="text-xs text-gray-500">Total hours worked</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {/* {Math.round((monthlyStats.daysPresent / (monthlyStats.daysPresent + monthlyStats.daysAbsent)) * 100)}% */}
                  {monthlyStats.attendanceRate}%
                </p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Punctuality</p>
                <p className="text-2xl font-bold text-orange-600">{monthlyStats.punctualityScore}%</p>
                <p className="text-xs text-gray-500">On-time arrivals</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overtime</p>
                <p className="text-2xl font-bold text-purple-600">{monthlyStats.totalOvertimeHours}</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Records</CardTitle>
              <CardDescription>Your attendance history for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Overtime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.checkInTime}</TableCell>
                      <TableCell>{record.checkOutTime}</TableCell>
                      <TableCell>{record.workHours}</TableCell>
                      <TableCell>
                        <span>{record?.checkInLocation?.address}</span>
                        <span>{`${calendarSelectedData?.checkInLocation?.latitude}, ${calendarSelectedData?.checkInLocation?.longitude}`}</span>

                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status == "present"
                              ? "default"
                              : record.status === "Late"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.overtimeHours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
                <CardDescription>Choose a date to view attendance details</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleCalenderSelectDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Attendance for {selectedDate?.toLocaleDateString() || "Select a date"}</CardTitle>
                <CardDescription>Detailed attendance information for the selected date</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Check In Time</p>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="text-lg font-semibold">{calendarSelectedData?.checkInTime}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Check Out Time</p>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-red-600" />
                          <span className="text-lg font-semibold">{calendarSelectedData?.checkOutTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Work Location</p>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>{calendarSelectedData?.checkInLocation?.address}</span>
                        <span>{`${calendarSelectedData?.checkInLocation?.latitude}, ${calendarSelectedData?.checkInLocation?.longitude}`}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Total Hours Worked</p>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <span className="text-lg font-semibold">{calendarSelectedData?.workHours}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Badge variant="default" className="mb-2">
                        Present - On Time
                      </Badge>
                      <p className="text-sm text-gray-600">
                        Great job! You arrived on time and completed your full shift.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Your attendance and hours worked over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyTrends.map((week, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{week.week}</p>
                        <p className="text-sm text-gray-600">{week.totalHours}h worked</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{week.attendanceRate}%</p>
                        <p className="text-sm text-gray-600">Attendance</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Key metrics for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Attendance</span>
                      <span className="text-sm font-bold">{monthlyStats.attendanceRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${monthlyStats.attendanceRate}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Punctuality Score</span>
                      <span className="text-sm font-bold">{monthlyStats.punctualityScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${monthlyStats.punctualityScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overtime Compliance</span>
                      <span className="text-sm font-bold">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Achievements This Month</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Perfect attendance for 2 weeks</li>
                      <li>• Consistently early arrivals</li>
                      <li>• Zero safety incidents</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default withHOC(AttendancesPageProvider, AttendancePage);
