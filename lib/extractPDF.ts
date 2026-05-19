// Extracts plain text from an uploaded PDF file (client-side only).
// Uses the browser's FileReader + a lightweight approach via the
// /api/extract-pdf server route, which uses pdf-parse.

export async function extractTextFromPDF(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/extract-pdf", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to extract PDF text");
  }

  const data = await res.json();
  return data.text as string;
}
