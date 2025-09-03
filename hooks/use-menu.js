import constants from "@/constants";
import { useUserFromStorage } from "./user.context"
import {
    LayoutDashboard, Clock, Calendar, BarChart3, User, LogOut, Menu, Shield,
    Users, MapPin, FileText, Settings,

} from "lucide-react"
// import {  LogOut, Menu, Shield } from "lucide-react"

export default function useMenuItems() {
    const { user, getCookies } = useUserFromStorage();
    const menuItems = [
        {
            name: "Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
            access: ["admin"]

        },
        {
            name: "Employees",
            href: "/admin/employees",
            icon: Users,
            access: ["admin"]
        },
        {
            name: "Dashboard",
            href: "/employee/dashboard",
            icon: LayoutDashboard,
            access: ["employee"]
        },
        {
            name: "Attendance",
            href: "/employee/attendance",
            icon: Clock,
            access: ["employee", "admin"]

        },
        // {
        //     name: "Schedule",
        //     href: "/employee/schedule",
        //     icon: Calendar,
        //     access: ["employee", "admin"]
        // },
        // {
        //   name: "Performance",
        //   href: "/employee/performance",
        //   icon: BarChart3,
        // },
        {
            name: "Leave-request",
            href: "/employee/leave-request",
            icon: Calendar,
            access: ["employee", "admin"]
        },
        {
            name: "Profile",
            href: "/employee/profile",
            icon: User,
            access: ["employee"],
        },
        {
            name: "Projects /(Sites)",
            href: "/admin/projects-sites",
            icon: MapPin,
            access: ["admin"]
        },
        {
            name: "Reports",
            href: "/admin/reports",
            icon: FileText,
            access: ["admin", "Project manager"]
        },
        // {
        //     name: "Calendar",
        //     href: "/admin/calendar",
        //     icon: Calendar,
        //     access: ["admin"]
        // },
        // {
        //     name: "Settings",
        //     href: "/admin/settings",
        //     icon: Settings,
        //     access: ["admin"]
        // },
    ].filter((item) => item.access.includes(user.role) || item.access.includes(user?.employee?.position))

    return menuItems
}