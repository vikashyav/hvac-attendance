"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { useUserFromStorage } from "@/hooks/user.context"
import storageService from "@/lib/services/storage.service";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, removeUser, handleLogout } = useUserFromStorage();

  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const role = user.role; //localStorage.getItem("userRole")
    const email = user.email;//localStorage.getItem("userEmail")
    const isAuthenticated = user //localStorage.getItem("isAuthenticated")

    // if (!isAuthenticated || role !== "admin") {
    //   router.push("/login")
    //   return
    // }

    setUserEmail(email || "admin@hvacpro.com")
    setIsLoading(false)
  }, [router])

  

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <img className="h-10" src="/c-logo.jpeg" /> <br />
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600">
          
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden sm:block sm:w-64 sm:fixed sm:inset-y-0">
        <AdminSidebar onLogout={handleLogout} userEmail={userEmail} />
      </div>

      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col sm:hidden">
        {/* Mobile Header */} 
        <div className="sticky  top-0 z-[500] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <MobileSidebar>
            <AdminSidebar onLogout={handleLogout} userEmail={userEmail} />
          </MobileSidebar>
          <h1 className="text-lg font-semibold text-[#00728c]">
            <img className="h-10" src="/c-logo.jpeg" />
            {/* Thermopharm */}
            </h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>

      {/* Desktop Main Content */}
      <main className="hidden sm:block sm:pl-72 p-4 sm:p-6">{children}</main>

    </div>
  )
}
