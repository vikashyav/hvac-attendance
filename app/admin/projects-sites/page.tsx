"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Users, Calendar, Plus, Edit, Trash2, Navigation, Phone, AlertCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProjectsSitesPageProvider, useProjectsSitesPageContext } from "./use-projects-sites";
import withHOC from "@/utils/with-hoc"
import ProjectsSitesForm from "./add-form";
import {SiteCardSkeleton} from "./card-sekeleton";
// export default 
function JobSitesPage() {
  const {
    view, setView,
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    selectedDepartment, setSelectedDepartment,
    isAddDrawerOpen, setIsAddDrawerOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    selectedProjectsSites, setSelectedProjectsSites,
    projectsSites, setProjectsSites,
    departments, positions, locations, filteredProjectsSites, handleAddProjectsSites, handleEditProjectsSites, handleDeleteProjectsSites,
    handleToggleStatus, handleViewDetails, openEditDialog, projectsSitesData, isFetching
    // handleAttendanceReport
  } = useProjectsSitesPageContext();

  const jobSites = [
    {
      id: 1,
      name: "Downtown Office Complex",
      address: "123 Business Ave, Downtown, NY 10001",
      client: "Metro Properties LLC",
      status: "Active",
      priority: "High",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      projectsSites: 8,
      supervisor: "Mike Johnson",
      phone: "(555) 123-4567",
      description: "Complete HVAC system installation and maintenance for 15-story office building",
      coordinates: { lat: 40.7128, lng: -74.006 },
      progress: 65,
      budget: 150000,
      spent: 97500,
    },
    {
      id: 2,
      name: "Shopping Mall Project",
      address: "456 Mall Rd, Suburbs, NY 10002",
      client: "Retail Ventures Inc",
      status: "Active",
      priority: "Medium",
      startDate: "2024-02-15",
      endDate: "2024-08-15",
      projectsSites: 6,
      supervisor: "Sarah Wilson",
      phone: "(555) 234-5678",
      description: "HVAC retrofit for large shopping mall including energy efficiency upgrades",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      progress: 40,
      budget: 200000,
      spent: 80000,
    },
    {
      id: 3,
      name: "Residential Complex",
      address: "789 Home St, Uptown, NY 10003",
      client: "Urban Living Corp",
      status: "Completed",
      priority: "Low",
      startDate: "2023-09-01",
      endDate: "2024-01-31",
      projectsSites: 4,
      supervisor: "Tom Brown",
      phone: "(555) 345-6789",
      description: "HVAC installation for 50-unit residential apartment complex",
      coordinates: { lat: 40.7831, lng: -73.9712 },
      progress: 100,
      budget: 120000,
      spent: 118000,
    },
    {
      id: 4,
      name: "Industrial Warehouse",
      address: "321 Industry Blvd, Industrial Park, NY 10004",
      client: "LogiCorp Solutions",
      status: "Planning",
      priority: "High",
      startDate: "2024-03-01",
      endDate: "2024-09-30",
      projectsSites: 10,
      supervisor: "Lisa Garcia",
      phone: "(555) 456-7890",
      description: "Large-scale industrial HVAC system for 100,000 sq ft warehouse facility",
      coordinates: { lat: 40.6892, lng: -74.0445 },
      progress: 5,
      budget: 300000,
      spent: 15000,
    },
    {
      id: 5,
      name: "Medical Center",
      address: "555 Health Way, Medical District, NY 10005",
      client: "HealthFirst Medical",
      status: "On Hold",
      priority: "High",
      startDate: "2024-04-01",
      endDate: "2024-10-31",
      projectsSites: 12,
      supervisor: "David Kim",
      phone: "(555) 567-8901",
      description: "Specialized HVAC system for medical facility with clean room requirements",
      coordinates: { lat: 40.7505, lng: -73.9934 },
      progress: 15,
      budget: 250000,
      spent: 37500,
    },
  ]

  const filteredSites = jobSites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || site.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "planning":
        return "outline"
      case "on_hold":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects / Sites</h1>
          <p className="text-muted-foreground">Manage project locations and assignments</p>
        </div>
        <ProjectsSitesForm isAddDrawerOpen={isAddDrawerOpen} setIsAddDrawerOpen={setIsAddDrawerOpen} handleAddProjectsSites={handleAddProjectsSites} />

      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search job sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Sites Tabs */}
      <Tabs defaultValue="cards" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isFetching &&
            <>
            <SiteCardSkeleton />
            <SiteCardSkeleton />
            </>
            }
            {filteredProjectsSites.map((site) => (
              <Card key={site.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{site.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {site.address}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(site.status)}>{site.status}</Badge>
                      <span className={`text-sm font-medium ${getPriorityColor(site.priority)}`}>{site.priority}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Client</p>
                      <p className="font-medium">{site.clientName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Supervisor</p>
                      <p className="font-medium">{site?.supervisor || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Team Size</p>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="font-medium">{site?.projectsSites || "-"} </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Contact</p>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        <span className="font-medium">{site?.clientContact?.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{site?.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${site?.progress||90}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium">${site.budget?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-medium">${site.spent?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(site.startDate).toLocaleDateString()} - {new Date(site.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{site.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t">

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${site?.latitude},${site?.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    // className="text-blue-600 text-sm underline mt-2 inline-block"
                    ><Button variant="outline" size="sm">
                        <Navigation className="h-4 w-4 mr-2" />
                        Directions
                      </Button>

                    </a>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(site)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleDeleteProjectsSites}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Badge variant="destructive" className="w-full whitespace-nowrap">
            Work Under Progress - we are working on this module
          </Badge>
          <Card>
            <CardHeader>
              <CardTitle>Job Sites Map</CardTitle>
              <CardDescription>Interactive map showing all job site locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-muted-foreground">Google Maps integration would be implemented here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSites.map((site) => (
              <Card key={site.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{site.name}</h3>
                    <Badge variant={getStatusColor(site.status)} className="text-xs">
                      {site.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{site.address}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {site.projectsSites} projectsSites
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {site.coordinates.lat.toFixed(4)}, {site.coordinates.lng.toFixed(4)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Badge variant="destructive" className="w-full whitespace-nowrap">
            Work Under Progress - we are working on this module
          </Badge>
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Overview of all projects and their schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredSites.map((site, index) => (
                  <div key={site.id} className="relative">
                    {index !== filteredSites.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-muted"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${site.status === "Active"
                          ? "bg-blue-600"
                          : site.status === "Completed"
                            ? "bg-green-600"
                            : site.status === "Planning"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                      >
                        {site.progress}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{site.name}</h3>
                          <Badge variant={getStatusColor(site.status)}>{site.status}</Badge>
                        </div>
                        <p className="text-muted-foreground">{site.client}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(site.startDate).toLocaleDateString()} -{" "}
                            {new Date(site.endDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {site.projectsSites} projectsSites
                          </div>
                          <div className="flex items-center">
                            <AlertCircle className={`h-4 w-4 mr-1 ${getPriorityColor(site.priority)}`} />
                            {site.priority} Priority
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{site.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${site.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
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
export default withHOC(ProjectsSitesPageProvider, JobSitesPage);
