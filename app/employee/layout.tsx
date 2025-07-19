"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { useUserFromStorage } from "@/hooks/user.context"
import storageService from "@/lib/services/storage.service";
import { clearTokenDataFromStorage, getTokenDataFromStorage } from "../../hooks/token.context";
import constants from "@/constants"

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const { user, removeUser, handleLogout } = useUserFromStorage();
  
  const router = useRouter()
  const [userInfo, setuserInfo] = useState("")
  const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
    const role = user.role; //localStorage.getItem("userRole")
    const email = user;//localStorage.getItem("userInfo")
    // const isAuthenticated = user //localStorage.getItem("isAuthenticated")
      const accessToken = getTokenDataFromStorage(constants.TOKEN_TYPE.ACCESS);

    if (!accessToken) {
      router.push("/login")
      return
    }
    console.log(user);
    
    setuserInfo(user || "admin@hvacpro.com")
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop & Tablet Sidebar - Hidden only on mobile */}
      <div className="hidden sm:block sm:w-64 sm:fixed sm:inset-y-0">
        <EmployeeSidebar onLogout={handleLogout} userInfo={userInfo} />
      </div>

      {/* Mobile Layout - Show only on mobile */}
      <div className="flex-1 flex flex-col sm:hidden">
        {/* Mobile Header */}
        <div className="bg-background border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
          <MobileSidebar>
            <EmployeeSidebar onLogout={handleLogout} userInfo={userInfo} />
          </MobileSidebar>
          {/* <h1 className="text-lg font-semibold">HVAC Pro</h1> */}
          <h1 className="text-lg font-semibold text-[#00728c]">Thermopharm</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>

      {/* Desktop & Tablet Main Content - Offset by sidebar width */}
      <main className="hidden sm:block sm:pl-72 p-4 sm:p-6">{children}</main>
    </div>
  )
}
