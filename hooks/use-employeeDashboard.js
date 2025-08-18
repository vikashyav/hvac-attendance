"use client"

import { useState, useEffect } from "react"
import fakeData from "@/constants/fake-data";
import { useToast } from "@/hooks/use-toast"
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { saveCheckIn, getTodayCheckIn, updateCheckOut } from "@/lib/api/employee";
import _ from "lodash";
import { formatTimeDifference } from "@/utils/helper";
import { getEmployeeDashboardStats } from "@/lib/api/dashboard-api";




export function useEmployeesDashboard() {
    const { toast } = useToast()
    const [isOffline, setOffline] = useState()
    const [isCheckedIn, setIsCheckedIn] = useState(false)
    const [checkInTime, setCheckInTime] = useState(null)
    const [currentLocation, setCurrentLocation] = useState(null)
    const [locationLoading, setLocationLoading] = useState(true)
    const [showCamera, setShowCamera] = useState(false);
    const [photoTaken, setPhotoTaken] = useState(false);
    const [imgData, setImgData] = useState("")
    const notificationModal = useNotificationModalContext();
    console.log("iss", isOffline);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const { data: todayCheckData, isSuccess: isFetchedTodayCheckIn, refetch, isFetching } = useQuery({
        queryKey: { startOfDay, endOfDay }, // Include params in queryKey
        queryFn: getTodayCheckIn,
        onSuccess: (res) => {
            // console.log(res);

        }
    })
    const { data: dashboardStats, isFetching: isFetchingdashboardStats, isSuccess, refetch: refetchdashboardStats, } = useQuery({
        queryKey: ['dashboardStats-emp'],
        queryFn: getEmployeeDashboardStats
    })
    // console.log(todayCheckData?.data, "isFetchedTodayCheckIn", isFetchedTodayCheckIn);

    const saveCheckInByEmp = useMutation({
        mutationFn: saveCheckIn,
    })

    const updateCheckOutByEmp = useMutation({
        mutationFn: updateCheckOut,
    })

    useEffect(() => {
        if (isFetchedTodayCheckIn && !_.isEmpty(todayCheckData?.data)) {
            setCheckInTime(todayCheckData?.data?.checkInTime);
            setIsCheckedIn(true);
        }
    }, [isFetchedTodayCheckIn])

    // Simulate getting location
    useEffect(() => {
        const getLocation = () => {
            setLocationLoading(true)
            // Simulate GPS loading
            //  useEffect(() => {
            if (!navigator.geolocation) {
                setCurrentLocation((prev) => ({ ...prev, error: "Geolocation not supported" }));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setCurrentLocation({
                        lat: lat,
                        lng: lng,
                        error: null,
                    });
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                        {
                            headers: {
                                "User-Agent": "my-next-app (your@email.com)",
                            },
                        }
                    );
                    const data = await res.json();
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        address: data.display_name,
                        error: null,
                    });
                    setLocationLoading(false)
                },
                (err) => {
                    setCurrentLocation((prev) => ({ ...prev, error: err.message }));
                    setLocationLoading(false)
                }
            );
        }
        getLocation();

        //    if (typeof window !== 'undefined'){
        const handleCheckOnline = () => setOffline(false);
        const handleCheckOffline = () => setOffline(true);
        window.addEventListener("online", () => {
            console.log("listened online");
            setOffline(false);
        });
        window.addEventListener("offline", () => {
            console.log("listened offline");
            // setLocationLoading(false)
            setOffline(true);
        });
        return () => {
            // window.removeEventListener("online", handleCheckOnline);
            // window.removeEventListener("ofline", handleCheckOffline);
        }
        // }
    }, [])

    const handleCheckIn = () => {
        if (!currentLocation || !imgData) {
            toast({
                title: "Check in selfie and gps coordinate is required",
                description: "Tap the camera button (next to Check-In) to take a selfie.",
                variant: "destructive",
                duration: 2000
            })
            return;
        }
        notificationModal.progress({
            heading: `Checking with your current location, Please await!!`,
        });
        const checkInPayload = {
            checkInLocation: {
                latitude: currentLocation?.lat,
                longitude: currentLocation?.lng,
                address: currentLocation?.address
            },
            checkInTime: new Date(),
            photoData: imgData
        }
        saveCheckInByEmp.mutate(checkInPayload, {
            onSuccess: (res) => {
                // console.log(res?.data?.checkInTime);

                setIsCheckedIn(true)
                notificationModal.success({ heading: "Success", body: `Checked In with your live location.` });
                setImgData("");
                setCheckInTime(res?.data?.checkInTime);
                refetch();

            },
            onError: () => {
                setIsCheckedIn(false)
                notificationModal.error({ heading: "failed Something went wrong!!!", body: JSON.stringify(err) });

            }
        })

    }

    const handleCheckOut = () => {
        if (!currentLocation || !imgData) {
            toast({
                title: "Check in selfie and gps coordinate is required",
                description: "Tap the camera button (next to Check-In) to take a selfie.",
                variant: "destructive",
                duration: 2000
            })
            return;
        }
        notificationModal.progress({
            heading: `Checking Out with your current location, Please await!!`,
        });
        const checkOutPayload = {
            checkOutLocation: {
                latitude: currentLocation?.lat,
                longitude: currentLocation?.lng,
                address: currentLocation?.address
            },
            checkOutTime: new Date(),
            checkInTime: todayCheckData?.data?.checkInTime,
            check_in_id: todayCheckData?.data?.id,
            photoData: imgData
        };
        updateCheckOutByEmp.mutate(checkOutPayload, {
            onSuccess: (res) => {
                refetch();
                notificationModal.success({ heading: "Success", body: `Checked Out with your live location.` });
                setShowCamera(false)
                setImgData("");
                // setIsCheckedIn(false)
                // setCheckInTime(null)
                // setPhotoTaken(false)
            },
            onError: () => {
                notificationModal.error({ heading: "failed Something went wrong!!!", body: JSON.stringify(err) });

                // setIsCheckedIn(false)
                // setCheckInTime(null)
                // setPhotoTaken(false)
            }
        })

    }

    const handleTakePhoto = (imgData, props = {}) => {
        console.log("hit empddd", imgData);
        if (imgData && props?.isCaptured) {
            setImgData(imgData);
            setPhotoTaken(true)
            setShowCamera(false)
        }
        setShowCamera(true)
        // Simulate camera capture
        // setTimeout(() => {
        //     setPhotoTaken(true)
        //     setShowCamera(false)
        // }, 2000)
    }

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


    return {
        isCheckedIn, setIsCheckedIn, checkInTime, setCheckInTime, currentLocation, setCurrentLocation,
        locationLoading, setLocationLoading, isFetching,
        showCamera, setShowCamera, photoTaken, setPhotoTaken, handleCheckIn, handleTakePhoto, handleCheckOut, todayCheckData,
        isCheckedOut, workDuration, checkInTimeLocalFormat, checkOutTimeLocalFormat, isOffline, dashboardStats
    }
}
