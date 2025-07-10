"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Trash2, MapPin } from "lucide-react"

const employees = [
  {
    id: 1,
    name: "John Smith",
    email: "john@hvacpro.com",
    role: "HVAC Technician",
    site: "Downtown Office Complex",
    status: "Present",
    attendance: "95%",
    avatar: "JS",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@hvacpro.com",
    role: "Senior Technician",
    site: "Mall Project",
    status: "Present",
    attendance: "98%",
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@hvacpro.com",
    role: "HVAC Technician",
    site: "Office Building",
    status: "Late",
    attendance: "87%",
    avatar: "MW",
  },
]

export function EmployeeTable() {
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
    <div className="space-y-4">
      {employees.map((employee) => (
        <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback className="bg-blue-100 text-blue-600">{employee.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{employee.name}</p>
              <p className="text-sm text-muted-foreground">{employee.email}</p>
              <p className="text-sm text-muted-foreground">{employee.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <Badge variant={getStatusColor(employee.status)}>{employee.status}</Badge>
              <p className="text-sm text-muted-foreground mt-1">{employee.attendance}</p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {employee.site}
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
