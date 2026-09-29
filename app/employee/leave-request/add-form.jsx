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
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { useEmployeesPageContext } from "./use-leaveRequest";
import { LEAVE_TYPES, getIntialValues } from "./form-helper";

const validationSchema = Yup.object({
  leaveType: Yup.string().required("Leave type is required"),
  startDate: Yup.string().required("Start date is required"),
  endDate: Yup.string()
    .required("End date is required")
    .test("is-after-start", "End date must not precede start date", function (value) {
      const { startDate } = this.parent;
      return !startDate || !value || value >= startDate;
    }),
  reason: Yup.string().max(500, "Reason must be less than 500 characters"),
  confirmed: Yup.bool()
    .required()
    .oneOf([true], "Please confirm your leave request"),
});

export function LeaveRequestForm({
  isAddDrawerOpen,
  setIsAddDrawerOpen,
  handleAddEmployee,
}) {
  const { leaveRequestData, setLeaveRequestData } = useEmployeesPageContext();

  return (
    <Sheet open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
      <SheetTrigger asChild>
        <Button
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          onClick={() => setLeaveRequestData(getIntialValues({}))}
        >
          <Plus className="mr-2 h-4 w-4" />
          Leave Request
        </Button>
      </SheetTrigger>
      <SheetContent className="lg:w-1/4 md:w-1/2 sm:w-[600px] overflow-y-auto">
        <SheetHeader className="space-y-3 pb-6">
          <SheetTitle className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            {leaveRequestData?.id ? "Edit Leave Request" : "Request Time Off"}
          </SheetTitle>
          <SheetDescription className="text-base">
            {leaveRequestData?.id
              ? "Update your pending leave request details."
              : "Fill in the details below to submit a new leave request."}
          </SheetDescription>
        </SheetHeader>

        <Formik
          initialValues={leaveRequestData}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleAddEmployee}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
            resetForm,
          }) => (
            <Form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType" className="text-sm font-medium">
                    Leave Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={values.leaveType}
                    onValueChange={(value) => setFieldValue("leaveType", value)}
                  >
                    <SelectTrigger
                      className={`transition-all ${
                        errors.leaveType && touched.leaveType
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    >
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAVE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="leaveType">
                    {(msg) => (
                      <div className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="startDate"
                      name="startDate"
                      type="date"
                      className={`transition-all ${
                        errors.startDate && touched.startDate
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    <ErrorMessage name="startDate">
                      {(msg) => (
                        <div className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium">
                      End Date <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="endDate"
                      name="endDate"
                      type="date"
                      className={`transition-all ${
                        errors.endDate && touched.endDate
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    <ErrorMessage name="endDate">
                      {(msg) => (
                        <div className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium">
                  Reason for Request
                </Label>
                <Field
                  as={Textarea}
                  id="reason"
                  name="reason"
                  placeholder="Provide reason for time off request..."
                  rows={4}
                  className="transition-all resize-none focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="reason">
                  {(msg) => (
                    <div className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
                <p className="text-xs text-muted-foreground">
                  {values?.reason?.length || 0}/500 characters
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Field
                    id="confirmed"
                    type="checkbox"
                    name="confirmed"
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="confirmed" className="cursor-pointer text-sm font-medium">
                    I confirm this request follows company policy
                  </Label>
                </div>
                <ErrorMessage name="confirmed">
                  {(msg) => (
                    <div className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div className="flex flex-row gap-3 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddDrawerOpen(false);
                  }}
                  className="w-full"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || (values?.id && values.status !== "PENDING")}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {values?.id ? "Update Request" : "Submit Request"}
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </SheetContent>
    </Sheet>
  );
}

export default LeaveRequestForm;
