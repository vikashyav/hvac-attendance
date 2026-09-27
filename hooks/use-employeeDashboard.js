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




import { getAttendancePolicy } from "@/lib/api/settings-api";

export function useEmployeesDashboard() {
    const { data: policyResponse, isError: policyError } = useQuery({ queryKey: ['attendance-policy'], queryFn: getAttendancePolicy, staleTime: 0 });
    const policy = policyResponse?.data?.data;
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
        } else if (isFetchedTodayCheckIn) {
            setCheckInTime(null);
            setIsCheckedIn(false);
        }
    }, [isFetchedTodayCheckIn, todayCheckData])

    useEffect(() => {
        const online = () => setOffline(false);
        const offline = () => setOffline(true);
        setOffline(!navigator.onLine);
        window.addEventListener('online', online);
        window.addEventListener('offline', offline);
        return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
    }, []);

    useEffect(() => {
        if (!policy) return;
        if (!policy.locationEnabled) { setLocationLoading(false); setCurrentLocation(null); return; }
        let cancelled = false;
        setLocationLoading(true);
        if (!navigator.geolocation) {
            setCurrentLocation({ error: 'Geolocation is not supported' });
            setLocationLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            const location = { lat: coords.latitude, lng: coords.longitude, error: null };
            if (cancelled) return;
            setCurrentLocation(location);
            setLocationLoading(false);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
                const data = await response.json();
                if (!cancelled) setCurrentLocation({ ...location, address: data.display_name });
            } catch { /* Coordinates remain usable when address lookup is unavailable. */ }
        }, error => {
            if (!cancelled) { setCurrentLocation({ error: error.message }); setLocationLoading(false); }
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
        return () => { cancelled = true; };
    }, [policy?.locationEnabled]);

    const handleCheckIn = () => {
        if (!policy || (policy.locationEnabled && (!Number.isFinite(currentLocation?.lat) || !Number.isFinite(currentLocation?.lng))) || (policy.requirePhoto && !imgData)) {
            toast({
                title: !policy ? "Attendance settings are unavailable" : "Attendance requirements are not met",
                description: !policy ? "Please reload and try again." : "Provide the photo and location required by your company settings.",
                variant: "destructive",
                duration: 2000
            })
            return;
        }
        notificationModal.progress({
            heading: `Checking with your current location, Please await!!`,
        });
        const checkInPayload = {
            checkInLocation: policy.locationEnabled ? {
                latitude: currentLocation?.lat,
                longitude: currentLocation?.lng,
                address: currentLocation?.address
            } : null,
            checkInTime: new Date(),
            photoData: imgData
        }
        saveCheckInByEmp.mutate(checkInPayload, {
            onSuccess: (res) => {
                // console.log(res?.data?.checkInTime);

                setIsCheckedIn(true)
                notificationModal.success({ heading: "Success", body: `Check-in recorded.` });
                setImgData("");
                setPhotoTaken(false);
                setShowCamera(false)
                setCheckInTime(res?.data?.checkInTime);
                refetch();
                refetchdashboardStats();

            },
            onError: (err) => {
                setIsCheckedIn(false)
                notificationModal.error({ heading: "failed Something went wrong!!!", body: err?.response?.data?.error || err.message });

            }
        })

    }

    const handleCheckOut = () => {
        if (!policy || (policy.locationEnabled && (!Number.isFinite(currentLocation?.lat) || !Number.isFinite(currentLocation?.lng))) || (policy.requirePhoto && !imgData)) {
            toast({
                title: !policy ? "Attendance settings are unavailable" : "Attendance requirements are not met",
                description: !policy ? "Please reload and try again." : "Provide the photo and location required by your company settings.",
                variant: "destructive",
                duration: 2000
            })
            return;
        }
        notificationModal.progress({
            heading: `Checking Out with your current location, Please await!!`,
        });
        const checkOutPayload = {
            checkOutLocation: policy.locationEnabled ? {
                latitude: currentLocation?.lat,
                longitude: currentLocation?.lng,
                address: currentLocation?.address
            } : null,
            checkOutTime: new Date(),
            checkInTime: todayCheckData?.data?.checkInTime,
            check_in_id: todayCheckData?.data?.id,
            photoData: imgData
        };
        updateCheckOutByEmp.mutate(checkOutPayload, {
            onSuccess: (res) => {
                refetch();
                refetchdashboardStats();
                notificationModal.success({ heading: "Success", body: `Check-out recorded.` });
                setShowCamera(false)
                setPhotoTaken(false);
                setImgData("");
                // setIsCheckedIn(false)
                // setCheckInTime(null)
                // setPhotoTaken(false)
            },
            onError: (err) => {
                notificationModal.error({ heading: "failed Something went wrong!!!", body: err?.response?.data?.error || err.message });

                // setIsCheckedIn(false)
                // setCheckInTime(null)
                // setPhotoTaken(false)
            }
        })

    }

    const handleTakePhoto = (imgData, props = {}) => {
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
        locationLoading, setLocationLoading, isFetching, attendancePolicy: policy, policyError,
        showCamera, setShowCamera, photoTaken, setPhotoTaken, handleCheckIn, handleTakePhoto, handleCheckOut, todayCheckData,
        isCheckedOut, workDuration, checkInTimeLocalFormat, checkOutTimeLocalFormat, isOffline, dashboardStats
    }
}
