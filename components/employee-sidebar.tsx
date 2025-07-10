"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { LayoutDashboard, Clock, Calendar, BarChart3, User, LogOut, Menu, Shield } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Attendance",
    href: "/employee/attendance",
    icon: Clock,
  },
  {
    name: "Schedule",
    href: "/employee/schedule",
    icon: Calendar,
  },
  {
    name: "Performance",
    href: "/employee/performance",
    icon: BarChart3,
  },
  {
    name: "Profile",
    href: "/employee/profile",
    icon: User,
  },
]

interface EmployeeSidebarProps {
  onLogout: () => void
  userInfo: Object
  className?: string
}

export function EmployeeSidebar({ onLogout, userInfo, className }: EmployeeSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">HVAC Solution</span>
            <span className="text-xs text-muted-foreground">Employee Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium"> {`${userInfo.firstName} ${userInfo.lastName}`}</span>
              <span className="text-xs text-muted-foreground">{userInfo.role}</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <div className={cn("hidden sm:flex sm:w-64 sm:flex-col sm:fixed sm:inset-y-0", className)}>
        <div className="flex flex-col flex-grow bg-card border-r">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
          <SidebarContent />

      {/* <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="sm:hidden h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
        </SheetContent>
      </Sheet>1 */}
    </>
  )
}
