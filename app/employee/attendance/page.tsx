"use client"

import { useMemo } from "react"
import moment from "moment"
import { AlertCircle, CalendarIcon, CheckCircle, ChevronLeft, ChevronRight, Clock, Clock3, MapPin, RefreshCw, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import withHOC from "@/utils/with-hoc"
import { AttendancesPageProvider, useAttendancesPageContext } from "./use-attendance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { AdminTableCard, EmpTableCard } from "./table-card"
import dynamic from "next/dynamic"

const MapContainer = dynamic(() => import("@/app/admin/dashboard/map-container"))

type AttendanceRecord = {
  checkInTime?: string
  checkOutTime?: string
  checkInLocation?: { address?: string; latitude?: number; longitude?: number }
  workHours?: number
  overtimeHours?: number
  status?: string
  isLate?: boolean
}
type AttendancePolicy = {
  timezone?: string
  startTime?: string
  endTime?: string
  workDays?: number[]
  requiredHours?: number
  breakMinutes?: number
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
const statusStyles: Record<string, string> = {
  present: "bg-emerald-100 text-emerald-700",
  late: "bg-amber-100 text-amber-700",
  half_day: "bg-orange-100 text-orange-700",
  absent: "bg-rose-100 text-rose-700",
  week_off: "bg-slate-100 text-slate-500",
}
const statusLabels: Record<string, string> = {
  present: "Present", late: "Late", half_day: "Half day", absent: "Absent", week_off: "Week off",
}

function hoursLabel(value?: number) {
  const minutes = Math.max(0, Math.round(Number(value || 0) * 60))
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}
function timeLabel(value?: string) {
  return value && moment(value).isValid() ? moment(value).format("HH:mm") : "—"
}
function policyTime(value?: string) {
  return value ? moment(value, "HH:mm").format("h:mm A") : "—"
}
function localToday(timezone?: string) {
  try {
    const parts = new Intl.DateTimeFormat("en", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date())
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
    return `${values.year}-${values.month}-${values.day}`
  } catch {
    return moment().format("YYYY-MM-DD")
  }
}
function dayStatus(day: moment.Moment, record: AttendanceRecord | undefined, policy: AttendancePolicy | null) {
  if (record) return record.status || "present"
  const key = day.format("YYYY-MM-DD")
  if (policy?.workDays && !policy.workDays.includes(day.day())) return "week_off"
  return key < localToday(policy?.timezone) ? "absent" : ""
}

function EmployeeCalendarView() {
  const useCtx = useAttendancesPageContext as () => any
  const { visibleMonth, selectedDate, setSelectedDate, goToMonth, goToToday, attendanceByDate,
    attendanceData, policy, isLoading, isFetching, isError, refetch } = useCtx()

  const calendarDays = useMemo(() => {
    const monthStart = moment(visibleMonth).startOf("month")
    const start = monthStart.clone().startOf("isoWeek")
    const end = monthStart.clone().endOf("month").endOf("isoWeek")
    const days: moment.Moment[] = []
    for (let day = start.clone(); day.isSameOrBefore(end, "day"); day.add(1, "day")) days.push(day.clone())
    return days
  }, [visibleMonth])

  const selectedKey = moment(selectedDate).format("YYYY-MM-DD")
  const selectedRecord = attendanceByDate[selectedKey] as AttendanceRecord | undefined
  const selectedStatus = dayStatus(moment(selectedDate), selectedRecord, policy)
  const presentDays = Number(attendanceData?.daysPresent || 0)
  const location = selectedRecord?.checkInLocation?.address ||
    (selectedRecord?.checkInLocation?.latitude != null && selectedRecord?.checkInLocation?.longitude != null
      ? `${selectedRecord.checkInLocation.latitude}, ${selectedRecord.checkInLocation.longitude}` : "Not recorded")

  if (isError) return (
    <main className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-9 w-9 text-rose-500" />
        <h1 className="mt-4 text-lg font-semibold text-slate-950">Attendance could not be loaded</h1>
        <p className="mt-2 text-sm text-slate-500">Please check your connection and try again.</p>
        <Button className="mt-5" onClick={() => refetch()}><RefreshCw className="mr-2 h-4 w-4" />Try again</Button>
      </div>
    </main>
  )

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <Button aria-label="Previous month" variant="outline" size="icon" className="h-9 w-9" onClick={() => goToMonth(-1)}><ChevronLeft className="h-4 w-4" /></Button>
              <h2 className="min-w-[132px] text-base font-semibold text-slate-950 sm:text-lg">{moment(visibleMonth).format("MMMM YYYY")}</h2>
              <Button aria-label="Next month" variant="outline" size="icon" className="h-9 w-9" onClick={() => goToMonth(1)}><ChevronRight className="h-4 w-4" /></Button>
              <Button variant="ghost" className="h-9 px-3 text-sm text-blue-700" onClick={goToToday}>Today</Button>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">{isFetching ? "Updating…" : `${presentDays} ${presentDays === 1 ? "day" : "days"} present`}</div>
          </div>

          {isLoading ? (
            <div className="grid min-h-[500px] grid-cols-7 gap-px bg-slate-200 p-px" aria-label="Loading attendance calendar">
              {Array.from({ length: 35 }).map((_, index) => <div key={index} className="animate-pulse bg-white p-3"><div className="h-3 w-5 rounded bg-slate-100" /></div>)}
            </div>
          ) : <>
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {WEEKDAYS.map(day => <div key={day} className="px-2 py-2 text-center text-[10px] font-semibold tracking-wider text-slate-500 sm:text-left sm:text-xs">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-px bg-slate-200">
              {calendarDays.map(day => {
                const key = day.format("YYYY-MM-DD")
                const record = attendanceByDate[key] as AttendanceRecord | undefined
                const status = dayStatus(day, record, policy)
                const current = day.month() === moment(visibleMonth).month()
                const selected = key === selectedKey
                const today = key === localToday(policy?.timezone)
                return <button key={key} type="button" onClick={() => setSelectedDate(day.toDate())}
                  className={cn("relative min-h-[88px] bg-white p-2 text-left transition hover:bg-blue-50/60 focus:z-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:min-h-[112px] sm:p-3", !current && "bg-slate-50/80 text-slate-400", selected && "z-10 bg-blue-50/70 ring-2 ring-inset ring-blue-600")}
                  aria-label={`${day.format("MMMM D, YYYY")}${status ? `, ${statusLabels[status]}` : ""}`}>
                  <span className={cn("inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold", today ? "bg-blue-600 text-white" : "text-slate-700", !current && !today && "text-slate-400")}>{day.date()}</span>
                  {current && status && <div className="mt-1.5 space-y-1"><span className={cn("inline-flex max-w-full rounded-md px-1.5 py-0.5 text-[9px] font-semibold sm:text-[11px]", statusStyles[status])}>{statusLabels[status]}</span>{record && <p className="hidden text-[11px] font-medium text-slate-500 sm:block">{hoursLabel(record.workHours)}</p>}</div>}
                </button>
              })}
            </div>
          </>}

          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200 px-4 py-3 text-[11px] text-slate-500 sm:px-5">
            {[["bg-emerald-500", "Present"], ["bg-amber-500", "Late"], ["bg-orange-500", "Half day"], ["bg-rose-500", "Absent"], ["bg-slate-400", "Week off"]].map(([color, label]) => <span key={label} className="flex items-center gap-1.5"><i className={cn("h-2.5 w-2.5 rounded-full", color)} />{label}</span>)}
          </div>
        </section>

        <aside className="self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-[76px]">
          <p className="text-xs font-medium text-slate-500">Selected day</p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-950">{moment(selectedDate).format("dddd, DD MMM YYYY")}</h2>
            {selectedStatus && <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", statusStyles[selectedStatus])}>{statusLabels[selectedStatus]}</span>}
          </div>
          {selectedRecord ? <div className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-x-5 gap-y-5">
              <Detail label="In time" value={timeLabel(selectedRecord.checkInTime)} hint={selectedRecord.isLate ? "Late arrival" : "On time"} />
              <Detail label="Out time" value={timeLabel(selectedRecord.checkOutTime)} hint={selectedRecord.checkOutTime ? "Recorded" : "Awaiting checkout"} />
              <Detail label="Hours worked" value={hoursLabel(selectedRecord.workHours)} hint={`${policy?.requiredHours || 0}h required`} />
              <Detail label="Overtime" value={hoursLabel(selectedRecord.overtimeHours)} hint={selectedRecord.overtimeHours ? "Above scheduled hours" : "No overtime"} />
              <Detail label="Shift" value={`${policyTime(policy?.startTime)} – ${policyTime(policy?.endTime)}`} hint={policy?.timezone || "Company timezone"} wide />
            </div>
            <div className="rounded-xl bg-slate-50 p-3.5"><div className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /><div><p className="text-xs text-slate-500">Check-in location</p><p className="mt-1 break-words text-sm font-medium text-slate-800">{location}</p></div></div></div>
            <div className="border-t border-slate-200 pt-4 text-xs text-slate-500">Recorded hours exclude {Number(policy?.breakMinutes || 0)} minutes of scheduled break time.</div>
          </div> : <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
            <Clock3 className="mx-auto h-7 w-7 text-slate-400" />
            <p className="mt-3 text-sm font-semibold text-slate-800">{selectedStatus === "week_off" ? "Scheduled week off" : selectedStatus === "absent" ? "No attendance recorded" : "No record for this day"}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{selectedStatus === "week_off" ? "This day is outside your company work schedule." : "Check-in and check-out details will appear here when available."}</p>
          </div>}
        </aside>
    </div>
  )
}

function Detail({ label, value, hint, wide = false }: { label: string; value: string; hint: string; wide?: boolean }) {
  return <div className={cn(wide && "col-span-2")}><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-bold text-slate-950">{value}</p><p className="mt-0.5 text-[11px] text-slate-500">{hint}</p></div>
}

function AttendancePage() {
  const router = useRouter()
  const useCtx = useAttendancesPageContext as () => any
  const { user, dateRange, setDateRange, attendanceHistory, monthlyStats, monthlyTrends,
    attendanceData, isFetching, queryParmas, selectedDate, setSelectedDate } = useCtx()
  const isAdmin = user?.role === "admin" || user?.role === "superAdmin"
  const isEmployee = user?.role === "employee"
  const grouped = (attendanceHistory || []).reduce((result: Record<string, any[]>, item: any) => {
    result[item.date] = result[item.date] || []
    result[item.date].push(item)
    return result
  }, {})

  return <div className="space-y-6 p-0">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{isEmployee ? "My Attendance" : "Attendance Tracking"}</h1>
        <p className="text-sm text-gray-600">{isEmployee ? "Review your attendance history and performance metrics" : "Monitor employee attendance history and performance metrics"}</p>
      </div>
      {isAdmin && <div className="space-y-2">
        <label className="text-sm font-medium">Date Range</label>
        <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start bg-transparent text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{dateRange.from && dateRange.to ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}` : "Select date range"}</Button></PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end"><Calendar mode="range" selected={{ from: dateRange.from, to: dateRange.to }} onSelect={range => {
            if (!range) return
            setDateRange(range)
            if (range.from && range.to) router.push(`?${queryParmas?.employee_id ? `employee_id=${queryParmas.employee_id}&` : ""}from=${moment(range.from).format("YYYY-MM-DD")}&to=${moment(range.to).format("YYYY-MM-DD")}`)
          }} disabled={{ after: new Date() }} /></PopoverContent>
        </Popover>
      </div>}
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Metric label="This Month" value={monthlyStats.totalHours} hint="Total hours worked" icon={<Clock className="h-8 w-8 text-blue-600" />} loading={isFetching} />
      <Metric label="Attendance Rate" value={`${monthlyStats.attendanceRate}%`} hint="This month" icon={<CheckCircle className="h-8 w-8 text-green-600" />} loading={isFetching} />
      <Metric label="Punctuality" value={`${monthlyStats.punctualityScore}%`} hint="On-time arrivals" icon={<TrendingUp className="h-8 w-8 text-orange-600" />} loading={isFetching} />
      <Metric label="Overtime" value={monthlyStats.totalOvertimeHours} hint="This month" icon={<Clock className="h-8 w-8 text-purple-600" />} loading={isFetching} />
    </div>

    <Tabs defaultValue={isEmployee ? "calendar" : "history"} className="space-y-6">
      <TabsList><TabsTrigger value="history">Attendance History</TabsTrigger><TabsTrigger value="calendar">{isAdmin ? "Map" : "Calendar"} View</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>
      <TabsContent value="history"><Card><CardHeader><CardTitle>Recent Attendance Records</CardTitle><CardDescription>{isEmployee ? "Your attendance history" : "Employee attendance records for the selected period"}</CardDescription></CardHeader><CardContent>
        {(isEmployee || queryParmas?.employee_id) ? <EmpTableCard isAdmin={isAdmin} attendanceHistory={attendanceHistory} isFetching={isFetching} isEmp={isEmployee} /> : <AdminTableCard isAdmin={isAdmin} isFetching={isFetching} attendanceHistoryGroupByDate={grouped} />}
      </CardContent></Card></TabsContent>
      <TabsContent value="calendar">
        {isEmployee ? <EmployeeCalendarView /> : <Card><CardHeader><CardTitle>Employee attendance map</CardTitle><CardDescription>Select a date to review employee locations.</CardDescription></CardHeader><CardContent><Calendar mode="single" selected={selectedDate} onSelect={date => date && setSelectedDate(date)} className="mb-4 rounded-md border" disabled={{ after: dateRange.to, before: dateRange.from }} /><MapContainer codinateData={grouped[moment(selectedDate).format("YYYY-MM-DD")]} /></CardContent></Card>}
      </TabsContent>
      <TabsContent value="analytics" className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Monthly Trends</CardTitle><CardDescription>Attendance and hours worked over time</CardDescription></CardHeader><CardContent className="space-y-3">{(monthlyTrends || []).map((week: any, index: number) => <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3"><div><p className="font-medium">{week.week}</p><p className="text-sm text-gray-600">{week.totalHours}h worked</p></div><div className="text-right"><p className="font-medium">{week.attendanceRate}%</p><p className="text-sm text-gray-600">Attendance</p></div></div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Performance Summary</CardTitle><CardDescription>Key metrics for this period</CardDescription></CardHeader><CardContent className="space-y-6"><Progress label="Overall Attendance" value={monthlyStats.attendanceRate} color="bg-green-600" /><Progress label="Punctuality Score" value={monthlyStats.punctualityScore} color="bg-blue-600" />{attendanceData?.perfectAttendance && <p className="border-t pt-4 text-sm text-gray-600">Perfect attendance for {attendanceData.perfectAttendance.totalPerfectWeeks} weeks.</p>}</CardContent></Card>
      </TabsContent>
    </Tabs>
  </div>
}

function Metric({ label, value, hint, icon, loading }: { label: string; value: string; hint: string; icon: React.ReactNode; loading: boolean }) {
  return <Card><CardContent className="flex items-center justify-between p-6"><div><p className="text-sm font-medium text-gray-600">{label}</p>{loading ? <div className="mt-2 h-7 w-24 animate-pulse rounded bg-gray-200" /> : <><p className="text-2xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-500">{hint}</p></>}</div>{icon}</CardContent></Card>
}

function Progress({ label, value, color }: { label: string; value: string | number; color: string }) {
  const width = Math.max(0, Math.min(100, Number(value) || 0))
  return <div><div className="mb-2 flex justify-between text-sm font-medium"><span>{label}</span><span>{value}%</span></div><div className="h-2 w-full rounded-full bg-gray-200"><div className={cn("h-2 rounded-full", color)} style={{ width: `${width}%` }} /></div></div>
}

export default withHOC(AttendancesPageProvider, AttendancePage)
