"use client"

import { MapPin } from "lucide-react"

interface LocationMapProps {
  currentLocation: { lat: number; lng: number } | null
}

export function LocationMap({ currentLocation }: LocationMapProps) {
  return (
    <div className="space-y-4">
      <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Interactive map would be displayed here</p>
          {currentLocation && (
            <p className="text-xs text-muted-foreground mt-2">
              Current: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h4 className="font-medium mb-2">Today's Assignment</h4>
        <p className="text-sm text-muted-foreground mb-1">Downtown Office Complex</p>
        <p className="text-sm text-muted-foreground">123 Business Ave, Downtown, NY 10001</p>
        <div className="flex items-center justify-between mt-3 text-sm">
          <span>Distance from current location:</span>
          <span className="font-medium">0.3 miles</span>
        </div>
      </div>
    </div>
  )
}
