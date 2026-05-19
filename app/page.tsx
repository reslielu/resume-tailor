"use client";

import { useState, useRef } from "react";
import { downloadPDF } from "@/lib/pdf";
import { extractTextFromPDF } from "@/lib/extractPDF";

type Status = "idle" | "loading" | "done" | "error";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [uploadLabel, setUploadLabel] = useState("Upload PDF instead");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLabel("Extracting text...");
    try {
      const text = await extractTextFromPDF(file);
      setResume(text);
      setUploadLabel(`Loaded: ${file.name}`);
    } catch {
      setUploadLabel("Upload failed — paste manually");
    }
  }

  async function tailor() {
    if (!resume.trim() || !jobDescription.trim()) return;
    setStatus("loading");
    setError("");
    setResult("");
    setKeywords([]);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      setResult(data.tailored);
      setKeywords(data.keywords || []);
      setStatus("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result);
  }

  const canTailor =
    status !== "loading" && resume.trim() && jobDescription.trim();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Resume Tailor</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              AI-powered resume customisation for every job application
            </p>
          </div>
          <a
            href="https://github.com"
            className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Input grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Resume input */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Your resume
              </label>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                {uploadLabel}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <textarea
              className="w-full h-56 text-sm font-mono text-gray-800 resize-none focus:outline-none placeholder-gray-300"
              placeholder={"Paste your resume here...\n\nOr use the 'Upload PDF' button above."}
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              {resume.length > 0 ? `${resume.split(/\s+/).filter(Boolean).length} words` : "No content yet"}
            </p>
          </div>

          {/* Job description input */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job description
            </label>
            <textarea
              className="w-full h-56 text-sm text-gray-800 resize-none focus:outline-none placeholder-gray-300"
              placeholder={"Paste the full job listing here...\n\nThe more detail you include, the better Claude can match your resume to the role."}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              {jobDescription.length > 0 ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : "No content yet"}
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={tailor}
            disabled={!canTailor}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Tailoring...
              </span>
            ) : (
              "Tailor my resume"
            )}
          </button>
          {status === "loading" && (
            <p className="text-sm text-gray-400">
              Claude is rewriting your resume — usually 10–20 seconds
            </p>
          )}
        </div>

        {/* Error state */}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Result */}
        {status === "done" && result && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Tailored resume
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Copy text
                </button>
                <button
                  onClick={() => downloadPDF(result)}
                  className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Keyword match badges */}
            {keywords.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Keywords matched from job description</p>
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed bg-gray-50 rounded-lg p-4 overflow-auto max-h-[600px]">
              {result}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
