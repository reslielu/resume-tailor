import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Pull keywords that appear in both the JD and the tailored resume
function extractKeywords(jobDescription: string, tailored: string): string[] {
  const jdWords = new Set(
    jobDescription
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 4)
  );
  const resumeWords = tailored
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 4);

  const matches = [...new Set(resumeWords.filter((w) => jdWords.has(w)))];
  // Return the top 20 most interesting ones (exclude very common words)
  const stopWords = new Set([
    "about", "above", "after", "again", "their", "there", "these",
    "where", "which", "while", "would", "could", "should", "other",
    "being", "every", "those", "through", "within", "across",
  ]);
  return matches.filter((w) => !stopWords.has(w)).slice(0, 20);
}

export async function POST(req: NextRequest) {
  try {
    const { resume, jobDescription } = await req.json();

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Both resume and job description are required." },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GOOGLE_GEMINI_API_KEY is not set. See .env.local." },
        { status: 500 }
      );
    }

    // Initialize the Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    
    // gemini-1.5-flash is fast and cheap, ideal for this use case.
    // You can swap this to "gemini-1.5-pro" if you find it needs better reasoning.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert resume writer and career coach.

Your task is to rewrite the candidate's resume so it is a strong match for the job description below.

RULES:
- Never invent experience, credentials, or skills the candidate doesn't have
- Mirror the language and keywords from the job description naturally — don't stuff them in awkwardly
- Rewrite bullet points to lead with impact and quantifiable results where possible
- Prioritise the most relevant roles and skills higher in the document
- Keep the same overall structure (contact info, experience, education, skills) but tighten language
- Remove anything clearly irrelevant to this specific role
- Return ONLY the rewritten resume in clean markdown — no preamble, no commentary, no explanation

---

JOB DESCRIPTION:
${jobDescription}

---

RESUME:
${resume}`;

    // Generate the content using Gemini
    const result = await model.generateContent(prompt);
    const tailored = result.response.text();
    
    const keywords = extractKeywords(jobDescription, tailored);

    return NextResponse.json({ tailored, keywords });
  } catch (err: unknown) {
    console.error("Tailor API error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}