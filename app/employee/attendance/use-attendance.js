"use client"

import { useState, useCallback, useEffect } from "react"
import fakeData from "@/constants/fake-data";
import { useToast } from "@/hooks/use-toast"
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAttendance } from "@/lib/api/attendance-api";
import generateContext from "@/utils/generate-context";
import moment from "moment";
import { formatWorkingHours } from "@/utils/helper";

// import { getIntialValues } from "./form-helper";



export function useAttendances() {
  const { toast } = useToast()
  const notificationModal = useNotificationModalContext();
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [attendanceHistory, setAttendanceHistory]= useState(fakeData.attendance.history);
  const [calendarSelectedData, setCalendarSelectedData]= useState({});
  const { data: attendanceData, isSuccess, refetch, isFetching } = useQuery({
          // queryKey: { startOfDay, endOfDay }, // Include params in queryKey
          queryFn: getAttendance,
          onSuccess: (res) => {
            console.log(res);
          },
      })
useEffect(()=>{
  if (isSuccess) {
  const attendanceHistory_ = attendanceData?.data?.data?.map((item)=> {
    const item_ = JSON.parse(JSON.stringify(item));
    item_.date= moment(item.createdAt).format("YYYY-MM-DD");
    item_.checkInTime = moment(item.checkInTime).format('h:mm A')//.format("YYYY-MM-DD, h:mm:ss a");
    item_.checkOutTime = moment(item.checkOutTime).format('h:mm A')//.utc().format("YYYY-MM-DD, h:mm:ss a");
    item_.workHours =formatWorkingHours(item.workHours);
    item_.overtimeHours= formatWorkingHours(item.overtimeHours);
    return item_
  });
  setAttendanceHistory(attendanceHistory_);    
  const date = moment().format("YYYY-MM-DD");
    const selectedData= attendanceHistory_.find(row => {
      return row.date.includes(date);
    });
    setCalendarSelectedData(selectedData);
  }
},[isSuccess])

  const monthlyStats = {
    totalHours: formatWorkingHours(attendanceData?.data?.totalHours) || "44h 15m",
    attendanceRate: attendanceData?.data?.attendanceRate || "80",
    averagecheckInTime: "8:14 AM",
    daysPresent: 4,
    daysAbsent: 1,
    totalOvertimeHours: formatWorkingHours(attendanceData?.data?.totalOvertimeHours) || "25m",
    punctualityScore: attendanceData?.data?.punctualityRate,
  }

  const monthlyTrends = attendanceData?.data?.monthlyTrends || [
    { week: "Week 1", totalHours: 42, attendanceRate: 100 },
    { week: "Week 2", totalHours: 44, attendanceRate: 80 },
    { week: "Week 3", totalHours: 40, attendanceRate: 100 },
    { week: "Week 4", totalHours: 45, attendanceRate: 100 },
  ]

  const handleCalenderSelectDate=(selectedDate)=>{
    setSelectedDate(selectedDate);
    const date = moment(selectedDate).format("YYYY-MM-DD");
    const selectedData= attendanceHistory.find(row => {
      return row.date.includes(date);
    });
    setCalendarSelectedData(selectedData);
  }

  return {
    selectedDate, setSelectedDate,
    attendanceHistory,
    monthlyStats,
    monthlyTrends,
    handleCalenderSelectDate,
    calendarSelectedData
  }
}

export const [AttendancesPageProvider, useAttendancesPageContext] = generateContext(useAttendances);
