const initialValuesEmp = {
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    confirmed:""
}

export function getIntialValues(values) {
    return {
        ...values,
        leaveType: values?.leaveType || "",
        startDate: values?.startDate || "",
        endDate: values?.endDate || "",
        reason: values?.reason || "",
        confirmed:""
    }
}
