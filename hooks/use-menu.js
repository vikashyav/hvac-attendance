import { useCapabilities } from './use-capabilities';
import { useUserFromStorage } from "./user.context"
import {
    LayoutDashboard, Clock, Calendar, BarChart3, User, LogOut, Menu, Shield,
    Users, MapPin, FileText, Settings,

} from "lucide-react"
// import {  LogOut, Menu, Shield } from "lucide-react"

export default function useMenuItems() {
    const { user } = useUserFromStorage();
    const capabilities = useCapabilities();
    const permissions = capabilities.isSuccess ? capabilities.data?.data?.data?.permissions || [] : [];
    const menuItems = [
        { name: 'Roles & permissions', href: '/admin/roles', icon: Shield, permission: 'access.view', access: [] },
        { name: "Companies & Admins", href: "/admin/companies", icon: Shield, access: ["superAdmin"] },
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
            additionalPermission: ["employee.view", "employee.manage"],
            access: ["admin"]
        },
        {
            name: "Dashboard",
            href: "/employee/dashboard",
            icon: LayoutDashboard,
            access: ["employee"]
        },
        {
            name: "Task Manage",
            href: "/admin/task-manage",
            icon: Calendar,
            access: ["admin", "employee"]
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
            name: "Projects /(Sites)",
            href: "/admin/projects-sites",
            additionalPermission: "project.manage",
            icon: MapPin,
            access: ["admin", "Project manager"]
        },
        {
            name: "Reports",
            href: "/admin/reports",
            additionalPermission: "report.view",
            icon: FileText,
            access: ["admin", "Project manager"]
        },
        {
            name: "Settings",
            href: "/admin/settings",
            permission: "settings.view",
            icon: Settings,
            access: ["admin"]
        },
            {
            name: "Profile",
            href: "/employee/profile",
            icon: User,
            access: ["employee"],
        },
    ];

    const hasAdditionalPermission = (item) => {
        if (!item.additionalPermission) return false;
        if (Array.isArray(item.additionalPermission)) {
            return item.additionalPermission.some(p => permissions.includes(p));
        }
        return permissions.includes(item.additionalPermission);
    };

    return menuItems.filter((item) =>
        item.permission
            ? permissions.includes(item.permission)
            : hasAdditionalPermission(item)
              || (user?.role === "superAdmin" && item.access?.includes("admin"))
              || item.access?.includes(user?.role)
              || item.access?.includes(user?.employee?.position)
    );
}