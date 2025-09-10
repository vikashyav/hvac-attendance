import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, } from "lucide-react"
import { Button } from "@/components/ui/button"
// import TaskEditor from "@/components/ckeditor";
import dynamic from 'next/dynamic';
const TaskEditor = dynamic(() => import("@/components/ckeditor"));
import FileAttachment from "@/components/file-attachment";

export default function AddForm() {
  const [attachedFiles, setAttachedFiles] = useState([]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event/Task
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[70vw] h-[90vh] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Create New Task/Event/Schedule</DialogTitle>
                    <DialogDescription>Schedule a new event or meeting</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className=" space-y-2">
                        <Label htmlFor="title"> Title</Label>
                        <Input id="title" placeholder="Enter event title" />

                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="projectSites">Project/Sites</Label>
                        <Input id="title" placeholder="Enter Project/Sites" />


                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="meeting">Meeting</SelectItem>
                                <SelectItem value="training">Training</SelectItem>
                                <SelectItem value="presentation">Presentation</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="orientation">Orientation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                <div className='grid  grid-cols-1'>
                    <Label htmlFor="title">Description</Label>
                    <TaskEditor
                        className="min-h-[120px]"
                    //  onChange={(data) => setTaskDetails(data)} 
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input id="time" type="time" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30min">30 minutes</SelectItem>
                                <SelectItem value="1hour">1 hour</SelectItem>
                                <SelectItem value="2hours">2 hours</SelectItem>
                                <SelectItem value="4hours">4 hours</SelectItem>
                                <SelectItem value="allday">All day</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Status</Label>
                        <Select >
                            <SelectTrigger data-testid="select-status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Priority</Label>
                        <Select >
                            <SelectTrigger data-testid="select-priority">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className=" space-y-2">
                        <Label htmlFor="attendees">Assignee</Label>
                        <Input id="attendees" placeholder="Select attendees" />
                    </div>
                </div>
 {/* File Attachments */}
            <FileAttachment 
              files={attachedFiles}
              onFilesChange={setAttachedFiles}
            />
                <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Event</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
