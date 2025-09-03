"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import {  Users, LogOut, Shield } from "lucide-react"
import useMenuItems from "@/hooks/use-menu";
// const navigation = [
//   {
//     name: "Dashboard",
//     href: "/admin/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "Employees",
//     href: "/admin/employees",
//     icon: Users,
//   },
//   {
//     name: "Job Sites",
//     href: "/admin/sites",
//     icon: MapPin,
//   },
//   {
//     name: "Reports",
//     href: "/admin/reports",
//     icon: FileText,
//   },
//   {
//     name: "Calendar",
//     href: "/admin/calendar",
//     icon: Calendar,
//   },
//   {
//     name: "Settings",
//     href: "/admin/settings",
//     icon: Settings,
//   },
// ]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className, onLogout }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const navigation= useMenuItems()

  const handleLogout = () => {
    // router.push("/login")
    onLogout();
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg ">
            {/* <Shield className="h-5 w-5" /> bg-primary text-primary-foreground*/}
            {/* <img src="/c-logo.png" /> */}

          {/* </div> */} 
          <div className="flex flex-col">
            <span className="text-lg text-[#00728c] font-semibold">
              {/* Thermopharm */}
            <img src="/c-logo.jpeg" />
              </span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
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
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">Administrator</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
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
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0", className)}>
        <div className="flex flex-col flex-grow bg-card border-r">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
          <SidebarContent />

      {/* <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-40 h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
        </SheetContent>
      </Sheet> */}
    </>
  )
}
