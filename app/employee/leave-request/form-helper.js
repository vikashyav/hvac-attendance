export const LEAVE_TYPES = ["CASUAL", "SICK", "ANNUAL", "UNPAID", "OTHER"];

export const LEAVE_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

export function getIntialValues(values) {
    return {
        id: values?.id || undefined,
        leaveType: values?.leaveType || "CASUAL",
        startDate: values?.startDate || "",
        endDate: values?.endDate || "",
        reason: values?.reason || "",
        confirmed: false,
        status: values?.status || "PENDING"
    };
}
