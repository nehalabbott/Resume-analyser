import ray
from analyzer import analyze_resume_vs_jd, analyze_job_fit


# ─────────────────────────────────────────────────────────
#  Ray Actor — each instance runs independently as its own
#  worker process (just like the lecture: @ray.remote class)
# ─────────────────────────────────────────────────────────

@ray.remote
class ResumeAnalysisWorker:
    """
    A Ray actor that wraps the two Groq-based analyser functions.
    Multiple instances of this class run in parallel, so several
    resume requests can be processed concurrently without blocking.
    """

    def analyze_vs_jd(self, resume_text: str, jd_text: str) -> dict:
        """Run resume-vs-JD analysis inside this worker."""
        return analyze_resume_vs_jd(resume_text, jd_text)

    def analyze_fit(self, resume_text: str) -> dict:
        """Run job-fit analysis inside this worker."""
        return analyze_job_fit(resume_text)