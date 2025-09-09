"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import 'leaflet/dist/leaflet.css';

// Custom icon
const checkInIcon = new L.Icon({
  iconUrl: "/checkin-icon.png", // put your custom icon inside /public
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

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
      const bounds = L.latLngBounds(data.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [data, map]);

  return null;
}

export default function CheckInMap() {
  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={[20.5937, 78.9629]} // fallback (India center)
        zoom={5}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {checkIns.map((checkIn) => (
          <Marker
            key={checkIn.id}
            position={[checkIn.lat, checkIn.lng]}
            icon={checkInIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{checkIn.employee}</p>
                <p>Checked in at: {checkIn.time}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Auto-fit map to markers */}
        <FitBounds data={checkIns} />
      </MapContainer>
    </div>
  );
}
