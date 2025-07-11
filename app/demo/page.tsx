"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, Users, MapPin, Clock, BarChart3, Smartphone, CheckCircle, Star, ArrowRight } from "lucide-react"
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useModal } from "@/components/comfirmation-modal"
// import { useNotification } from "@/components/notification";
export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const notificationModal = useNotificationModalContext(); 
  // const { showNotification } = useNotification();
const { showModal } = useModal();
  const handleGetStarted = async () => {
    // setIsLoading(true)
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    // router.push("/login")
    //  showModal({
    //   title: "Delete Item",
    //   message: "Are you sure you want to delete this item?",
    //   onConfirm: () => {
    //     console.log("Item deleted!");
    //     // your logic here
    //   },
    // });
     showNotification("This is a test message!", "info")
          notificationModal.error({ heading: "Please fill in all required fields." });

  }

  const features = [
    {
      icon: Clock,
      title: "Real-time Attendance",
      description: "GPS-verified check-in/out with photo verification",
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Ensure employees are at the right job sites",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Comprehensive performance tracking and reporting",
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Manage employees, schedules, and assignments",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Works perfectly on all devices and screen sizes",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and data protection",
    },
  ]

  const stats = [
    { label: "Active Companies", value: "500+", icon: Users },
    { label: "Employees Tracked", value: "10,000+", icon: Clock },
    { label: "Hours Logged", value: "1M+", icon: BarChart3 },
    { label: "Accuracy Rate", value: "99.9%", icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">HVAC Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button onClick={handleGetStarted} disabled={isLoading} className="hidden sm:inline-flex">
                {isLoading ? "Loading..." : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Star className="mr-1 h-3 w-3" />
              Trusted by 500+ HVAC Companies
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Modern Employee
              <span className="block text-primary">Attendance System</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Streamline your HVAC business with GPS-verified attendance tracking, performance analytics, and
              comprehensive employee management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} disabled={isLoading} className="text-lg px-8 py-3">
                {isLoading ? "Loading..." : "Start Free Trial"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 bg-transparent"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Manage Your Team
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Comprehensive tools designed specifically for HVAC companies to track, manage, and optimize their
              workforce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-primary/5 dark:bg-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto text-center border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join hundreds of HVAC companies already using HVAC Pro to streamline their operations and boost
                productivity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleGetStarted} disabled={isLoading} className="text-lg px-8 py-3">
                  {isLoading ? "Loading..." : "Start Your Free Trial"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-semibold">HVAC Pro</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-right">
              © 2024 HVAC Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
