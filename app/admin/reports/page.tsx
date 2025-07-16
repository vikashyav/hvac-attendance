"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Download, FileText, CalendarIcon, Users, Clock, MapPin, AlertCircle } from "lucide-react"
import { AttendanceChart } from "@/components/attendance-chart"
import { PerformanceChart } from "@/components/performance-chart"
import { format } from "date-fns"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [reportType, setReportType] = useState("attendance")
  const [selectedSite, setSelectedSite] = useState("all")

  const reportTemplates = [
    {
      id: 1,
      name: "Weekly Attendance Report",
      description: "Comprehensive attendance summary for the week",
      type: "attendance",
      frequency: "Weekly",
      lastGenerated: "2024-01-15",
      format: "PDF",
    },
    {
      id: 2,
      name: "Monthly Performance Report",
      description: "Employee performance metrics and analytics",
      type: "performance",
      frequency: "Monthly",
      lastGenerated: "2024-01-01",
      format: "Excel",
    },
    {
      id: 3,
      name: "Site-wise Activity Report",
      description: "Job site attendance and activity breakdown",
      type: "site",
      frequency: "Bi-weekly",
      lastGenerated: "2024-01-10",
      format: "PDF",
    },
    {
      id: 4,
      name: "Payroll Summary Report",
      description: "Hours worked and payroll calculations",
      type: "payroll",
      frequency: "Monthly",
      lastGenerated: "2024-01-01",
      format: "Excel",
    },
    {
      id: 5,
      name: "Compliance Report",
      description: "Safety and regulatory compliance tracking",
      type: "compliance",
      frequency: "Quarterly",
      lastGenerated: "2024-01-01",
      format: "PDF",
    },
  ]

  const quickStats = [
    { label: "Total Reports Generated", value: "156", change: "+12%", icon: FileText },
    { label: "Average Attendance", value: "93.6%", change: "+2.1%", icon: Users },
    { label: "On-time Rate", value: "88.2%", change: "-1.5%", icon: Clock },
    { label: "Active Job Sites", value: "8", change: "+1", icon: MapPin },
  ]

  const recentReports = [
    {
      id: 1,
      name: "Weekly Attendance - Week 3",
      type: "Attendance",
      generatedBy: "System",
      date: "2024-01-15",
      size: "2.3 MB",
      downloads: 12,
    },
    {
      id: 2,
      name: "Site Performance - Downtown",
      type: "Performance",
      generatedBy: "Mike Johnson",
      date: "2024-01-14",
      size: "1.8 MB",
      downloads: 8,
    },
    {
      id: 3,
      name: "Monthly Summary - December",
      type: "Summary",
      generatedBy: "System",
      date: "2024-01-01",
      size: "4.1 MB",
      downloads: 25,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
        <Badge variant="destructive" className="w-full whitespace-nowrap">
          Work Under Progress - we are working on this module
        </Badge>
      <div className="flex items-center justify-between">

        <div>
                
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and manage attendance and performance reports</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} from last period
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
                <CardDescription>Configure your report parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">Attendance Report</SelectItem>
                      <SelectItem value="performance">Performance Report</SelectItem>
                      <SelectItem value="site">Site Activity Report</SelectItem>
                      <SelectItem value="payroll">Payroll Report</SelectItem>
                      <SelectItem value="compliance">Compliance Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Site</label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sites</SelectItem>
                      <SelectItem value="downtown">Downtown Office Complex</SelectItem>
                      <SelectItem value="mall">Shopping Mall Project</SelectItem>
                      <SelectItem value="residential">Residential Complex</SelectItem>
                      <SelectItem value="industrial">Industrial Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from && dateRange.to
                          ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                          : "Select date range"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{ from: dateRange.from, to: dateRange.to }}
                        onSelect={(range) => range && setDateRange(range)}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>Preview of your selected report type</CardDescription>
              </CardHeader>
              <CardContent>
                {reportType === "attendance" && (
                  <div className="space-y-4">
                    <AttendanceChart />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Total Employees</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                      <div>
                        <p className="font-medium">Average Attendance</p>
                        <p className="text-2xl font-bold text-green-600">93.6%</p>
                      </div>
                    </div>
                  </div>
                )}
                {reportType === "performance" && (
                  <div className="space-y-4">
                    <PerformanceChart />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Top Performer</p>
                        <p className="text-lg font-bold">Sarah Johnson</p>
                      </div>
                      <div>
                        <p className="font-medium">Average Score</p>
                        <p className="text-2xl font-bold text-blue-600">88.5%</p>
                      </div>
                    </div>
                  </div>
                )}
                {reportType === "site" && (
                  <div className="space-y-4">
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Site activity visualization</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Active Sites</p>
                        <p className="text-xl font-bold">8</p>
                      </div>
                      <div>
                        <p className="font-medium">Total Check-ins</p>
                        <p className="text-xl font-bold">156</p>
                      </div>
                      <div>
                        <p className="font-medium">Site Compliance</p>
                        <p className="text-xl font-bold text-green-600">95%</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{template.format}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{template.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Frequency</p>
                      <p className="font-medium">{template.frequency}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Last Generated</p>
                    <p className="font-medium">{new Date(template.lastGenerated).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Weekly attendance patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Employee performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Field Operations</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Training</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "88%" }}></div>
                      </div>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Management</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: "96%" }}></div>
                      </div>
                      <span className="text-sm font-medium">96%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Downtown Office</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Mall Project</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Residential Complex</span>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Industrial Site</span>
                    <Badge variant="outline">Planning</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alerts & Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Late arrivals increased</p>
                      <p className="text-muted-foreground">3 employees this week</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Site compliance check</p>
                      <p className="text-muted-foreground">Due next week</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">All systems operational</p>
                      <p className="text-muted-foreground">No critical issues</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated reports and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Generated by {report.generatedBy}</span>
                          <span>{new Date(report.date).toLocaleDateString()}</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{report.type}</Badge>
                      <div className="text-sm text-muted-foreground">{report.downloads} downloads</div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
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
