"use client"

import React from "react";
import {
    CheckCircle2,
    X,
} from "lucide-react";

import { validationSchema } from "../form-helper";
import { TaskSchedulePageProvider, useTaskSchedulePageContext } from "../use-task-schedule";
import withHOC from "@/utils/with-hoc";
import AddForm from "../add-form";
import TaskList from "../task-list";
import BackButton from "@/components/ui/back-button";


// export default 
function TaskForm() {
    const {
        isAddDrawerOpen,
        handleCloseDrawer,
        selectedTaskSchedules, openEditDialog, handleAddTaskSchedules,
        projectsSitesData,
        employeeList,
        attachedFiles, setAttachedFiles, searchParams,
        TaskSchedulesDetail,
        router
    } = useTaskSchedulePageContext();
console.log(TaskSchedulesDetail);

    return (<>
        <div className="space-y-3 pb-6">
            <div className="text-2xl font-semibold flex items-center gap-3">
                <div className=" bg-blue-100 rounded-lg">
                    {/* <CheckCircle2 className="h-5 w-5 text-blue-600" /> */}
                    <BackButton onClick={()=> router.back()}/>
                </div>
                Schedule/Task
            </div>
            <div className="text-base">
                Enter the Schedule/Task details below
            </div>
        </div>
        <AddForm
            selectedTaskSchedules={selectedTaskSchedules}
            validationSchema={validationSchema}
            projectsSitesData={projectsSitesData}
            employeeList={employeeList}
            attachedFiles={attachedFiles}
            setAttachedFiles={setAttachedFiles}
            searchParams={searchParams}
            handleAddTaskSchedules={handleAddTaskSchedules} />

        SubTasks Lists
        <TaskList TaskSchedulesData={TaskSchedulesDetail?.data?.subTasks} />

    </>
    )
}
export default withHOC(TaskSchedulePageProvider, TaskForm);
