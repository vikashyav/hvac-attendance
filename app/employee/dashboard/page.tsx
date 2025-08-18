"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Clock,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Camera,
  Navigation,
  Crosshair,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEmployeesDashboard } from "@/hooks/use-employeeDashboard";
import { Separator } from "@/components/ui/separator"
import { useUserFromStorage } from "@/hooks/user.context"
import AttendanceComponent from "./attendance-components"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

export default function EmployeeDashboard() {
  const router = useRouter();
    const { toast } = useToast()

  const { user, removeUser } = useUserFromStorage();
  const {
    isCheckedIn, setIsCheckedIn, checkInTime, setCheckInTime, currentLocation, setCurrentLocation,
    locationLoading, setLocationLoading,
    showCamera, setShowCamera, photoTaken, setPhotoTaken, handleCheckIn, handleTakePhoto, handleCheckOut,
    todayCheckData,
    isCheckedOut, workDuration, checkInTimeLocalFormat, checkOutTimeLocalFormat, dashboardStats
  } = useEmployeesDashboard();

  if (user.isDefaultPassword) {
    toast({
      title: "Security alert!, Please change your password",
      description: "You have sign in by default password, Please change it..!!",
    })
    router.push('/employee/profile?acive_tab=settings');
    // alert("You have sign in by default password, Please change it..!!")
    return
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user.firstName}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Here's your daily overview for {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Large Attendance Section */}
      <AttendanceComponent />
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats?.data?.attendanceRate}%</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Attendance Rate </p>
            <small className="text-xs p-0 text-gray-600 dark:text-gray-400">(this month to till now)</small>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats?.data?.punctualityRate}%</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Punctuality</p>
            <small className="text-xs p-0 text-gray-600 dark:text-gray-400">(this month to till now)</small>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-orange-600 dark:text-orange-400 mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats?.data?.dayStreak || "-"}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats?.data?.tasksToday || "-"}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Tasks Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <Badge variant="destructive" className="w-full whitespace-nowrap">
          Work Under Progress - we are working on this module
        </Badge>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Today's Schedule</CardTitle>
          <CardDescription className="text-sm">Your assignments and tasks for today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Morning Safety Check</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Equipment inspection completed
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs ml-2"
            >
              Completed
            </Badge>
          </div>

          <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">HVAC Installation</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Commercial Plaza - Unit 4B
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs ml-2"
            >
              In Progress
            </Badge>
          </div>

          <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">System Maintenance</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Residential Complex A - 2:00 PM
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs ml-2">
              Pending
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
