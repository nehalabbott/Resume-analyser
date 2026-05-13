from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import re
import ray

from resume_parser import extract_text_from_pdf
from ray_worker import ResumeAnalysisWorker

#create fastapi app
app = FastAPI(title="AI Resume Screener", version="2.0.0")

#enable CORS so frontend apps can access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#start ray, ray helps run tasks in parallel using workers
#avoids errors during testing/reloading
ray.init(ignore_reinit_error=True)

#each worker can process resume analysis independently
workers=[ResumeAnalysisWorker.remote() for _ in range(3)]

logger.info(f"Ray initialised with {3} workers.")

def get_worker(request_id: int) -> ResumeAnalysisWorker:
    return workers[request_id %3]

counter =0 #no of requests
 
@app.post("/api/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    global counter

    #validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload only pdfs!")

    try:
        #read pdf as bytes
        pdf_data= await file.read()
        #extract text
        resume_text = extract_text_from_pdf(pdf_data)
        
        if not resume_text.strip():
            raise ValueError("PDF does not contain extractable text, try again!")

        jd_clean =job_description.strip()
        if len(jd_clean)<80:
            raise ValueError("Too short. Try again!")
        
        #validating JD quality 
        words =jd_clean.split()

        valid_words =sum(
            1 for w in words 
            if re.match(r"^[A-Za-z0-9+#.\-]{2,}$", w)
        )

        if valid_words/max(len(words), 1)<0.6:
            raise ValueError("Invalid or gibberish job description.")

        logger.info(f"Analyzing resume: {file.filename} | JD length: {len(job_description)}")

        #select worker and move to next for future requests
        worker=get_worker(counter)
        counter+=1

        future =worker.analyze_vs_jd.remote(
            resume_text, 
            job_description
        )

        analysis =ray.get(future)

        return {
            "status":"success",
            "filename":file.filename,
            "analysis":analysis
        }

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/job-fit")
async def job_fit_analysis(file: UploadFile = File(...)):
    global counter

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload pdfs only")

    try:
        pdf_data =await file.read() #read
        resume_text =extract_text_from_pdf(pdf_data) #extract

        if not resume_text.strip():
            raise ValueError("pdf text not extractable")

        logger.info(f"Job-fit analysis for: {file.filename}")
        
        worker =get_worker(counter)
        counter+=1

        future =worker.analyze_fit.remote(resume_text)
        result =ray.get(future)
        
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
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        reload=False
    )
    #reload=False when using Ray: ray actors don't survive hot-reload