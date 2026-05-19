import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);

    return NextResponse.json({ text: parsed.text });
  } catch (err: unknown) {
    console.error("PDF extraction error:", err);
    return NextResponse.json(
      { error: "Failed to parse PDF." },
      { status: 500 }
    );
  }
}
