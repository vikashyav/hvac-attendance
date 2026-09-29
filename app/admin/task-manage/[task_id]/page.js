"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TaskSchedulePageProvider, useTaskSchedulePageContext } from "../use-task-schedule"
import withHOC from "@/utils/with-hoc"
import TaskList, { TaskCardSkeleton } from "../task-list"
import TaskSchedulesForm from "../add-task"
import TaskAccessStatus from "../access-status"

function TaskDetail() {
  const { tasks, canManage, openEditDialog } = useTaskSchedulePageContext()
  return <div className="space-y-4">
    <Link href="/admin/task-manage">Back to tasks</Link>
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-semibold">Schedule/Task</h1><TaskSchedulesForm /></div>
    <TaskAccessStatus />
    {tasks.isPending ? <TaskCardSkeleton /> : tasks.isError ? <div role="alert">Unable to load task.<Button onClick={() => tasks.refetch()}>Retry task</Button></div> : !tasks.data?.data ? <p role="status">Task not found.</p> : <>
      <TaskList TaskSchedulesData={[tasks.data.data]} showFullDescription canManage={canManage} openEditDialog={openEditDialog} />
      <h2 className="text-xl font-semibold">Subtasks</h2>
      <TaskList TaskSchedulesData={tasks.data.data.subTasks || []} canManage={canManage} openEditDialog={openEditDialog} />
    </>}
  </div>
}
export default withHOC(TaskSchedulePageProvider, TaskDetail)
