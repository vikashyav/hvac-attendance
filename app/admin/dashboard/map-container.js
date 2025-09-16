"use client"
import React, { useMemo } from 'react'
import dynamic from 'next/dynamic';
const MapLocations = dynamic(() => import("@/components/location-map"));
import { Marker, Popup, } from "react-leaflet";
import { Badge } from "@/components/ui/badge"
// import {
//     LayoutDashboard, Clock, Calendar, BarChart3, User, LogOut, Menu, Shield,
//     Users, MapPin, FileText, Settings,

// } from "lucide-react"
// --- Haversine formula (distance in KM)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// --- Group nearby check-ins within 1 km
function groupByRadius(data, radiusKm = 1) {
    const groups = [];
    const visited = new Set();

    data?.forEach((item, i) => {
        if (visited.has(i)) return;
        const group = [item];
        visited.add(i);

        data.forEach((other, j) => {
            if (i !== j && !visited.has(j)) {
                const dist = getDistance(
                    item.checkInLocation.latitude,
                    item.checkInLocation.longitude,
                    other.checkInLocation.latitude,
                    other.checkInLocation.longitude
                );
                if (dist <= radiusKm) {
                    group.push(other);
                    visited.add(j);
                }
            }
        });

        groups.push(group);
    });
    console.log("group", groups);

    return groups;
}

// --- Custom marker icons
function createGroupIcon(group) {
    // console.log(group, "gggggggg");

    if (group.length === 1) {
        const p = group[0];
        return L.divIcon({
            html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <img src="${p.checkInPhoto}" style="width:40px;height:40px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.3)" />
          <span style="font-size:12px;background:white;padding:2px 6px;border-radius:12px;margin-top:2px;">${p?.fullName ||p?.employee}</span>
        </div>
      `,
            className: "",
            iconSize: [50, 60],
            iconAnchor: [25, 60],
        });
    } else {
        return L.divIcon({
            html: `
        <div style="width:50px;height:50px;border-radius:50%;background:#2563eb;color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;box-shadow:0 0 6px rgba(0,0,0,0.4)">
          ${group.length} <img src="https://www.iconpacks.net/icons/1/free-user-group-icon-296-thumb.png" style="width:20px;height:20px; border-radius:50%; " />
        </div>
      `,
            className: "",
            iconSize: [50, 50],
            iconAnchor: [25, 50],
        });
    }
}


export default function MapContainer({ codinateData }) {
    const groupedData = useMemo(() => groupByRadius(codinateData, 1), [codinateData]);
    // [c?.checkOutLocation?.latitude || c?.checkInLocation?.latitude, c?.checkOutLocation?.longitude || c?.checkInLocation?.longitude]
    // console.log("codinateData", codinateData, "groupedData", groupedData);
    const codinateData_= codinateData?.map((cod)=>{
        return {
            lat: cod?.checkOutLocation?.latitude || cod?.checkInLocation?.latitude,
            lng: cod?.checkOutLocation?.longitude || cod?.checkInLocation?.longitude
        }
    })

    return (
        <MapLocations codinateData={codinateData_ || []}>
            {groupedData.map((group, idx) => (
                <Marker
                    key={idx}
                    position={[
                        group[0].checkInLocation.latitude,
                        group[0].checkInLocation.longitude,
                    ]}
                    icon={createGroupIcon(group)}
                >
                    <Popup>
                        {group.map((p) => (
                            <div key={p.id} className="flex items-center mb-2">
                                <img
                                    src={p.checkInPhoto}
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                                <div className='gap-1'>

                                    <span className="font-semibold px-1">{p?.fullName || p?.employee}</span>
                                    <Badge
                                        variant={
                                            p.status === "late"
                                                ? "destructive"
                                                : (p.status === "on-time" || p.status === "present")
                                                    ? "default"
                                                    : p.status === "completed"
                                                        ? "secondary"
                                                        : "outline"
                                        }
                                        className="text-xs"
                                    >
                                        {p?.status}
                                    </Badge>
                                    <samp className="text-xs text-gray-600 px-1">
                                        {p?.time}
                                    </samp>
                                    <div className="text-xs">{p?.checkInLocation.address}</div>
                                </div>
                            </div>
                        ))}
                    </Popup>
                </Marker>
            ))}
            {/* {codinateData.map((cod) => {
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
            })} */}
        </MapLocations>
    )
}
