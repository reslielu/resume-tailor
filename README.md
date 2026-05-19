# Resume Tailor

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Gemini API](https://img.shields.io/badge/AI-Gemini_2.5_Flash-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-green)

AI-powered resume customisation for every job application. Paste your resume and a job description — AI rewrites your bullet points to match the role, mirrors the JD's keywords, and exports a clean PDF.

Built with **Next.js 14** · **Gemini API (gemini-2.5-flash)** · **TypeScript** · **Tailwind CSS**

---

## Features

- Paste resume text or upload a PDF
- Paste any job description
- AI rewrites bullet points to match the role (never invents experience)
- Keyword match badges show which JD terms made it in
- One-click PDF download
- Copy-to-clipboard for pasting into any editor

> **Privacy Note:** Resumes and job descriptions are processed strictly in-memory during the API request and are not stored in any database.

---

## Local setup

### 1. Prerequisites

Make sure you have these installed:

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |

### 2. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/resume-tailor.git
cd resume-tailor
npm install
```

### 3. Get your Google Gemini API key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Click on **Get API key** in the left navigation menu, then click **Create API key**
4. Copy the key — you will need to add this to your environment file

### 4. Set up your environment file

```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace `your_api_key_here` with your actual key:

```
GOOGLE_GEMINI_API_KEY=AIza...
```

> **Important:** `.env.local` is in `.gitignore` — it will never be committed. Never paste your API key in code or push it to GitHub.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### Quick smoke test (no real resume needed)

1. In the **Your resume** box, paste this sample:

```
Jane Smith | jane@example.com | linkedin.com/in/janesmith

EXPERIENCE

Software Engineer — Acme Corp (2021–present)
- Built internal tooling used by 200+ employees
- Maintained Python backend services
- Participated in code reviews

Junior Developer — Startup XYZ (2019–2021)
- Worked on React frontend features
- Fixed bugs and wrote unit tests

SKILLS
Python, JavaScript, React, SQL, Git
```

2. In the **Job description** box, paste a real job listing from any job board (LinkedIn, Seek, etc.)

3. Click **Tailor my resume** and wait 10–20 seconds

4. You should see a rewritten resume with keyword badges and a Download PDF button

### Testing PDF upload

1. Take any PDF resume file
2. Click **Upload PDF instead** above the resume textarea
3. The text should be extracted and populate the textarea automatically
4. Then proceed as normal

### Testing the API directly

You can test the API route without the UI using curl:

```bash
curl -X POST http://localhost:3000/api/tailor \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "Jane Smith. Software Engineer. Python, React, SQL.",
    "jobDescription": "We need a senior engineer skilled in Python, React, and data pipelines."
  }'
```

Expected response:
```json
{
  "tailored": "# Jane Smith\n...",
  "keywords": ["python", "react", "engineer", ...]
}
```

---

## Common errors

| Error | Fix |
|-------|-----|
| `GOOGLE_GEMINI_API_KEY is not set` | Make sure `.env.local` exists with your key, then restart the dev server |
| `Module not found: pdf-parse` | Run `npm install` again |
| PDF upload says "Upload failed" | Some scanned PDFs have no text layer — paste the text manually instead |
| Blank page at localhost:3000 | Check your terminal for a build error; usually a TypeScript issue |

---

## Project structure

```
resume-tailor/
├── app/
│   ├── page.tsx                  ← Main UI
│   ├── layout.tsx                ← Root layout
│   ├── globals.css               ← Tailwind base styles
│   └── api/
│       ├── tailor/route.ts       ← API call
│       └── extract-pdf/route.ts  ← PDF text extraction
├── lib/
│   ├── pdf.ts                    ← PDF download utility
│   └── extractPDF.ts             ← PDF upload helper
├── .env.local.example            ← Copy this to .env.local
└── README.md
```

---

## Deploying to Vercel (free)

```bash
npm i -g vercel
vercel
```

When prompted, add `GOOGLE_GEMINI_API_KEY` as an environment variable in the Vercel dashboard under **Settings → Environment Variables**.

---

## Contributing

PRs welcome! Some good first issues:

- [ ] Side-by-side diff view (original vs tailored)
- [ ] Multiple tone modes (concise / achievement-focused / technical)
- [ ] Save history to localStorage
- [ ] Support DOCX upload in addition to PDF

---

## License

MIT
