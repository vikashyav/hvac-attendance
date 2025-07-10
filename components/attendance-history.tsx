"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

const attendanceHistory = [
  {
    date: "2024-01-15",
    checkIn: "8:15 AM",
    checkOut: "5:30 PM",
    status: "Present",
    location: "Downtown Office Complex",
    hours: "9h 15m",
  },
  {
    date: "2024-01-14",
    checkIn: "8:45 AM",
    checkOut: "5:15 PM",
    status: "Late",
    location: "Downtown Office Complex",
    hours: "8h 30m",
  },
  {
    date: "2024-01-13",
    checkIn: "8:00 AM",
    checkOut: "5:00 PM",
    status: "Present",
    location: "Downtown Office Complex",
    hours: "9h 00m",
  },
  {
    date: "2024-01-12",
    checkIn: "8:10 AM",
    checkOut: "5:20 PM",
    status: "Present",
    location: "Downtown Office Complex",
    hours: "9h 10m",
  },
]

export function AttendanceHistory() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "default"
      case "Late":
        return "secondary"
      case "Absent":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-3">
      {attendanceHistory.map((record, index) => (
        <div key={index} className="p-3 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
              <Badge variant={getStatusColor(record.status)}>{record.status}</Badge>
            </div>
            <span className="text-sm font-medium">{record.hours}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {record.checkIn} - {record.checkOut}
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {record.location}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
