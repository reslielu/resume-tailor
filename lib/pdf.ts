// Generates and downloads a PDF from the tailored resume markdown text.
// Uses jsPDF for simplicity. For richer formatting (bold headers, custom fonts),
// consider swapping this for @react-pdf/renderer.

export function downloadPDF(markdownText: string): void {
  // Lazy-import jsPDF so it's only loaded client-side
  import("jspdf").then(({ default: jsPDF }) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const usableWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    let cursorY = margin;

    // Strip markdown symbols for clean PDF text
    const lines = markdownText
      .split("\n")
      .map((line) => {
        // Detect headings
        if (/^#{1,3} /.test(line)) {
          return { text: line.replace(/^#+\s/, ""), bold: true, size: 13 };
        }
        // Bold inline text (simplified — strips ** markers)
        const cleaned = line.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
        return { text: cleaned, bold: false, size: 10 };
      });

    for (const line of lines) {
      doc.setFontSize(line.size);
      doc.setFont("helvetica", line.bold ? "bold" : "normal");

      if (line.text.trim() === "") {
        cursorY += lineHeight * 0.5;
        continue;
      }

      const wrapped = doc.splitTextToSize(line.text, usableWidth);

      for (const segment of wrapped) {
        if (cursorY + lineHeight > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(segment, margin, cursorY);
        cursorY += lineHeight;
      }

      if (line.bold) cursorY += 2; // Extra space after headings
    }

    doc.save("tailored-resume.pdf");
  });
}
