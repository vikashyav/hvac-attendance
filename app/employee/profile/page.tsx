"use client"
// at top of your page file
export const dynamic = "force-dynamic";

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, Award, Bell, Shield, Save, Upload, Edit, AlertCircle } from "lucide-react"
import { useUserFromStorage } from "@/hooks/user.context"
import { UserProfileProvider, useUserProfilePageContext } from "./use-profile";
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as yup from 'yup';
import withHOC from "@/utils/with-hoc"

// export async function getData(context) {
//   console.log("context", context);
  
//   return context
// }

// export default 
function ProfilePage(props: any) {
  const { user } = useUserFromStorage();
  const useCtx = useUserProfilePageContext as (p?: any) => any;
  const { handleChangePassword, queryParmas } = useCtx(props);
  const [activeTab, setActiveTab]=useState("");
  const isEditing = false

  const validationSchema = yup.object({
    currentPassword: yup.string().required('Password is required'),
    newPassword: yup
      .string()
      .required('Password is required')
      .min(6, 'Your password is too short.')
      .matches(/[a-zA-Z0-9]/, 'Password can only contain Latin letters.'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'Passwords must match')
  });
  const employeeData = {
    ...user,
    ...user.employee,
    name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "Employee",
    skills: Array.isArray(user.employee?.skills) ? user.employee.skills : [],
    certifications: Array.isArray(user.employee?.certifications) ? user.employee.certifications : [],
  }

  const getCertificationStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Expiring Soon":
        return "secondary"
      case "Expired":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">View your employee record and manage your password</p>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs 
      defaultValue={props?.searchParams?.acive_tab || queryParmas?.acive_tab || "personal"}
      value={activeTab || props?.searchParams?.acive_tab || queryParmas?.acive_tab || "personal"}
      onValueChange={setActiveTab}
      className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                      {employeeData.name
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" disabled={!isEditing}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-lg">{employeeData.name}</h3>
                  <p className="text-muted-foreground">{employeeData.position}</p>
                  <Badge variant="outline">{employeeData.id}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your recorded details. Contact your administrator to request changes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue={user.firstName}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue={user.lastName}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={employeeData.email}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    defaultValue={employeeData.phone}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    defaultValue={employeeData.address}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Emergency Contact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input
                        id="emergencyName"
                        defaultValue={employeeData?.emergencyContact?.name}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input
                        id="relationship"
                        defaultValue={employeeData?.emergencyContact?.relationship}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      defaultValue={employeeData?.emergencyContact?.phone}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          {/* <Badge variant="destructive" className="w-full whitespace-nowrap">
            Work Under Progress - we are working on this module
          </Badge> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <Card>

              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
                <CardDescription>Your job information and work details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    defaultValue={employeeData.position}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={employeeData.department || "Not recorded"} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Input id="supervisor" defaultValue={employeeData.supervisor} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input
                    id="hireDate"
                    defaultValue={employeeData.hireDate ? new Date(employeeData.hireDate + "T00:00:00").toLocaleDateString() : "Not recorded"}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skills & Expertise</Label>
                  <div className="flex flex-wrap gap-2">
                    {employeeData.skills.length === 0 && <p className="text-sm text-muted-foreground">No skills recorded.</p>}
                    {employeeData.skills.map((skill: any, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Your key performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">View your current attendance, punctuality, and recorded working hours.</p>
                <Button asChild variant="outline"><Link href="/employee/performance">View Attendance Performance</Link></Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          {/* <Badge variant="destructive" className="w-full whitespace-nowrap">
            Work Under Progress - we are working on this module
          </Badge> */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Professional Certifications
              </CardTitle>
              <CardDescription>Your current certifications and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeeData.certifications.length === 0 && <p className="text-sm text-muted-foreground">No certifications recorded.</p>}
                {employeeData.certifications.map((cert: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <h4 className="font-medium">{cert.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Issued: {new Date(cert.issueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={getCertificationStatusColor(cert.status)}>{cert.status}</Badge>
                    </div>
                    {cert.status === "Expiring Soon" && (
                      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          This certification expires soon. Please renew to maintain compliance.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {user.isDefaultPassword && <Badge variant="destructive" className="w-full whitespace-nowrap">
            You have sign in from default password, Please change it.
          </Badge>}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Formik
                    initialValues={{
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: ""
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleChangePassword}
                  >
                    {({ values, errors, touched, isSubmitting, setFieldValue, resetForm }) => {
                      // console.log({ values, errors });

                      return (
                        <Form className="space-y-8">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            {/* <Input id="currentPassword" type="password" placeholder="Enter current password" /> */}
                            <Field
                              as={Input}
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              autoComplete="current-password"
                              placeholder="Current password"
                              className={`transition-all ${errors.currentPassword && touched.currentPassword
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : "focus:border-blue-500 focus:ring-blue-500"
                                }`}
                            />
                            <ErrorMessage name="currentPassword">
                              {(msg) => (
                                <div className="text-red-500 text-sm flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {msg}
                                </div>
                              )}
                            </ErrorMessage>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            {/* <Input id="newPassword" type="password" placeholder="Enter new password" /> */}
                            <Field
                              as={Input}
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              autoComplete="new-password"
                              placeholder="New password"
                              className={`transition-all ${errors.newPassword && touched.newPassword
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : "focus:border-blue-500 focus:ring-blue-500"
                                }`}
                            />
                            <ErrorMessage name="newPassword">
                              {(msg) => (
                                <div className="text-red-500 text-sm flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {msg}
                                </div>
                              )}
                            </ErrorMessage>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            {/* <Input id="confirmPassword" type="password" placeholder="Confirm new password" /> */}
                            <Field
                              as={Input}
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              autoComplete="new-password"
                              placeholder="Confirm new password"
                              className={`transition-all ${errors.confirmPassword && touched.confirmPassword
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : "focus:border-blue-500 focus:ring-blue-500"
                                }`}
                            />
                            <ErrorMessage name="confirmPassword">
                              {(msg) => (
                                <div className="text-red-500 text-sm flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {msg}
                                </div>
                              )}
                            </ErrorMessage>
                          </div>
                          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Updating…" : "Update Password"}</Button>
                        </Form>)
                    }}
                  </Formik>
                </div>

                <p className="text-sm text-muted-foreground">Two-factor authentication and notification preferences are not available yet. Attendance location requirements are managed by your company.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default withHOC(UserProfileProvider, ProfilePage);
