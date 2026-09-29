import { Phone } from "lucide-react";
import * as Yup from "yup";
const initialValuesEmp = {
    "title": "",
    "taskDescription": "",
    "assignTo": "",
    ProjectsSiteId: "",
    type: "",
    startDate: "",
    startTime: "",
    priority: "",
    status: "",
    estimatedHours: "",
}

export function getIntialValues(values = {}) {
    const formValue = {};
    Object.keys(initialValuesEmp).forEach((key, index) => {
        if (!formValue[key]) {
            formValue[key] = values[key] || ""
        }
    })
    if (values?.id) {
        formValue.id = values?.id
    }
    return {
        parentId: values.parentId || null,
        ...formValue
    }
}


export const validationSchema = Yup.object({
    title: Yup.string()
        .required("title is required"),
});