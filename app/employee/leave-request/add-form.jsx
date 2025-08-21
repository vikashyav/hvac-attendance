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
// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

// import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Grid3X3,
  List,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Briefcase,
  User,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

import fakeData from "@/constants/fake-data";
import { useEmployeesPageContext } from "./use-leaveRequest";
import { FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const validationSchema = Yup.object({
  leaveType: Yup.string().required("Department is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date().required("Start date is required"),
  reason: Yup.string().max(500, "Notes must be less than 500 characters"),
  confirmed: Yup.bool().required() // use bool instead of boolean
        .oneOf([true], "You must accept the terms and conditions")
});

function EmployeeForm({
  isAddDrawerOpen,
  setIsAddDrawerOpen,
  handleAddEmployee,
}) {
  const { leaveRequestData } = useEmployeesPageContext();
  const departments = fakeData.leaveType;
  const positions = fakeData.positions;

  const locations = fakeData.locations;
  // console.log({leaveRequestData});

  return (
    <Sheet open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
      <SheetTrigger asChild>
        <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Leave Request
        </Button>
      </SheetTrigger>
      <SheetContent className="lg:w-1/4 md:w-1/2 sm:w-[600px] overflow-y-auto">
        <SheetHeader className="space-y-3 pb-6">
          <SheetTitle className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            Request Time Off
          </SheetTitle>
          <SheetDescription className="text-base">
            Fill in the details below for new leave request
          </SheetDescription>
        </SheetHeader>

        <Formik
          initialValues={leaveRequestData}
          validationSchema={validationSchema}
          onSubmit={handleAddEmployee}
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

            return (
              <Form className="space-y-8">
                {/* Work Information Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="leaveType"
                        className="text-sm font-medium"
                      >
                        Leave Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={values.leaveType}
                        onValueChange={(value) => {
                          setFieldValue("leaveType", value);
                          setFieldValue("position", ""); // Reset position when leaveType changes
                        }}
                      >
                        <SelectTrigger
                          className={`transition-all ${
                            errors.leaveType && touched.leaveType
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        >
                          <SelectValue placeholder="Select leaveType" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
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
                        <Label
                          htmlFor="startDate"
                          className="text-sm font-medium"
                        >
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
                        <Label
                          htmlFor="endDate"
                          className="text-sm font-medium"
                        >
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
                </div>

                {/* Additional Notes Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-sm font-medium">
                      Reason/Application content
                    </Label>
                    <Field
                      as={Textarea}
                      id="reason"
                      name="reason"
                      placeholder="Any additional reason about the employee..."
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
                      {values?.reason?.length}/500 characters
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Field
                      // as={Checkbox}
                      id="confirmed"
                      type="checkbox"
                      name="confirmed"
                      // rows={4}
                      className="cursor-pointer transition-all resize-none focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Label htmlFor="confirmed" className="pl-2 text-sm font-medium">
                      I confirm this request follows company policy
                    </Label>
                    <ErrorMessage name="confirmed">
                      {(msg) => (
                        <div className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                {/* <FormField
                  // control={form.control}
                  name="confirmed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-slate-700">
                          I confirm this request follows company policy
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Form Actions */}
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
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding Employee...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {values?.id ? "Update Employee" : "Add Employee"}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </SheetContent>
    </Sheet>
  );
}

export default EmployeeForm;
