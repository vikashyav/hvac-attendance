"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Clock, Award, CheckCircle, AlertCircle, Calendar, Users } from "lucide-react"
import { PerformanceChart } from "@/components/performance-chart"

export default function PerformancePage() {
  const performanceMetrics = {
    overall: 88.5,
    attendance: 95.2,
    punctuality: 87.3,
    productivity: 92.1,
    safety: 96.8,
    teamwork: 85.4,
  }

  const monthlyGoals = [
    {
      id: 1,
      title: "Maintain 95%+ Attendance",
      current: 95.2,
      target: 95,
      status: "achieved",
      description: "Keep consistent attendance throughout the month",
    },
    {
      id: 2,
      title: "Improve Punctuality to 90%",
      current: 87.3,
      target: 90,
      status: "in-progress",
      description: "Arrive on time for scheduled shifts",
    },
    {
      id: 3,
      title: "Complete Safety Training",
      current: 80,
      target: 100,
      status: "in-progress",
      description: "Finish all required safety certification modules",
    },
    {
      id: 4,
      title: "Zero Safety Incidents",
      current: 100,
      target: 100,
      status: "achieved",
      description: "Maintain perfect safety record",
    },
  ]

  const achievements = [
    {
      id: 1,
      title: "Perfect Attendance Week",
      description: "Maintained 100% attendance for the week",
      date: "2024-01-08",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      id: 2,
      title: "Safety Champion",
      description: "Completed advanced safety training",
      date: "2024-01-05",
      icon: Award,
      color: "text-blue-600",
    },
    {
      id: 3,
      title: "Team Player",
      description: "Helped train new team member",
      date: "2024-01-03",
      icon: Users,
      color: "text-purple-600",
    },
    {
      id: 4,
      title: "Efficiency Expert",
      description: "Completed tasks 15% faster than average",
      date: "2023-12-28",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const recentFeedback = [
    {
      id: 1,
      from: "Mike Johnson",
      role: "Supervisor",
      date: "2024-01-12",
      rating: 4.5,
      comment:
        "Excellent work on the downtown project. Your attention to detail and punctuality have improved significantly.",
      category: "Performance Review",
    },
    {
      id: 2,
      from: "Sarah Wilson",
      role: "Team Lead",
      date: "2024-01-08",
      rating: 4.8,
      comment: "Great teamwork during the mall project. You showed excellent problem-solving skills.",
      category: "Project Feedback",
    },
    {
      id: 3,
      from: "System",
      role: "Automated",
      date: "2024-01-05",
      rating: 5.0,
      comment: "Congratulations on completing your safety training with a perfect score!",
      category: "Training Completion",
    },
  ]

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "text-green-600"
      case "in-progress":
        return "text-blue-600"
      case "at-risk":
        return "text-orange-600"
      case "missed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getGoalStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return CheckCircle
      case "in-progress":
        return Clock
      case "at-risk":
        return AlertCircle
      case "missed":
        return AlertCircle
      default:
        return Clock
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Performance Dashboard</h1>
        <p className="text-muted-foreground">Track your performance metrics and achievements</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{performanceMetrics.overall}%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
            <Progress value={performanceMetrics.overall} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{performanceMetrics.attendance}%</div>
            <p className="text-xs text-muted-foreground">Excellent attendance</p>
            <Progress value={performanceMetrics.attendance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{performanceMetrics.safety}%</div>
            <p className="text-xs text-muted-foreground">Outstanding safety record</p>
            <Progress value={performanceMetrics.safety} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Tabs */}
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Metrics</CardTitle>
                <CardDescription>Breakdown of your performance areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Attendance</span>
                    <span className="text-sm text-green-600">{performanceMetrics.attendance}%</span>
                  </div>
                  <Progress value={performanceMetrics.attendance} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Punctuality</span>
                    <span className="text-sm text-blue-600">{performanceMetrics.punctuality}%</span>
                  </div>
                  <Progress value={performanceMetrics.punctuality} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Productivity</span>
                    <span className="text-sm text-purple-600">{performanceMetrics.productivity}%</span>
                  </div>
                  <Progress value={performanceMetrics.productivity} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Safety</span>
                    <span className="text-sm text-orange-600">{performanceMetrics.safety}%</span>
                  </div>
                  <Progress value={performanceMetrics.safety} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Teamwork</span>
                    <span className="text-sm text-pink-600">{performanceMetrics.teamwork}%</span>
                  </div>
                  <Progress value={performanceMetrics.teamwork} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Goals</CardTitle>
              <CardDescription>Track your progress towards monthly performance targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyGoals.map((goal) => {
                  const StatusIcon = getGoalStatusIcon(goal.status)
                  const progress = Math.min((goal.current / goal.target) * 100, 100)

                  return (
                    <div key={goal.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{goal.title}</h4>
                            <StatusIcon className={`h-4 w-4 ${getGoalStatusColor(goal.status)}`} />
                          </div>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                        <Badge variant={goal.status === "achieved" ? "default" : "secondary"}>
                          {goal.status === "achieved" ? "Achieved" : "In Progress"}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {goal.current}
                            {goal.title.includes("%") ? "%" : ""} / {goal.target}
                            {goal.title.includes("%") ? "%" : ""}
                          </span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your accomplishments and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon
                  return (
                    <div key={achievement.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-full bg-muted ${achievement.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Earned on {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>Performance reviews and comments from supervisors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{feedback.from}</h4>
                          <Badge variant="outline">{feedback.role}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.floor(feedback.rating)
                                  ? "bg-yellow-400"
                                  : i < feedback.rating
                                    ? "bg-yellow-200"
                                    : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(feedback.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
