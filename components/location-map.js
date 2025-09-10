"use client"
import { MapPin } from "lucide-react"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import { Badge } from "@/components/ui/badge"

// ✅ Helper component to auto-fit bounds
function FitBounds({ data }) {
    const map = useMap();

    useEffect(() => {
        if (data.length > 0) {
            const bounds = L.latLngBounds(data.map((c) => [c?.lat, c?.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [data, map]);

    return null;
}

export default function MapLocations({children, codinateData }) {
    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg">
            <MapContainer
                center={[20.5937, 78.9629]} // fallback (India center)
                zoom={5}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                  {children}
                
                {/* Auto-fit map to markers */}
                <FitBounds data={codinateData} />
            </MapContainer>
        </div>
    );
}

export function LocationMap({ currentLocation }) {
  return (
    <div className="space-y-4">
      <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Interactive map would be displayed here
          </p>
          {currentLocation && (
            <p className="text-xs text-muted-foreground mt-2">
              Current: {currentLocation.lat.toFixed(4)},{" "}
              {currentLocation.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h4 className="font-medium mb-2">Today's Assignment</h4>
        <p className="text-sm text-muted-foreground mb-1">
          Downtown Office Complex
        </p>
        <p className="text-sm text-muted-foreground">
          123 Business Ave, Downtown, NY 10001
        </p>
        <div className="flex items-center justify-between mt-3 text-sm">
          <span>Distance from current location:</span>
          <span className="font-medium">0.3 miles</span>
        </div>
      </div>
    </div>
  )
}
