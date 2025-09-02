export default function DocumentViewer({ url, isExcel }) {
//   const isExcel = true || url.endsWith(".xls") || url.endsWith(".xlsx");
  const iframeSrc = isExcel
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
    // https://view.officeapps.live.com/op/embed.aspx?src=
    // 
    : url;
// https://unpkg.com/excel-viewer@1.0.0/dist/index.html?file=
  return (
    <iframe
      src={iframeSrc}
      className="flex-1 w-full min-h-full"
    //   width="100%"
    //   height="400px"
        draggable
      style={{ border: "none" }}
      title="Document Viewer"
    />
  );
}
