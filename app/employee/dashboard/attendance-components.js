"use client"
import dynamic from "next/dynamic";

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
import { useUserFromStorage } from "@/hooks/user.context"
import _ from "lodash";
import { cn } from "@/lib/utils"
import AttendanceSelfie from "../camera/page"
// const AttendanceSelfie = dynamic(() => import("../camera/page"), { ssr: false });


export default function AttendanceComponent() {

    const {
        isCheckedIn, setIsCheckedIn, checkInTime, setCheckInTime, currentLocation, setCurrentLocation,
        locationLoading, setLocationLoading, isFetching,
        showCamera, setShowCamera, photoTaken, setPhotoTaken, handleCheckIn, handleTakePhoto, handleCheckOut,
        todayCheckData,
        isCheckedOut, workDuration, checkInTimeLocalFormat, checkOutTimeLocalFormat, isOffline
    } = useEmployeesDashboard();

    const LiveLocationComp = () => (
        <div className="">
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
                        <Wifi className={cn("h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400", isOffline && "text-red-600 dark:text-red-400")} />
                        <span className={("text-xs text-green-600 dark:text-green-400", isOffline && "text-red-400 dark:text-red-400")}>
                            {
                                isOffline ? "Offline" : "Connected"
                            }
                            </span>
                    </div>
                )}
            </div>

            {locationLoading || isOffline ? (
                <div className="space-y-2">
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
            ) : currentLocation ? (
                <div className="space-y-1">
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
    )
    const CheckedInLocationComp = ({ latitude, longitude, address, checkType }) => (
        <div className="">
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
                        {isFetching ? "Getting your check in location..." : `${checkType}`}
                    </span>
                </div>
            </div>

            {isFetching ? (
                <div className="space-y-2">
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
            ) : (
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{address}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                        Coordinates: {latitude}, {longitude}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Location verified - Within work site boundary</span>
                    </div>
                </div>
            )}
        </div>
    );

    console.log("todayCheckData?.data?.checkInLocation.latitude", !_.isEmpty(todayCheckData?.data?.checkInLocation));

    return (<>
        {/* Large Attendance Section */}
        <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                        <CardTitle className="text-lg sm:text-xl">Attendance Tracking</CardTitle>
                    </div>
                    <Badge variant={isCheckedIn ? "default" : "secondary"} className="text-xs sm:text-sm w-fit">
                        {isCheckedOut ? "Checked Out" : isCheckedIn ? "Checked In" : "Not Checked In"}
                    </Badge>
                </div>
                <CardDescription className="text-sm">Track your work hours with location verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
                {/* Live Location Display */}
                {/* <ThreeSections /> */}

                <div className="flex flex-wrap flex-col lg:flex-row gap-4 md:gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 sm:p-4 rounded-lg border divide-y lg:divide-y-0 lg:divide-x-2 divide-gray-300">
                    <div className="flex-1">
                        <LiveLocationComp />
                    </div>
                    {(!_.isEmpty(todayCheckData?.data?.checkInLocation) || isFetching )&&
                        <div className="flex-1 md:pt-2 lg:pl-2 lg:pt-0">
                            <CheckedInLocationComp
                                checkType="Check In"
                                latitude={todayCheckData?.data?.checkInLocation?.latitude}
                                longitude={todayCheckData?.data?.checkInLocation?.longitude}
                                address={todayCheckData?.data?.checkInLocation?.address} />
                        </div>
                    }
                    {(!_.isEmpty(todayCheckData?.data?.checkOutLocation) || isFetching )&&
                        <div className="flex-1 md:pt-2 lg:pl-2 lg:pt-0">
                            <CheckedInLocationComp
                                checkType="Check out"
                                latitude={todayCheckData?.data?.checkOutLocation?.latitude}
                                longitude={todayCheckData?.data?.checkOutLocation?.longitude}
                                address={todayCheckData?.data?.checkOutLocation?.address} />
                        </div>
                    }
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
                    <AttendanceSelfie  handleTakePhoto={handleTakePhoto}/>
                    // <Alert>
                    //     <Camera className="h-4 w-4" />
                    //     <AlertDescription className="text-sm">
                    //         Camera is active... Taking photo for attendance verification.
                    //     </AlertDescription>
                    // </Alert>
                )}
            </CardContent>
        </Card>
    </>
    )
}