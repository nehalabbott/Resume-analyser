import ray
from analyzer import analyze_resume_vs_jd, analyze_job_fit

# Ray Actor-> each instance runs independently as its own worker process 

@ray.remote
class ResumeAnalysisWorker:
    def analyze_vs_jd(self, resume_text: str, jd_text: str) -> dict:
        return analyze_resume_vs_jd(resume_text, jd_text)

    def analyze_fit(self, resume_text: str) -> dict:
        return analyze_job_fit(resume_text)