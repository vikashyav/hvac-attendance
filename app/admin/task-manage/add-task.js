import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useTaskSchedulePageContext } from "./use-task-schedule"
import { validationSchema } from "./form-helper"
import AddForm from "./add-form"

export default function TaskSchedulesForm() {
  const { canManage, isAddDrawerOpen, handleCloseDrawer, selectedTaskSchedules, openEditDialog,
    handleAddTaskSchedules, projectsSitesData, employeeList, saveError, projects, employees } = useTaskSchedulePageContext()
  if (!canManage) return null
  return <>
    <Button onClick={() => openEditDialog()}>Add Schedule/Task</Button>
    <Sheet open={isAddDrawerOpen} onOpenChange={handleCloseDrawer}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{selectedTaskSchedules.id ? "Edit Schedule/Task" : selectedTaskSchedules.parentId ? "Add Sub Task" : "Add Schedule/Task"}</SheetTitle>
          <SheetDescription>Enter the task details below.</SheetDescription>
        </SheetHeader>
        {(projects.isPending || employees.isPending) && <p role="status">Loading task options…</p>}
        {(projects.isError || employees.isError) && <div role="alert">Unable to load task options.<Button onClick={() => { projects.refetch(); employees.refetch() }}>Retry task options</Button></div>}
        <AddForm selectedTaskSchedules={selectedTaskSchedules} validationSchema={validationSchema}
          handleAddTaskSchedules={handleAddTaskSchedules} projectsSitesData={projectsSitesData}
          employeeList={employeeList} canManage={canManage} saveError={saveError}
          onCancel={() => handleCloseDrawer(false)} />
      </SheetContent>
    </Sheet>
  </>
}
