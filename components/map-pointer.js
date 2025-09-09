"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import { Badge } from "@/components/ui/badge"

// Custom icon
// const checkInIcon = new L.Icon({
//   iconUrl: "/checkin-icon.png", // put your custom icon inside /public
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -30],
// });

// Example check-ins data
const checkIns = [
    { id: 1, lat: 28.6139, lng: 77.209, employee: "Vikas", time: "09:00 AM" },
    { id: 2, lat: 28.7041, lng: 77.1025, employee: "Rohit", time: "09:15 AM" },
    { id: 3, lat: 28.5355, lng: 77.391, employee: "Ankit", time: "09:30 AM" },
];

// ✅ Helper component to auto-fit bounds
function FitBounds({ data }) {
    const map = useMap();

    useEffect(() => {
        if (data.length > 0) {
            const bounds = L.latLngBounds(data.map((c) => [c?.checkOutLocation?.latitude || c?.checkInLocation?.latitude, c?.checkOutLocation?.longitude || c?.checkInLocation?.longitude]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [data, map]);

    return null;
}

export default function MapContainers({ codinateData }) {
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

                {codinateData.map((cod) => {
                    const lat = cod?.checkOutLocation?.latitude || cod?.checkInLocation?.latitude;
                    const lng = cod?.checkOutLocation?.longitude || cod?.checkInLocation?.longitude;
                    const checkInIcon = new L.Icon({
                        iconUrl: cod?.checkOutPhoto || cod?.checkInPhoto, // put your custom icon inside /public
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -30],
                    });
                    return (
                        <Marker
                            key={cod.id}
                            position={[lat, lng]}
                            icon={checkInIcon}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <Badge
                                        variant={
                                            cod.status === "late"
                                                ? "destructive"
                                                : (cod.status === "on-time" || cod.status === "present")
                                                    ? "default"
                                                    : cod.status === "completed"
                                                        ? "secondary"
                                                        : "outline"
                                        }
                                        className="text-xs"
                                    >
                                        {cod.status}
                                    </Badge>
                                    <samp className="text-xs text-muted-foreground">{"  "}{cod.employee} {"--> "}
                                        {cod.status} at: {cod.time} {" "}
                                        {cod.action} from {cod?.checkOutLocation?.address || cod?.checkInLocation?.address} {"  "}
                                    </samp>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}

                {/* Auto-fit map to markers */}
                <FitBounds data={codinateData} />
            </MapContainer>
        </div>
    );
}
