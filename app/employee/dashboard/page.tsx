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
import { formatTimeDifference } from "@/utils/helper";
import { Separator } from "@/components/ui/separator"
export default function EmployeeDashboard() {
  const {
    isCheckedIn, setIsCheckedIn, checkInTime, setCheckInTime, currentLocation, setCurrentLocation,
    locationLoading, setLocationLoading,
    showCamera, setShowCamera, photoTaken, setPhotoTaken, handleCheckIn, handleTakePhoto, handleCheckOut,
    todayCheckData
  } = useEmployeesDashboard();
  console.log(new Date().toLocaleDateString(), checkInTime);
  const isCheckedOut = todayCheckData?.data?.checkOutTime && true;
  const workDuration = formatTimeDifference(checkInTime, todayCheckData?.data?.checkOutTime || new Date());
  let checkInTimeFormat_ = new Date(checkInTime);
  const checkInTimeLocalFormat = checkInTimeFormat_?.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  let checkOutTimeFormat_ = new Date(todayCheckData?.data?.checkOutTime);
  const checkOutTimeLocalFormat = checkOutTimeFormat_?.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome back, vikas!</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Here's your daily overview for {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Large Attendance Section */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-lg sm:text-xl">Attendance Tracking</CardTitle>
            </div>
            <Badge variant={isCheckedIn ? "default" : "secondary"} className="text-xs sm:text-sm w-fit">
              {isCheckedOut ? "Checked Out" : isCheckedIn ? "Checked In" :  "Not Checked In"}
            </Badge>
          </div>
          <CardDescription className="text-sm">Track your work hours with location verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Live Location Display */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 sm:p-4 rounded-lg border">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <div className="flex items-center space-x-2">
                {locationLoading ? (
                  <div className="animate-spin">
                    <Crosshair className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                ) : (
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                )}
                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                  {locationLoading ? "Getting your location..." : "Current Location"}
                </span>
              </div>
              {!locationLoading && (
                <div className="flex items-center space-x-1">
                  <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
                </div>
              )}
            </div>

            {locationLoading ? (
              <div className="space-y-2">
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              </div>
            ) : currentLocation ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{currentLocation.address}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  Coordinates: {currentLocation.lat}, {currentLocation.lng}
                </p>
                <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  <span>Location verified - Within work site boundary</span>
                </div>
              </div>
            ) : (
              <Alert variant="destructive">
                <WifiOff className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Unable to get location. Please enable location services and try again.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Check-in Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Status</p>
                  <div className="flex gap-4">
                    <samp className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                      {isCheckedIn ? `Checked in at ${checkInTimeLocalFormat}` : "Ready to check in"}

                    </samp>
                    <Separator orientation="vertical" className="w-1 text-red-600" />
                    <samp className="text-xs sm:text-sm text-red-600">{isCheckedOut ? `  Checked out at ${checkOutTimeLocalFormat}` : ""}</samp>
                  </div>

                </div>
                <div className="flex items-center">
                  {isCheckedIn ? (
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                  ) : (
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                  )}
                </div>
              </div>

              {isCheckedIn && (
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <samp className="text-blue-600 dark:text-blue-400">
                    Work duration:</samp> <samp>{workDuration} </samp>
                  {/* {Math.floor(Math.random() * 4) + 1}h {Math.floor(Math.random() * 60)}m */}

                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Photo Verification</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {photoTaken ? "Photo captured" : "Take a photo to verify"}
                  </p>
                </div>
                <div className="flex items-center">
                  {photoTaken ? (
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                  ) : (
                    <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                  )}
                </div>
              </div>

              {photoTaken && (
                <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                  <p>✓ Photo verified and uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {!isCheckedIn ? (
              <Button
                onClick={handleCheckIn}
                className="flex-1 h-10 sm:h-12 text-sm sm:text-lg"
                disabled={locationLoading || !currentLocation}
              >
                <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Check In
              </Button>
            ) : (
              <Button
                onClick={handleCheckOut}
                disabled={isCheckedOut}
                variant="outline"
                className="flex-1 h-10 sm:h-12 text-sm sm:text-lg bg-transparent"
              >
                <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {isCheckedOut ? "You have been already checkout" : "Check Out"}
              </Button>
            )}

            <Button
              onClick={handleTakePhoto}
              variant="outline"
              className="h-10 sm:h-12 px-4 sm:px-6 bg-transparent"
              disabled={showCamera}
            >
              {showCamera ? (
                <div className="animate-pulse">
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              ) : (
                <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>

            <Button variant="outline" className="h-10 sm:h-12 px-4 sm:px-6 bg-transparent">
              <Navigation className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {showCamera && (
            <Alert>
              <Camera className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Camera is active... Taking photo for attendance verification.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">95%</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">88%</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Punctuality</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-orange-600 dark:text-orange-400 mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">12</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">3</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Tasks Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
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
