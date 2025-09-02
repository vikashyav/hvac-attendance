import { useState } from "react"
import { downloadpdfReports, downloadReports, getAdminDashboardStats } from "@/lib/api/dashboard-api";
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import moment from "moment"
import { useSearchParams } from "next/navigation";

export function useReports() {
    const searchParams = useSearchParams()//.getAll();
    const notificationModal = useNotificationModalContext();
    const [dateRange, setDateRange] = useState({
        // from: new Date(2024, 0, 1),
        // to: new Date(),
        from: moment().startOf('month').toDate(),
        to: moment().endOf('day' || 'month').toDate(),
    })
    const [reportType, setReportType] = useState("attendance")
    const [selectedSite, setSelectedSite] = useState("all")
    const [reportFormat, setReportFormat]=useState("excel");
    const [reportPreviewUrl, setReportPreviewUrl]=useState("");
    const downloadReportsQuery = useMutation({
        mutationFn: downloadReports
    });
    const downloadPdfReportsQuery = useMutation({
        mutationFn: downloadpdfReports
    })

    const handleGenerateReport = () => {
        notificationModal.progress({
            heading: `Please await downloading report...`,
        });
        const apiCall= reportFormat === "pdf" ? downloadPdfReportsQuery : downloadReportsQuery;
        apiCall.mutate({
            queryKey: {
                from: searchParams.get("from") || moment(dateRange.from).format("YYYY-MM-DD"),
                to: searchParams.get("to") || moment(dateRange.to).format("YYYY-MM-DD")
            },
        }, {
            onSuccess: async (response) => {
                const disposition = response.headers["content-disposition"];
                let filename = "downloaded-file";

                if (disposition && disposition.indexOf("filename=") !== -1) {
                    const matches = disposition.match(/filename="?([^"]+)"?/);
                    if (matches != null && matches[1]) {
                        filename = matches[1];
                    }
                }
                // const fileURL = generateFileUrl(res?.data, res.headers["content-type"]);
                // downloadOrPreviewFileUrl(fileURL, `Files(${contractReviewId})`, { type: res.headers["content-type"] });
                // const blob = await response?.data.blob();
                const blob = new Blob([response?.data], {
                    type: response.headers["content-type"],
                });
                const url = window.URL.createObjectURL(blob);
                setReportPreviewUrl(`${url}${reportFormat === "pdf" ? "":".xlsx"}`);
                const link = document.createElement('a');
                link.href = url;

                link.setAttribute('download', filename ||'attendance-report.xlsx'); // filename
                document.body.appendChild(link);
                link.click();

                link.parentNode.removeChild(link);
                // window.URL.revokeObjectURL(url);
                notificationModal.success({ heading: "Success" });
            },
            onError: (error) => {
                console.log(error);

                notificationModal.error({ heading: "failed Something went wrong!!!" });
            }
        })
    }
    return {
        dateRange, setDateRange, reportType, setReportType, selectedSite,
        reportPreviewUrl, setSelectedSite, handleGenerateReport, setReportFormat, reportFormat
    }
}