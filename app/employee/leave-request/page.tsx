"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Grid3X3,
  List,
  Mail,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Check,
  X,
  RefreshCw,
} from "lucide-react"
import LeaveRequestForm from "./add-form"
import withHOC from "@/utils/with-hoc"
import { useEmployeesPageContext, EmployeesPageProvider } from "./use-leaveRequest"
import LeaveRequestCardSkeleton from "./card-skeleton"

interface LeaveRequestItem {
  id: string
  userId: string
  fullName?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  leaveType: string
  startDate: string
  endDate: string
  days: number
  status: "PENDING" | "APPROVED" | "REJECTED"
  reason?: string
  remarks?: string
  isActive?: boolean
}

function LeaveManagementPage() {
  const useLeaveContext = useEmployeesPageContext as () => any
  const {
    view, setView,
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    typeFilter, setTypeFilter,
    isAddDrawerOpen, setIsAddDrawerOpen,
    filteredEmployees,
    handleAddEmployee,
    openEditDialog,
    employeeData,
    isFetching,
    user,
    isAdmin,
    canApprove,
    capabilities,
    refetch,
    leaveRequestUpdateByAdmin,
    setLeaveRequestUpdateByAdmin,
    handleLeaveRequestUpdateByAdmin,
    LEAVE_TYPES,
  } = useLeaveContext()

  const requests: LeaveRequestItem[] = filteredEmployees || []
  const allRequests: LeaveRequestItem[] = employeeData || []

  const totalCount = allRequests.length
  const pendingCount = allRequests.filter((r) => r.status === "PENDING").length
  const approvedCount = allRequests.filter((r) => r.status === "APPROVED").length
  const rejectedCount = allRequests.filter((r) => r.status === "REJECTED").length

  const handleAdminRemarksChange = (requestId: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setLeaveRequestUpdateByAdmin({
      ...leaveRequestUpdateByAdmin,
      [requestId]: {
        remarks: value,
      },
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">{status}</Badge>
      case "REJECTED":
        return <Badge variant="destructive" className="font-medium">{status}</Badge>
      case "PENDING":
      default:
        return <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400 font-medium">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground">
            Submit and track time off requests, and review team applications.
          </p>
        </div>
        <LeaveRequestForm
          isAddDrawerOpen={isAddDrawerOpen}
          setIsAddDrawerOpen={setIsAddDrawerOpen}
          handleAddEmployee={handleAddEmployee}
        />
      </div>

      {/* Permission & Capability Alerts */}
      {capabilities.isLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Checking leave approval permissions...</span>
        </div>
      )}

      {capabilities.isError && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Unable to verify leave approval permissions.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => capabilities.refetch()}
            className="h-8 gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry permissions
          </Button>
        </div>
      )}

      {canApprove && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/70 p-3 text-sm text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
          <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>You have approver access. You can review and decide company leave requests.</span>
        </div>
      )}

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-[260px]"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {(LEAVE_TYPES || []).map((type: string) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 self-end sm:self-auto">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("table")}
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs value={view} onValueChange={(value) => setView(value as "grid" | "table")}>
        <TabsContent value="table" className="space-y-4 m-0">
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isFetching && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span>Loading leave requests...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {!isFetching && requests.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No leave requests found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}

                    {!isFetching &&
                      requests.map((request) => {
                        const isOwn = request.userId === user?.id
                        const canDecide = canApprove && !isOwn && request.status === "PENDING"
                        const canEdit = isOwn && request.status === "PENDING"

                        return (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-medium text-xs text-primary">
                                  {(request.fullName || "User")
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-sm flex items-center gap-1.5">
                                    {request.fullName || "Applicant"}
                                    {isOwn && (
                                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{request.email || "No email"}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-medium">{request.leaveType}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {request.startDate} to {request.endDate}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-semibold">{request.days}</span>
                            </TableCell>
                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {canEdit && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditDialog(request)}
                                    className="h-8 gap-1 text-xs"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                    Edit
                                  </Button>
                                )}

                                {canDecide && (
                                  <div className="flex gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleLeaveRequestUpdateByAdmin(request, "APPROVED")}
                                      className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                                      aria-label={`Approve ${request.fullName || "request"}`}
                                    >
                                      <Check className="h-3.5 w-3.5 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleLeaveRequestUpdateByAdmin(request, "REJECTED")}
                                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                                      aria-label={`Reject ${request.fullName || "request"}`}
                                    >
                                      <X className="h-3.5 w-3.5 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}

                                {canApprove && isOwn && request.status === "PENDING" && (
                                  <span className="text-xs text-muted-foreground italic">
                                    Self-approval not permitted
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isFetching && (
              <>
                <LeaveRequestCardSkeleton isAdmin={Boolean(canApprove)} />
                <LeaveRequestCardSkeleton isAdmin={Boolean(canApprove)} />
                <LeaveRequestCardSkeleton isAdmin={Boolean(canApprove)} />
              </>
            )}

            {!isFetching && requests.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg bg-card">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No leave requests found</p>
                <p className="text-sm mt-1">There are no leave requests matching your current filter criteria.</p>
              </div>
            )}

            {!isFetching &&
              requests.map((request) => {
                const isOwn = request.userId === user?.id
                const canDecide = canApprove && !isOwn && request.status === "PENDING"
                const canEdit = isOwn && request.status === "PENDING"

                return (
                  <Card key={request.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center font-medium text-xs text-primary shrink-0">
                              {(request.fullName || "User")
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <CardTitle className="text-base truncate flex items-center gap-1.5">
                                {request.fullName || "Applicant"}
                                {isOwn && (
                                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-normal">
                                    You
                                  </span>
                                )}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground truncate">{request.id}</p>
                            </div>
                          </div>
                          <div className="shrink-0">{getStatusBadge(request.status)}</div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Mail className="mr-2 h-4 w-4 shrink-0" />
                            <span className="truncate">{request.email || "No email available"}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{request.leaveType}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-medium">
                              {request.days} {request.days === 1 ? "Day" : "Days"}
                            </span>
                          </div>

                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                            <span>
                              {request.startDate} to {request.endDate}
                            </span>
                          </div>
                        </div>

                        {request.reason && (
                          <div className="pt-2 border-t text-sm">
                            <span className="text-xs font-medium text-muted-foreground block mb-1">Reason:</span>
                            <p className="text-xs text-foreground bg-muted/30 p-2 rounded whitespace-pre-wrap line-clamp-3 hover:line-clamp-none">
                              {request.reason}
                            </p>
                          </div>
                        )}

                        {request.remarks && (
                          <div className="pt-1 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Decision Remarks: </span>
                            {request.remarks}
                          </div>
                        )}
                      </CardContent>
                    </div>

                    <div className="p-4 pt-0 space-y-3">
                      {canApprove && (
                        <div>
                          {isOwn ? (
                            <p className="text-xs text-muted-foreground italic text-center py-2 bg-muted/40 rounded">
                              Self-approval is not permitted for your own leave request.
                            </p>
                          ) : request.status === "PENDING" ? (
                            <div className="space-y-2">
                              <Label htmlFor={`remarks-${request.id}`} className="text-xs font-medium">
                                Review Remarks
                              </Label>
                              <Textarea
                                id={`remarks-${request.id}`}
                                name="remarks"
                                placeholder="Add review notes or comments..."
                                value={leaveRequestUpdateByAdmin?.[request.id]?.remarks ?? (request.remarks || "")}
                                onChange={handleAdminRemarksChange(request.id)}
                                rows={2}
                                className="resize-none text-xs"
                              />
                              <div className="flex gap-2 pt-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                                  onClick={() => handleLeaveRequestUpdateByAdmin(request, "APPROVED")}
                                  disabled={request.status !== "PENDING" || isOwn}
                                >
                                  <Check className="mr-1.5 h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                                  onClick={() => handleLeaveRequestUpdateByAdmin(request, "REJECTED")}
                                  disabled={request.status !== "PENDING" || isOwn}
                                >
                                  <X className="mr-1.5 h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => openEditDialog(request)}
                        >
                          <Edit className="mr-1.5 h-3.5 w-3.5" />
                          Edit Request
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default withHOC(EmployeesPageProvider, LeaveManagementPage)
