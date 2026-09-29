"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useQuery } from "@tanstack/react-query"
import { getAttendance } from "@/lib/api/attendance-api";
import generateContext from "@/utils/generate-context";
import moment from "moment";
import { formatWorkingHours } from "@/utils/helper";
import { useUserFromStorage } from "@/hooks/user.context";
import { useSearchParams } from 'next/navigation'
import { useCapabilities } from "@/hooks/use-capabilities";

export function useAttendances(props) {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const { user } = useUserFromStorage();
  const capabilities = useCapabilities();
  const notificationModal = useNotificationModalContext();

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [calendarSelectedData, setCalendarSelectedData] = useState({});
  const todayDate = moment();

  const [dateRange, setDateRange] = useState({
    from: moment(searchParams?.get("from") || todayDate).startOf('month').toDate(),
    to: moment(searchParams?.get("to") || todayDate).endOf('day').toDate(),
  })

  const [queryParams, setQueryParams] = useState({})

  useEffect(() => {
    if (searchParams) {
      const params = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      setQueryParams(params);
    }
  }, [searchParams]);

  const queryKey = [
    'attendance',
    user?.id,
    user?.companyId,
    {
      employee_id: queryParams?.employee_id || props?.searchParams?.employee_id,
      from: searchParams?.get("from") || moment(dateRange.from).format("YYYY-MM-DD"),
      to: searchParams?.get("to") || moment(dateRange.to).format("YYYY-MM-DD")
    }
  ];

  const { data: attendanceData, isSuccess, refetch, isFetching, isLoading, isError } = useQuery({
    queryKey,
    queryFn: getAttendance,
    enabled: !!user,
  });

  useEffect(() => {
    if (isSuccess && attendanceData?.data?.data) {
      const attendanceHistory_ = attendanceData.data.data.map((item) => {
        const item_ = JSON.parse(JSON.stringify(item));
        item_.date = moment(item.createdAt || item.attendanceDate).format("YYYY-MM-DD");
        item_.checkInTime = moment(item.checkInTime).isValid() ? moment(item.checkInTime).format('h:mm A') : "-";
        item_.checkOutTime = moment(item.checkOutTime).isValid() ? moment(item.checkOutTime).format('h:mm A') : "-";
        item_.workHours = formatWorkingHours(item.workHours);
        item_.overtimeHours = formatWorkingHours(item.overtimeHours);
        item_.fullName = item?.employee?.user?.fullName || item?.fullName || (user?.fullName);
        return item_;
      });
      setAttendanceHistory(attendanceHistory_);
      const date = moment().format("YYYY-MM-DD");
      const selectedData = attendanceHistory_.find(row => row.date.includes(date));
      setCalendarSelectedData(selectedData || {});
    }
  }, [isSuccess, attendanceData, user]);

  const rawRecords = attendanceData?.data?.data || [];
  const checkInRecords = rawRecords.filter(r => r.checkInTime && moment(r.checkInTime).isValid());
  let averageCheckInTime = "--";
  if (checkInRecords.length > 0) {
    const totalMinutes = checkInRecords.reduce((acc, r) => {
      const m = moment(r.checkInTime);
      return acc + (m.hours() * 60 + m.minutes());
    }, 0) / checkInRecords.length;
    const avgH = Math.floor(totalMinutes / 60);
    const avgM = Math.floor(totalMinutes % 60);
    averageCheckInTime = moment().hours(avgH).minutes(avgM).format("h:mm A");
  }

  const totalWorkingDays = attendanceData?.data?.totalWorkingDays ?? 0;
  const daysPresent = attendanceData?.data?.daysPresent ?? 0;
  const daysAbsent = Math.max(0, totalWorkingDays - daysPresent);

  const monthlyStats = {
    totalHours: formatWorkingHours(attendanceData?.data?.totalHours) || "0h 0m",
    attendanceRate: attendanceData?.data?.attendanceRate || "0",
    averagecheckInTime: averageCheckInTime,
    daysPresent,
    daysAbsent,
    totalOvertimeHours: formatWorkingHours(attendanceData?.data?.totalOvertimeHours) || "0m",
    punctualityScore: attendanceData?.data?.punctualityRate || "0",
  };

  const monthlyTrends = attendanceData?.data?.monthlyTrends || [];

  const handleCalenderSelectDate = (selectedDate) => {
    setSelectedDate(selectedDate);
    const date = moment(selectedDate).format("YYYY-MM-DD");
    const selectedData = attendanceHistory.find(row => row.date.includes(date));
    setCalendarSelectedData(selectedData || {});
  };

  return {
    selectedDate, setSelectedDate,
    attendanceHistory,
    monthlyStats,
    monthlyTrends,
    handleCalenderSelectDate,
    calendarSelectedData,
    user, dateRange, setDateRange,
    attendanceData: attendanceData?.data,
    isFetching, isLoading, isError, refetch,
    queryParmas: queryParams,
    capabilitiesLoading: capabilities.isLoading,
    capabilitiesError: capabilities.isError,
    capabilitiesRefetch: capabilities.refetch,
  };
}

export const [AttendancesPageProvider, useAttendancesPageContext] = generateContext(useAttendances);
