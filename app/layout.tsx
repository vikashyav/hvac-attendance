import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { NotificationModalProvider } from "@/components/notification-modal/provider"
import NotificationModal from "@/components/notification-modal"
import { ModalProvider } from "@/components/comfirmation-modal";
import { AxiosInterceptorProvider } from "@/lib/api"
import QueryProvider from "./QueryProvider"
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProvider from "@/hooks/user.context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Thermopharm - Employee Attendance System",
  description: "Modern employee attendance and performance tracking system for HVAC companies",
  generator: 'v0.dev',
  manifest: "/manifest.json",
  icons: {
    icon: "/c-logo.png",
    apple: "/c-logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const queryClient = new QueryClient();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NotificationModalProvider>
            <AxiosInterceptorProvider>
              <ModalProvider>
                <Toaster />
                <NotificationModal />
                <QueryProvider >
                  <UserProvider>
                    {children}
                  </UserProvider>
                </QueryProvider>
              </ModalProvider>
            </AxiosInterceptorProvider>
          </NotificationModalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
