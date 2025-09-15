"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, User, Users, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import * as auth from "@/lib/api/auth";
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import constants from "@/constants"
import { setTokenDataToStorage } from "@/hooks/token.context"
import { useUserFromStorage } from "@/hooks/user.context";
import { useNotificationSubscrption } from "@/hooks/notification-sub-hook"


export default function LoginPage() {
  const { subscribeForPush, resetAndSubscribe } = useNotificationSubscrption();
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    employeeId: "",
  })
  const notificationModal = useNotificationModalContext();
  const { setUser, user, setCookies } = useUserFromStorage();


  const mutation = useMutation({
    mutationFn: auth.userLogin,
    onSuccess: async (res) => {
      console.log(res)
      if (res) {
        const userInfo = res?.data?.userInfo;
        setTokenDataToStorage(constants.TOKEN_TYPE.ACCESS, res?.data?.token);
        const maxAge = 30 * 24 * 60 * 60; //30 days Convert days to seconds
        // document.cookie = `${constants.TOKEN_TYPE.ACCESS}=${res?.data?.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        setCookies(constants.CONTEXT_TYPE.TOKEN, { [constants.TOKEN_TYPE.ACCESS]: res?.data?.token });
        // document.cookie = `userInfo=${JSON.stringify(res?.data?.userInfo)}; path=/; max-age=${maxAge}; SameSite=Lax`;
        setCookies(constants.CONTEXT_TYPE.USER_INFO, res?.data?.userInfo);
        setUser(res?.data?.userInfo);
        notificationModal.success({ heading: "Sign successfully, Subscribing for pushnotification Please await" });
        await subscribeForPush(res?.data?.userInfo?.email || "").catch((err) => {
          console.log(err)
          alert(err)
        window.location.reload(); // to trigger middleware check
        })
        // Redirect to admin dashboard
        // if (userInfo?.role === "admin") {
        //   router.push("/admin/dashboard")
        // } else {
        //   router.push("/employee/dashboard")
        // }
      } else {
        setIsLoading(false)
      }
      // alert('Post created!')
    },
    onError: (err) => {
      // alert('Something went wrong')
      notificationModal.error({ heading: "failed Something went wrong!!!", body: JSON.stringify(err) });
      setIsLoading(false)
    },
  })
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError("")
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    notificationModal.progress({
      heading: "Sign in Please await!!",
    });
    mutation.mutate({ username: formData.email, password: formData.password, })

  }

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

  }

  // useEffect(() => {
  //   if (user.role === "admin") {
  //     // return 
  //     return router.push("/admin/dashboard")
  //     // return <AdminDashboardPage />
  //   }
  //   if (user.role === "employee") {
  //     return router.push("/employee/dashboard")

  //     // return <EmployeeDashboard />
  //   }
  // }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg ">
                {/* <Shield className="h-5 w-5" />  bg-primary text-primary-foreground*/}
                <img src="/c-logo.png" />

              </div>
              <span className="text-xl h-22 w-44 text-[#00728c] font-bold">
                {/* Thermopharm */}
                <img src="/c-logo.jpeg" />

                </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your Thermopharm account</p>
          </div>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center"></CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="admin" className="w-full">
                {/* <TabsList className="grid w-full grid-cols-1 mb-6"> */}
                {/* <TabsTrigger value="admin" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline"></span>
                  </TabsTrigger> */}
                {/* <TabsTrigger value="employee" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Employee</span>
                  </TabsTrigger> */}
                {/* </TabsList> */}

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="admin" className="space-y-4">
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        name="email"
                        type="email"
                        placeholder="Enter username"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                  <div className="hidden text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <strong>Demo Credentials:</strong>
                    <br />
                    Email: admin@hvacpro.com
                    <br />
                    Password: password
                  </div>
                </TabsContent>

                <TabsContent value="employee" className="space-y-4">
                  <form onSubmit={handleEmployeeLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee-id">Employee ID</Label>
                      <Input
                        id="employee-id"
                        name="employeeId"
                        type="text"
                        placeholder="EMP001"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employee-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="employee-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In as Employee"}
                    </Button>
                  </form>
                  <div className="hidden text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <strong>Demo Credentials:</strong>
                    <br />
                    Employee ID: EMP001
                    <br />
                    Password: employee123
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">Need help? Contact your system administrator</div>
        </div>
      </div>
    </div>
  )
}
