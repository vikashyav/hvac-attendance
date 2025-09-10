import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Textarea } from "@/components/ui/textarea";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
import { FormikInput, Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Combobox, { FormikCombobox } from "@/components/comobox";
// import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    User,
    CheckCircle2,
    X,
} from "lucide-react";
import dynamic from 'next/dynamic';

import {
    useTaskSchedulePageContext,
} from "./use-task-schedule";
import { validationSchema } from "./form-helper";
const FormikRichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor"));
import FileAttachment from "@/components/file-attachment";
// import TaskForm from "./[task_id]/page";
import AddForm from "./add-form";

function TaskSchedulesForm({

}) {
    const {
        isAddDrawerOpen,
        handleCloseDrawer,
        selectedTaskSchedules, openEditDialog, handleAddTaskSchedules,
        projectsSitesData,
        employeeList,
        attachedFiles, setAttachedFiles, searchParams
    } = useTaskSchedulePageContext();

    return (
        <Sheet open={isAddDrawerOpen} onOpenChange={handleCloseDrawer} >
            <SheetTrigger asChild>
                <Button
                    onClick={() => openEditDialog()}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Add Schedule/Task

                </Button>
            </SheetTrigger>
            {/* max-w-3xl lg:w-1/2 md:w-1/2 sm:w-[600px]*/}

            <SheetContent className="w-1/2 xs:w-[100vw] overflow-y-auto">
                <SheetHeader className="space-y-3 pb-6">
                    <SheetTitle className="text-2xl font-semibold flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        Schedule/Task
                    </SheetTitle>
                    <SheetDescription className="text-base">
                        Enter the Schedule/Task details below
                    </SheetDescription>
                </SheetHeader>
                {/* <TaskForm /> */}
                <AddForm
                    selectedTaskSchedules={selectedTaskSchedules}
                    validationSchema={validationSchema}
                    projectsSitesData={projectsSitesData}
                    employeeList={employeeList}
                    attachedFiles={attachedFiles}
                    setAttachedFiles={setAttachedFiles}
                    searchParams={searchParams}
                    handleAddTaskSchedules={handleAddTaskSchedules} />
                {/* <Formik
                    initialValues={selectedTaskSchedules}
                    validationSchema={validationSchema}
                    onSubmit={handleAddTaskSchedules}
                >
                    {({
                        values,
                        errors,
                        touched,
                        isSubmitting,
                        setFieldValue,
                        resetForm,
                    }) => {
                        console.log({ values, errors });
                        // const projectsSitesId= searchParams.get("ProjectsSiteId")
                        // if (projectsSitesId) {
                            // setFieldValue("ProjectsSiteId", projectsSitesId)
                        // }
                        return (
                            <Form className="grid grid-cols-1 gap-4 space-y-8">
                                <ScrollArea>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className=" space-y-2">
                                            <Label htmlFor="title"> Title</Label>
                                            <FormikInput
                                                id="title"
                                                name="title"
                                                placeholder="Enter title"
                                            />

                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ProjectsSiteId">Project/Sites </Label>
                                            <FormikCombobox
                                                name="ProjectsSiteId"
                                                htmlFor="ProjectsSiteId"
                                                placeholder="Select Projects/Site"
                                                lableString="name"
                                                valueString="id"
                                                options={projectsSitesData?.data || []}
                                                disabled={searchParams.get("ProjectsSiteId") && true}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Type</Label>
                                            <Select
                                                value={values.type}
                                                onValueChange={(value) => {
                                                    setFieldValue("type", value);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="schedule_visit">Schedule/Visit</SelectItem>
                                                    <SelectItem value="task">Task</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>
                                    <div className='grid  grid-cols-1 py-2'>
                                        <Label htmlFor="taskDescription">Description</Label>
                                        <FormikRichTextEditor id={`taskDescription`} name={`taskDescription`} />

                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="startDate">Start Date</Label>
                                            <FormikInput name="startDate" id="startDate" type="date" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="startTime">Start Time</Label>
                                            <FormikInput name="startTime" id="startTime" type="time" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="estimatedHours">Duration</Label>
                                            <Select
                                                value={values.estimatedHours}
                                                onValueChange={(value) => {
                                                    setFieldValue("estimatedHours", value);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select duration" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0.50">30 minutes</SelectItem>
                                                    <SelectItem value="1.00">1 hour</SelectItem>
                                                    <SelectItem value="2.00">2 hours</SelectItem>
                                                    <SelectItem value="4.00">4 hours</SelectItem>
                                                    <SelectItem value="9.00">All day</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Status</Label>
                                            <Select
                                                value={values.status}
                                                onValueChange={(value) => {
                                                    setFieldValue("status", value);
                                                }}
                                            >
                                                <SelectTrigger data-testid="select-status">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="scheduled">scheduled(New)</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="on_hold">on_hold</SelectItem>
                                                    <SelectItem value="completed">completed</SelectItem>
                                                    <SelectItem value="cancelled">cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Priority</Label>
                                            <Select
                                                value={values.priority}
                                                onValueChange={(value) => {
                                                    setFieldValue("priority", value);
                                                }}
                                            >
                                                <SelectTrigger data-testid="select-priority">
                                                    <SelectValue placeholder="Select priority" />
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
                                            <Label htmlFor="assignTo">Assignee</Label>
                                            <FormikCombobox
                                                name="assignTo"
                                                htmlFor="assignTo"
                                                placeholder="Select assignTo"
                                                lableString="fullName"
                                                valueString="id"
                                                options={employeeList || []}
                                            />
                                        </div>
                                    </div>
                                    <FileAttachment
                                        files={attachedFiles}
                                        onFilesChange={setAttachedFiles}
                                    />
                                    <div className="grid grid-cols-3 gap-4"></div>
                                    <div className="grid grid-cols-2 gap-4 py-4">

                              

                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                resetForm();
                                                setIsAddDrawerOpen(false);
                                            }}
                                            className="w-[100px]"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-[12svw] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Adding ...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    {values?.id ? "Update Task/Schedule" : "Add Task/Schedule"}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </ScrollArea>
                            </Form>
                        );
                    }}
                </Formik> */}
            </SheetContent>
        </Sheet>
    );
}

export default TaskSchedulesForm;
