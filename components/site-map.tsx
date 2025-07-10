"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users } from "lucide-react"

const sites = [
  {
    id: 1,
    name: "Downtown Office Complex",
    address: "123 Business Ave, Downtown",
    employees: 8,
    status: "Active",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    name: "Shopping Mall Project",
    address: "456 Mall Rd, Suburbs",
    employees: 6,
    status: "Active",
    coordinates: { lat: 40.7589, lng: -73.9851 },
  },
  {
    id: 3,
    name: "Residential Complex",
    address: "789 Home St, Uptown",
    employees: 4,
    status: "Completed",
    coordinates: { lat: 40.7831, lng: -73.9712 },
  },
]

export function SiteMap() {
  return (
    <div className="space-y-4">
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Interactive Map</p>
          <p className="text-muted-foreground">Google Maps integration would be implemented here</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => (
          <Card key={site.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{site.name}</h3>
                <Badge variant={site.status === "Active" ? "default" : "secondary"}>{site.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{site.address}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {site.employees} employees
                </div>
                <div className="text-xs text-muted-foreground">
                  {site.coordinates.lat.toFixed(4)}, {site.coordinates.lng.toFixed(4)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
