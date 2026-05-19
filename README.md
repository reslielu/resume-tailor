# Resume Tailor

AI-powered resume customisation for every job application. Paste your resume and a job description — Claude rewrites your bullet points to match the role, mirrors the JD's keywords, and exports a clean PDF.

Built with **Next.js 14** · **Claude API (claude-sonnet-4)** · **TypeScript** · **Tailwind CSS**

---

## Features

- Paste resume text or upload a PDF
- Paste any job description
- Claude rewrites bullet points to match the role (never invents experience)
- Keyword match badges show which JD terms made it in
- One-click PDF download
- Copy-to-clipboard for pasting into any editor

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

### 3. Get your Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to **API Keys** → **Create Key**
4. Copy the key — you won't see it again

### 4. Set up your environment file

```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace `your_api_key_here` with your actual key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

> **Important:** `.env.local` is in `.gitignore` — it will never be committed. Never paste your API key in code or push it to GitHub.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to test it locally

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
| `ANTHROPIC_API_KEY is not set` | Make sure `.env.local` exists with your key, then restart the dev server |
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
│       ├── tailor/route.ts       ← Claude API call
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

When prompted, add `ANTHROPIC_API_KEY` as an environment variable in the Vercel dashboard under **Settings → Environment Variables**.

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
