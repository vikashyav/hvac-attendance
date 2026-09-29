import { useState } from "react"
import { downloadpdfReports, downloadReports } from "@/lib/api/dashboard-api";
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useMutation } from "@tanstack/react-query"
import moment from "moment"
import { useSearchParams } from "next/navigation";
import { useUserFromStorage } from "@/hooks/user.context";
import { useCapabilities } from "@/hooks/use-capabilities";

export function useReports() {
    const searchParams = useSearchParams();
    const notificationModal = useNotificationModalContext();
    const { user } = useUserFromStorage();
    const capabilities = useCapabilities();

    const permissions = capabilities.isSuccess ? capabilities.data?.data?.data?.permissions || [] : [];
    const canViewReports = permissions.includes('report.view') || user?.role === 'superAdmin' || user?.role === 'admin';

    const [dateRange, setDateRange] = useState({
        from: moment().startOf('month').toDate(),
        to: moment().endOf('day').toDate(),
    })
    const [reportType, setReportType] = useState("attendance")
    const [selectedSite, setSelectedSite] = useState("all")
    const [reportFormat, setReportFormat] = useState("excel");
    const [reportPreviewUrl, setReportPreviewUrl] = useState("");

    const downloadReportsQuery = useMutation({
        mutationFn: downloadReports
    });
    const downloadPdfReportsQuery = useMutation({
        mutationFn: downloadpdfReports
    });

    const handleGenerateReport = () => {
        if (!canViewReports) {
            notificationModal.error({ heading: "Permission Denied", body: "You do not have permission to view or download reports." });
            return;
        }
        notificationModal.progress({
            heading: `Please await downloading report...`,
        });
        const apiCall = reportFormat === "pdf" ? downloadPdfReportsQuery : downloadReportsQuery;
        apiCall.mutate({
            queryKey: {
                from: searchParams?.get("from") || moment(dateRange.from).format("YYYY-MM-DD"),
                to: searchParams?.get("to") || moment(dateRange.to).format("YYYY-MM-DD")
            },
        }, {
            onSuccess: async (response) => {
                const disposition = response?.headers?.["content-disposition"];
                let filename = reportFormat === "pdf" ? "attendance-report.pdf" : "attendance-report.xlsx";

                if (disposition && disposition.indexOf("filename=") !== -1) {
                    const matches = disposition.match(/filename="?([^"]+)"?/);
                    if (matches != null && matches[1]) {
                        filename = matches[1];
                    }
                }
                const blob = new Blob([response?.data], {
                    type: response?.headers?.["content-type"] || (reportFormat === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
                });
                const url = window.URL.createObjectURL(blob);
                setReportPreviewUrl(url);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                notificationModal.success({ heading: "Success", body: "Report downloaded successfully." });
            },
            onError: (error) => {
                const msg = error?.response?.status === 403
                    ? "Report viewing permission denied."
                    : (error?.response?.data?.error || error?.message || "Failed to download report.");
                notificationModal.error({ heading: "Report Generation Failed", body: msg });
            }
        });
    };

    return {
        dateRange, setDateRange, reportType, setReportType, selectedSite,
        reportPreviewUrl, setSelectedSite, handleGenerateReport, setReportFormat, reportFormat,
        canViewReports,
        capabilitiesLoading: capabilities.isLoading,
        capabilitiesError: capabilities.isError,
        capabilitiesRefetch: capabilities.refetch,
    };
}