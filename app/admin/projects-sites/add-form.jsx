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

import {
  ProjectsSitesPageProvider,
  useProjectsSitesPageContext,
} from "./use-projects-sites";
import { validationSchema } from "./form-helper";

function ProjectsSitesForm({
  isAddDrawerOpen,
  setIsAddDrawerOpen,
}) {
  const { selectedProjectsSites, openEditDialog, handleAddProjectsSites } = useProjectsSitesPageContext();

  const getAddress = async (event, values, setFieldValue) => {
    event.preventDefault();
    const { latitude = "", longitude = "" } = values;
    if (!latitude || !longitude) {
      alert("Please enter latitude and longitude");
      return;
    }
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          "User-Agent": "my-next-app (your@email.com)",
        },
      }
    );
    const data = await res.json();
    // data.display_name,
    setFieldValue("address", data.display_name);
  };

  return (
    <Sheet open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
      <SheetTrigger asChild>
        <Button 
        onClick={()=>openEditDialog()}
        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Projects/Site
        </Button>
      </SheetTrigger>
      {/* max-w-3xl lg:w-1/2 md:w-1/2 sm:w-[600px]*/}

      <SheetContent className="max-w-3xl lg:w-1/2 md:w-3/4 xs:w-[100vw] overflow-y-auto">
        <SheetHeader className="space-y-3 pb-6">
          <SheetTitle className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            Add New Projects/Site
          </SheetTitle>
          <SheetDescription className="text-base">
            Enter the job site details below
          </SheetDescription>
        </SheetHeader>

        <Formik
          initialValues={selectedProjectsSites}
          validationSchema={validationSchema}
          onSubmit={handleAddProjectsSites}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
            resetForm,
          }) => {
            console.log({values, errors});

            return (
              <Form className="grid grid-cols-1 gap-4 space-y-8">
                {/* Personal Information Section */}
                <ScrollArea>
                  <div className="space-y-2">
                    <Label htmlFor="name">Project/Site Name</Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="Enter first name"
                      className={`transition-all ${
                        errors.name && touched.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    <ErrorMessage name="name">
                      {(msg) => (
                        <div className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name</Label>
                      <FormikInput
                        id="clientName"
                        name="clientName"
                        placeholder="Enter clientName"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientContact.phone">Contact Phone</Label>
                      <FormikInput
                        id="clientContact.phone"
                        name="clientContact.phone"
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientContact.email">Contact Email</Label>
                      <FormikInput
                        id="clientContact.email"
                        name="clientContact.email"
                        placeholder="Enter client email"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1">
                    <div>
                      <Label htmlFor="address">Address</Label>

                      <div className="flex gap-1">
                        <FormikInput
                          id="latitude"
                          name="latitude"
                          placeholder="latitude"
                        />
                        <FormikInput
                          id="longitude"
                          name="longitude"
                          placeholder="longitude"
                        />
                        <Button
                        className="w-16"
                          onClick={(e) => getAddress(e, values, setFieldValue)}
                        >
                          Fetch
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="col-span-2 space-y-2">
                      
                      <Field
                        as={Textarea}
                        id="address"
                        name="address"
                        placeholder="Enter full address"
                        rows={2}
                        className="transition-all resize-none focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="supervisor">Supervisor</Label>
                      <FormikCombobox
                        name="supervisor"
                        htmlFor="supervisor"
                        placeholder="Select supervisor"
                        lableString="fullName"
                        valueString="id"
                        options={[]}
                      />
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <FormikInput  name="startDate" id="startDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <FormikInput  name="endDate" id="endDate" type="date" />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="description">Description</Label>
                      
                      <Field
                        as={Textarea}
                        id="description"
                        name="description"
                        placeholder="Enter full description"
                        rows={2}
                        className="transition-all resize-none focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
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
                          Adding ...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          {values?.id ? "Update Project" : "Add Project"}
                        </>
                      )}
                    </Button>
                  </div>
                </ScrollArea>
              </Form>
            );
          }}
        </Formik>
      </SheetContent>
    </Sheet>
  );
}

export default ProjectsSitesForm;
