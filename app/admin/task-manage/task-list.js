import React from 'react'
import DOMPurify from "dompurify"; // सुरक्षा खातिर
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link";
import { Plus, Clock, MapPin, Users, CalendarIcon, Edit, Trash2, AlertCircle, Eye, MoreHorizontal, CheckCircle2, MoreVerticalIcon } from "lucide-react"

const statusColors = {
  scheduled: "bg-blue-500 text-white",
  in_progress: "bg-orange-500 text-white",
  completed: "bg-green-500 text-white",
  cancelled: "bg-red-500 text-white",
  on_hold: "bg-yellow-500 text-black",
};

export default function TaskList(props) {
  const { TaskSchedulesData, openEditDialog, router } = props;
  const cleanHTML = (content) => DOMPurify.sanitize(content);

  const getEventTypeColor = (type) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "training":
        return "bg-green-100 text-green-800 border-green-200"
      case "task":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "schedule_visit":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // const getPriorityColor = (priority) => {
  //   switch (priority) {
  //     case "urgent":
  //       return "text-red-600"
  //     case "normal":
  //       return "text-yellow-600"
  //     case "low":
  //       return "bg-green-100 text-green-800 border-green-200"
  //     default:
  //       return "text-gray-600"
  //   }
  // }
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    normal: "bg-blue-100 text-blue-800 border-blue-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  };

  const dropdownMenuItems = (request) => {
    return <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => {
        router.push(`?parentId=${request.id}&ProjectsSiteId=${request?.ProjectsSiteId}`)
        openEditDialog({ ProjectsSiteId: request?.ProjectsSiteId, parentId: request.id })
      }}>
        {/* <Eye className="mr-2 h-4 w-4" /> */}
        <Plus className="mr-2 h-4 w-4" />
        Add Sub Task
      </DropdownMenuItem>
      <DropdownMenuItem >
        <Eye className="mr-2 h-4 w-4" />
        View Details
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => openEditDialog(request)} disabled={request.status !== "PENDING"}>
        <Edit className="mr-2 h-4 w-4" />
        Edit Request
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={request.status !== "PENDING"}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the employee record and
              remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuContent>
  }
  return (
    <div className="space-y-2">
      {/* space-y-4 */}
      {TaskSchedulesData?.map((event) => (
        <Link href={`/admin/task-manage/${event.id}`}>

          <div key={event.id} className=" p-2 border rounded-lg hover:shadow-md transition-shadow">
            <div>
              {event?.parentTask && <div className='text-sm text-muted-foreground'>
                Parent Task: #{event?.parentTask?.id.split("-")[4]}{" "}{event?.parentTask?.title}
              </div>}
            </div>

            <div className="flex flex-wrap justify-between mb-1">
              {/* Left section: Title + badges */}
              <div className="flex-1 min-w-[200px] space-y-1 cursor-pointer">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                      #{event.type}
                    </Badge>
                    {event.title}
                  </h3>

                  <samp title={event.priority} className="text-muted-foreground">
                    <AlertCircle className={`h-4 w-4 ${priorityColors[event.priority]}`} />

                  </samp>
                  <Badge
                    className={`text-xs ${statusColors[event?.status?.toLowerCase()]}`}
                  >
                    {event.status}
                  </Badge>
                </div>
              </div>

              {/* Right section: Action buttons (always top right) */}
              <div
                className="flex items-start space-x-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openEditDialog(event);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  className="xs:hidden"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`?parentId=${event.id}&ProjectsSiteId=${event?.ProjectsSiteId}`);
                    openEditDialog({ ProjectsSiteId: event?.ProjectsSiteId, parentId: event.id });
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Sub Task
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  {dropdownMenuItems(event)}
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-2 px-2 ">
              <samp className="text-sm">Projects/Sites:{event?.ProjectsSite?.name}</samp>
              <div className="text-sm">Discription:</div>
              <div
                className="p-2 prose prose-sm text-gray-700 line-clamp-2 bg-gray-100"
                dangerouslySetInnerHTML={{ __html: cleanHTML(event.taskDescription) }}
              />
            </div>

            <div className="grid grid-flow-col  overflow-auto gap-4 text-sm">
              {/* grid-cols-2 md:grid-cols-5 */}
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {new Date(event.startDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                {event.startTime} ({event.estimatedHours})hrs
              </div>
              <div className="flex items-center text-muted-foreground cursor-pointer"
                title={event?.ProjectsSite?.address}
              >
                <MapPin className="h-4 w-4 mr-2" />
                <div >
                  {event?.ProjectsSite?.name}
                  <samp>
                    {/* {event?.ProjectsSite?.address} */}
                  </samp>
                </div>

              </div>
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                {event?.assignToEmployee?.user?.fullName}
              </div>
              {event?.subTasks?.length > 0 && <div className="flex items-center text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                SubTasks:  {event?.subTasks?.length}
              </div>}
              <div className="flex items-center text-muted-foreground">
                created by:{event?.createBy?.fullName}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
