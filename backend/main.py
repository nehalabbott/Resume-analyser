from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

from backend.resume_parser import extract_text_from_pdf
from backend.analyzer import analyze_resume_vs_jd, analyze_job_fit

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


@app.get("/")
def health_check():
    return {"status": "online", "message": "AI Resume Screener API v2.0 is running."}


@app.post("/api/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """Analyze resume against a job description and return detailed feedback."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        file_bytes = await file.read()
        resume_text = extract_text_from_pdf(file_bytes)

        if not resume_text.strip():
            raise ValueError("Could not extract text from PDF. It may be image-only or scanned.")

        if not job_description.strip():
            raise ValueError("Job description cannot be empty.")

        logger.info(f"Analyzing resume: {file.filename} | JD length: {len(job_description)}")
        analysis = analyze_resume_vs_jd(resume_text, job_description)

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
    """Analyze resume to find best-fit job roles and career guidance."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        file_bytes = await file.read()
        resume_text = extract_text_from_pdf(file_bytes)

        if not resume_text.strip():
            raise ValueError("Could not extract text from PDF. It may be image-only or scanned.")

        logger.info(f"Job-fit analysis for: {file.filename}")
        result = analyze_job_fit(resume_text)

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
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
