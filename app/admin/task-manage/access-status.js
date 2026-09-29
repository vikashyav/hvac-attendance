import { Button } from "@/components/ui/button"
import { useTaskSchedulePageContext } from "./use-task-schedule"

export default function TaskAccessStatus() {
  const { canManage, capabilities, saveError, saveSuccess, isAddDrawerOpen } = useTaskSchedulePageContext()
  return <>
    {!canManage && <div role="status">
      {capabilities.isPending ? "Checking task editing permissions…" : capabilities.isError ? "Unable to verify task editing permissions." : "You have read-only access to tasks."}
      {capabilities.isError && <Button variant="outline" onClick={() => capabilities.refetch()}>Retry task permissions</Button>}
    </div>}
    {saveSuccess && <p role="status">{saveSuccess}</p>}
    {saveError && !isAddDrawerOpen && <p role="alert">{saveError}</p>}
  </>
}
