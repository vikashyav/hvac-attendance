const initialValuesEmp = {
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
}

export function getIntialValues(values) {
    return {
        ...values,
        firstName: values?.firstName||"",
        lastName: values?.lastName || "",
        email: values?.email || "",
        phone: values?.phone || "",
        department: values?.department || "",
        position: values?.position || "",
        location: values?.location || "",
        address: values?.address || "",
        emergencyContact: {
            name: values?.emergencyContact?.name || "",
            relationship: values?.emergencyContact?.relationship || "",
            phone: values?.emergencyContact?.phone || "",
        },
        // emergencyPhone: values?. || "",
        salary: values?.salary || "",
        hireDate: values?.hireDate || "",
        notes: values?.notes || "",
    }
}
