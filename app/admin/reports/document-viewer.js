
export default function DocumentViewer({ url, isExcel }) {
  //   const isExcel = true || url.endsWith(".xls") || url.endsWith(".xlsx");
  const iframeSrc = isExcel
    ? `https://unpkg.com/excel-viewer@1.0.0/dist/index.html?file=${url}`
    // https://view.officeapps.live.com/op/embed.aspx?src=
    // 
    : url;
  // https://unpkg.com/excel-viewer@1.0.0/dist/index.html?file=${encodeURIComponent(url)}
  // "https://file-examples.com/wp-content/storage/2017/02/file_example_XLS_10.xls" 
  return (
    <>
      <iframe
        src={iframeSrc}
        className="flex-1 w-full min-h-full"
          width="100%"
          height="400px"
        draggable
        style={{ border: "none" }}
        title="Document Viewer"
      />
    </>
  );
}
