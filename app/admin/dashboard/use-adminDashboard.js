"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAdminDashboardStats } from "@/lib/api/dashboard-api";
import generateContext from "@/utils/generate-context";
// import moment from "moment";
import { Users, MapPin, TrendingUp, CheckCircle,} from "lucide-react"
import moment from "moment";
import { formatWorkingHours } from "@/utils/helper";

// import { getIntialValues } from "./form-helper";



export function useAdminDashboard() {

    const { data: dashboardStats, isFetching, isSuccess, refetch,  } = useQuery({
        queryKey: ['useAdminDashboard'],
        queryFn: getAdminDashboardStats
    })

    const stats = [
        {
            title: "Total Employees",
            value: dashboardStats?.data?.totalEmployees,
            change: "+2 this month",
            icon: Users,
            color: "text-blue-600 dark:text-blue-400",
        },
        {
            title: "Present Today",
            value: dashboardStats?.data?.presentToday,
            change: `${Math.round(dashboardStats?.data?.presentToday/dashboardStats?.data?.totalEmployees*100)}% attendance`,//"75% attendance",
            icon: CheckCircle,
            color: "text-green-600 dark:text-green-400",
        },
        {
            title: "Active Job Sites",
            value: dashboardStats?.data?.activeJobSites,

            change: "3 new this week",
            icon: MapPin,
            color: "text-purple-600 dark:text-purple-400",
        },
        {
            title: "Avg Performance",
            value: dashboardStats?.data?.averagePerformance,

            change: "+5% from last month",
            icon: TrendingUp,
            color: "text-orange-600 dark:text-orange-400",
        },
    ]

    const recentActivity = dashboardStats?.data?.recentActivity?.map((item)=>{
            const item_ = JSON.parse(JSON.stringify(item));
            item_.date= moment(item.createdAt).format("YYYY-MM-DD");
            const checkInTime = moment(item.checkInTime).format('h:mm A')//.format("YYYY-MM-DD, h:mm:ss a");
            const checkOutTime = moment(item.checkOutTime).format('h:mm A')//.utc().format("YYYY-MM-DD, h:mm:ss a");
            item_.workHours =formatWorkingHours(item.workHours);
            item_.overtimeHours= formatWorkingHours(item.overtimeHours);
            item_.fullName= item?.employee?.user?.fullName
            const action= item?.checkOutTime ? "Checked Out" : "Checked in" //item?.checkInTime ?
            const time = checkOutTime || checkInTime//.format("YYYY-MM-DD, h:mm:ss a");
            const status= item?.status;
            const location= `${item?.checkInLocation?.address || ""} - ${item?.checkInLocation?.latitude}, ${item?.checkInLocation?.longitude}`
        return {
            employee: item?.employee?.user?.fullName,
            time, action, status,location
        }
    }) ||[
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


    return {
        stats, recentActivity, upcomingSchedules, attendanceOverview: dashboardStats?.data?.last7DaysAttendanceOverview,
        isFetching
    }
}

export const [AdminDashboardPageProvider, useAdminDashboardPageContext] = generateContext(useAdminDashboard);
