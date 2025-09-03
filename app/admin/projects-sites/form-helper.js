import { Phone } from "lucide-react";
import * as Yup from "yup";
const initialValuesEmp = {
    name: "",
    client: "",
    latitude: "",
    longitude: "",
    address: "",
    coordinates:"",
    clientName:"",
    clientContact:{
        Phone:"",
        email:""
    },
    startDate:"",
    endDate:"",
    description:"",
}

export function getIntialValues(values={}) {
    const formValue= {};
    Object.keys(initialValuesEmp).forEach((key, index)=>{
        if (!formValue[key]) {
            formValue[key]= values[key] || ""
        }
    })
    return {
        ...values,
      ...formValue
    }
}


export const validationSchema = Yup.object({
  name: Yup.string()
    .required("project name is required"),
});