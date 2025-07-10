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

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[+]?[1-9][\d]{0,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  department: Yup.string().required("Department is required"),
  position: Yup.string().required("Position is required"),
  location: Yup.string().required("Work location is required"),
  address: Yup.string().required("Address is required"),
  emergencyContact: Yup.object({
    name: Yup.string().required("Emergency contact name is required"),
    relationship: Yup.string().required("Emergency relationship is required"),
    phone: Yup.string()
      .matches(/^[+]?[1-9][\d]{0,15}$/, "Invalid emergency phone number")
      .required("Emergency phone is required"),
  }),
  salary: Yup.number()
    .positive("Salary must be positive")
    .required("Salary is required"),
  hireDate: Yup.date().required("Start date is required"),
  notes: Yup.string().max(500, "Notes must be less than 500 characters"),
});

function EmployeeForm({
  isAddDrawerOpen,
  setIsAddDrawerOpen,
  handleAddEmployee,
}) {
  const departments = fakeData.departments;
  const positions = fakeData.positions;

  const locations = fakeData.locations;
  return (
    <Sheet open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
      <SheetTrigger asChild>
        <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </SheetTrigger>
      <SheetContent className="lg:w-1/4 md:w-1/2 sm:w-[600px] overflow-y-auto">
        <SheetHeader className="space-y-3 pb-6">
          <SheetTitle className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            Add New Employee
          </SheetTitle>
          <SheetDescription className="text-base">
            Fill in the details below to add a new team member to your
            organization.
          </SheetDescription>
        </SheetHeader>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            department: "",
            position: "",
            location: "",
            address: "",
            emergencyContact: {
              name: "",
              relationship: "",
              phone: "",
            },
            emergencyPhone: "",
            salary: "",
            hireDate: "",
            notes: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddEmployee}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue, resetForm }) => {
            console.log(values);

            return (
              <Form className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-border">
                    <User className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-lg">
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium"
                        >
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="firstName"
                          name="firstName"
                          placeholder="Enter first name"
                          className={`transition-all ${
                            errors.firstName && touched.firstName
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                        <ErrorMessage name="firstName">
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
                          htmlFor="lastName"
                          className="text-sm font-medium"
                        >
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="lastName"
                          name="lastName"
                          placeholder="Enter last name"
                          className={`transition-all ${
                            errors.lastName && touched.lastName
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                        <ErrorMessage name="lastName">
                          {(msg) => (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        className={`transition-all ${
                          errors.email && touched.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      <ErrorMessage name="email">
                        {(msg) => (
                          <div className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="phone"
                        name="phone"
                        placeholder="+1 (555) 123-4567"
                        className={`transition-all ${
                          errors.phone && touched.phone
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      <ErrorMessage name="phone">
                        {(msg) => (
                          <div className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Home Address <span className="text-red-500">*</span>
                      </Label>
                      <Field
                        as={Textarea}
                        id="address"
                        name="address"
                        placeholder="Enter full address"
                        rows={3}
                        className={`transition-all resize-none ${
                          errors.address && touched.address
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      <ErrorMessage name="address">
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

                {/* Work Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-border">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-lg">Work Information</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="department"
                        className="text-sm font-medium"
                      >
                        Department <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={values.department}
                        onValueChange={(value) => {
                          setFieldValue("department", value);
                          setFieldValue("position", ""); // Reset position when department changes
                        }}
                      >
                        <SelectTrigger
                          className={`transition-all ${
                            errors.department && touched.department
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        >
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ErrorMessage name="department">
                        {(msg) => (
                          <div className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-medium">
                        Position <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={values.position}
                        onValueChange={(value) =>
                          setFieldValue("position", value)
                        }
                        disabled={!values.department}
                      >
                        <SelectTrigger
                          className={`transition-all ${
                            errors.position && touched.position
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        >
                          <SelectValue
                            placeholder={
                              values.department
                                ? "Select position"
                                : "Select department first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {values.department &&
                            positions[values.department]?.map((pos) => (
                              <SelectItem key={pos} value={pos}>
                                {pos}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <ErrorMessage name="position">
                        {(msg) => (
                          <div className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium">
                        Work Location <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={values.location}
                        onValueChange={(value) =>
                          setFieldValue("location", value)
                        }
                      >
                        <SelectTrigger
                          className={`transition-all ${
                            errors.location && touched.location
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        >
                          <SelectValue placeholder="Select work location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ErrorMessage name="location">
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
                          htmlFor="hireDate"
                          className="text-sm font-medium"
                        >
                          Start Date <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="hireDate"
                          name="hireDate"
                          type="date"
                          className={`transition-all ${
                            errors.hireDate && touched.hireDate
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                        <ErrorMessage name="hireDate">
                          {(msg) => (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salary" className="text-sm font-medium">
                          Annual Salary (INR){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="salary"
                          name="salary"
                          type="number"
                          placeholder="50000"
                          className={`transition-all ${
                            errors.salary && touched.salary
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                        <ErrorMessage name="salary">
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

                {/* Emergency Contact Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-border">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-lg">Emergency Contact</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="emergencyContact"
                        className="text-sm font-medium"
                      >
                        Contact Name <span className="text-red-500">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="emergencyContact.name"
                        name="emergencyContact.name"
                        placeholder="Enter emergency contact name"
                        className={`transition-all ${
                          errors.emergencyContact?.name &&
                          touched.emergencyContact?.name
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      <ErrorMessage name="emergencyContact.name">
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
                        htmlFor="emergencyContact.relationship"
                        className="text-sm font-medium"
                      >
                        Relationship <span className="text-red-500">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="emergencyContact.relationship"
                        name="emergencyContact.relationship"
                        placeholder="Enter relationship"
                        className={`transition-all ${
                          errors.emergencyContact?.relationship &&
                          touched.emergencyContact?.relationship
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      <ErrorMessage name="emergencyContact.relationship">
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
                        htmlFor="emergencyContact.phone"
                        className="text-sm font-medium"
                      >
                        Contact Phone <span className="text-red-500">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="emergencyContact.phone"
                        name="emergencyContact.phone"
                        placeholder="+1 (555) 987-6543"
                        className={`transition-all ${
                          errors.emergencyContact?.phone &&
                          touched.emergencyContact?.phone
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      <ErrorMessage name="emergencyContact.phone">
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

                {/* Additional Notes Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-border">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-lg">
                      Additional Information
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium">
                      Notes (Optional)
                    </Label>
                    <Field
                      as={Textarea}
                      id="notes"
                      name="notes"
                      placeholder="Any additional notes about the employee..."
                      rows={4}
                      className="transition-all resize-none focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="notes">
                      {(msg) => (
                        <div className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                    <p className="text-xs text-muted-foreground">
                      {values.notes.length}/500 characters
                    </p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-row gap-3 pt-6 border-t border-border">
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsAddDrawerOpen(false)}}
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
                        Add Employee
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
