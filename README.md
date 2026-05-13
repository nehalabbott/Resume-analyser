# ResumeAI 

AI-powered resume screening and job-fit analysis built using React, FastAPI, Groq LLMs, Ray, Docker, and Kubernetes.


## Features

### Resume Screener
- Upload resume PDF + job description
- ATS score with breakdown
- Matched & missing skills
- Strengths and improvements
- 90-day action plan
- ATS optimisation tips

###  Job Fit Finder
- Top matching career roles
- Skill gap analysis
- Recommended certifications
- Salary ranges
- Hiring companies
- Career improvement roadmap


## Tech Stack

| Layer               | Tech |

| Frontend            | React, Vite, Tailwind CSS |
| Backend             | FastAPI, Python |
| AI                  | Groq API (`llama-3.3-70b-versatile`) |
| Parallel Processing | Ray |
| PDF Parsing         | PyMuPDF |
| Containerization    | Docker |
| Orchestration       | Kubernetes |
| Reverse Proxy       | Nginx |


## Architecture

Frontend (React)
        ↓
FastAPI Backend
        ↓
Ray Worker Pool
        ↓
Groq LLM API
        ↓
ATS + Career Analysis