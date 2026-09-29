"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { User, LogOut, Shield } from "lucide-react"
import useMenuItems from "@/hooks/use-menu"

interface EmployeeSidebarProps {
  onLogout: () => void
  userInfo: { firstName?: string; lastName?: string; role?: string } | string
  className?: string
}

export function EmployeeSidebar({ onLogout, userInfo, className }: EmployeeSidebarProps) {
  const pathname = usePathname()
  const navigation= useMenuItems()
  const person = typeof userInfo === "string" ? {} : userInfo

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg "> */}
            {/* <Shield className="h-5 w-5" /> */}
            {/* <img src="/c-logo.png" /> */}
          {/* </div> */}
          <div className="flex flex-col">
            <span className="text-lg text-[#00728c] font-semibold">
            <img src="/c-logo.jpeg" />
            </span>
            <span className="text-xs text-muted-foreground">Employee Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
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
              <span className="text-sm font-medium"> {`${person.firstName || ""} ${person.lastName || ""}`}</span>
              <span className="text-xs text-muted-foreground">{person.role}</span>
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

  return <div className={cn("h-full bg-card", className)}><SidebarContent /></div>
}
