import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates a PDF document from table data.
 *
 * @param {Array<{prop: string, label: string}>} headers - An array of strings representing the table headers.
 * @param {Array<object>} data - An array of objects representing the table rows, where each object should have keys corresponding to the headers.
 */
export default async function generateTablePdf(
  headers,
  data,
  reportName,
  params
) {
  const doc = new jsPDF();
  doc.setFont("Helvetica")

  let currY = 15;

  doc.setFontSize(18);
  doc.text(params.title, doc.internal.pageSize.getWidth() / 2, currY, { align: "center", fontStyle: "bold" });

  currY += 10;

  doc.setFontSize(10);
  params.paramValues?.forEach((itm) => {
    doc.text(itm.label + ": " + itm.value, 14, currY);
    currY += 6;
  });

  autoTable(doc, {
    head: [
      headers.map((header) => ({
        content: header.label,
        styles: {
          fontSize: 10,
          fillColor: "#2a81a0",
          fontStyle: "normal",
          textColor: "white",
        },
      })),
    ],
    body: data.map((row) =>
      headers.map((header) => ({
        content: row[header.prop],
        styles: { fontSize: 8 },
      }))
    ),
    theme: "grid",
    startY: currY,
  });

  doc.save(reportName);
}
