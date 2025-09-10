"use client"

import { Formik, Form, Field, ErrorMessage } from "formik";
import React from 'react'
// import { FormikRichTextEditor } from "@/components/ui/rich-text-editor";
// import TaskEditor from "@/components/ckeditor";
import dynamic from 'next/dynamic';
const TaskEditor = dynamic(() => import("@/components/ckeditor"));
const { FormikRichTextEditor } = dynamic(() => import("@/components/ui/rich-text-editor"));

function TaskManage() {
  return (
    <div>
        <Formik
          initialValues={{}}
        //   validationSchema={{}}
        //   onSubmit={handleAddProjectsSites}
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
                      <FormikRichTextEditor id={`MAIN_SECTION`} name={`MAIN_SECTION`} />

              </Form>
            )}}
            </Formik>

             <TaskEditor 
            //  onChange={(data) => setTaskDetails(data)} 
             />
    </div>
  )
}

export default TaskManage