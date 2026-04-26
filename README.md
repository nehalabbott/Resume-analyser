# ResumeAI 🚀

> **AI-powered resume screening, job fit analysis, and career coaching — built with React, FastAPI & Claude.**

Built as a full-stack project for the BTech AI & Data Engineering programme at IIT Ropar.

---

## Features

### 🎯 Resume Screener
Upload your resume PDF + paste any job description to get:
- **ATS Score (0–100)** with a 4-dimension breakdown (skills, experience, education, keywords)
- **Matched vs. Missing Skills** with importance ratings
- **Strengths & Improvements** — high-impact changes to make before applying
- **Curated Learning Resources** — courses, books, and projects for every skill gap
- **90-Day Action Plan** — week-by-week concrete steps to get ready
- **ATS Optimisation Tips** — formatting and language tweaks to beat automated filters

### 🔍 Job Fit Finder
Upload your resume to discover:
- **Top 5 Career Role Matches** with fit scores and rationale
- **Skill Gap Analysis** per role
- **Salary Ranges** (India market)
- **Top Hiring Companies** for each role
- **Path to Improvement** — targeted advice for each role
- **Recommended Certifications** to boost your profile

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS        |
| Backend   | FastAPI, Python 3.11, Uvicorn       |
| AI Engine | Anthropic Claude (`claude-sonnet-4-6`) |
| PDF Parse | PyMuPDF (fitz)                      |
| Container | Docker, Docker Compose, nginx       |

---

## Getting Started

### Prerequisites
- **Docker & Docker Compose** (recommended)
- OR: Node.js 20+ and Python 3.11+
- An [Anthropic API key](https://console.anthropic.com/)

---

### 1. Clone & Configure

```bash
git clone <your-repo>
cd ai-resume-screener

# Set your API key
cp .env.example .env
# Edit .env and paste your ANTHROPIC_API_KEY
```

---

### 2a. Run with Docker (recommended)

```bash
docker-compose up --build
```

- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:8000
- **API Docs** → http://localhost:8000/docs

---

### 2b. Run locally (development)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env         # Add your API key here too
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Frontend → http://localhost:5173 (Vite proxies `/api` to port 8000 automatically)

---

## Project Structure

```
ai-resume-screener/
├── backend/
│   ├── main.py            # FastAPI app + endpoints
│   ├── analyzer.py        # Claude AI integration (core logic)
│   ├── resume_parser.py   # PDF text extraction (PyMuPDF)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css      # Global styles + Tailwind
│   │   └── components/
│   │       ├── shared/    # DropZone, Loader, ScoreGauge
│   │       ├── screener/  # ResumeScreener, AnalysisResult
│   │       └── jobfit/    # JobFitFinder, JobFitResults
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## API Reference

### `POST /api/analyze`
Analyse a resume against a job description.

| Field            | Type   | Description               |
|------------------|--------|---------------------------|
| `file`           | File   | PDF resume                |
| `job_description`| string | Full job description text |

**Response:** JSON with `overall_score`, `score_breakdown`, `matched_skills`, `missing_skills`, `strengths`, `improvements`, `learning_resources`, `action_plan`, `ats_tips`.

---

### `POST /api/job-fit`
Identify best-fit career roles from a resume.

| Field  | Type | Description |
|--------|------|-------------|
| `file` | File | PDF resume  |

**Response:** JSON with `profile_summary`, `experience_level`, `key_skills`, `top_roles` (5 roles with scores, gaps, salary, companies), `recommended_focus`, `certifications`.

---

## Environment Variables

| Variable            | Description                     |
|---------------------|---------------------------------|
| `ANTHROPIC_API_KEY` | Your Claude API key (required)  |

---

## Notes for Evaluators

- **AI Model**: Uses `claude-sonnet-4-6` (Anthropic's latest efficient model)
- **No mock data**: All analysis is generated live via Claude's API
- **PDF handling**: Handles multi-column layouts via spatial block sorting
- **Prompt engineering**: Structured JSON schema in prompts ensures consistent, parseable responses
- **Error handling**: Graceful degradation with user-friendly error messages
- **CORS**: Configured for local development; restrict in production
