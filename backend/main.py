from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import re
import ray

from resume_parser import extract_text_from_pdf
from ray_worker import ResumeAnalysisWorker   # ← new import

app = FastAPI(title="AI Resume Screener", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────
#  Ray initialisation — starts a mini cluster (from lecture)
#  ignore_reinit_error=True is safe for hot-reload / testing
# ─────────────────────────────────────────────────────────
ray.init(ignore_reinit_error=True)

# Create a pool of 3 workers (parallel execution — lecture slide 21)
NUM_WORKERS = 3
workers = [ResumeAnalysisWorker.remote() for _ in range(NUM_WORKERS)]
logger.info(f"Ray initialised with {NUM_WORKERS} workers.")


def _get_worker(request_id: int) -> ResumeAnalysisWorker:
    """Round-robin worker selection so requests spread across the pool."""
    return workers[request_id % NUM_WORKERS]


# ─────────────────────────────────────────────────────────
#  Endpoints
# ─────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {"status": "online", "message": "AI Resume Screener API v2.0 is running."}


# Simple counter so we can round-robin without state complexity
_request_counter = 0


@app.post("/api/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """Analyze resume against a job description (runs inside a Ray worker)."""
    global _request_counter

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        file_bytes = await file.read()
        resume_text = extract_text_from_pdf(file_bytes)

        if not resume_text.strip():
            raise ValueError("Could not extract text from PDF. It may be image-only or scanned.")

        jd_clean = job_description.strip()
        if len(jd_clean) < 80:
            raise ValueError("Job description is too short.")

        words = jd_clean.split()
        valid_words = sum(1 for w in words if re.match(r"^[A-Za-z0-9+#.\-]{2,}$", w))
        if valid_words / max(len(words), 1) < 0.6:
            raise ValueError("Invalid or gibberish job description.")

        logger.info(f"Analyzing resume: {file.filename} | JD length: {len(job_description)}")

        # ── Ray: dispatch to a worker asynchronously, then fetch result ──
        worker = _get_worker(_request_counter)
        _request_counter += 1

        future = worker.analyze_vs_jd.remote(resume_text, job_description)
        analysis = ray.get(future)           # blocks until worker is done
        # ──────────────────────────────────────────────────────────────────

        return {
            "status": "success",
            "filename": file.filename,
            "analysis": analysis
        }

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/job-fit")
async def job_fit_analysis(file: UploadFile = File(...)):
    """Analyze resume to find best-fit job roles (runs inside a Ray worker)."""
    global _request_counter

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        file_bytes = await file.read()
        resume_text = extract_text_from_pdf(file_bytes)

        if not resume_text.strip():
            raise ValueError("Could not extract text from PDF. It may be image-only or scanned.")

        logger.info(f"Job-fit analysis for: {file.filename}")

        # ── Ray: dispatch to a worker asynchronously, then fetch result ──
        worker = _get_worker(_request_counter)
        _request_counter += 1

        future = worker.analyze_fit.remote(resume_text)
        result = ray.get(future)
        # ──────────────────────────────────────────────────────────────────

        return {
            "status": "success",
            "filename": file.filename,
            "result": result
        }

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
    # Note: reload=False when using Ray — Ray actors don't survive hot-reload