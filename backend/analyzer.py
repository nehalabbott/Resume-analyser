from groq import Groq
import json
import re
import os
import logging

logger = logging.getLogger(__name__)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"   # Free on Groq · 14,400 req/day


def _clean_json(text: str) -> str:
    """Strip markdown fences and extract the first JSON object found."""
    text = re.sub(r"^```(?:json)?\s*", "", text.strip())
    text = re.sub(r"\s*```$", "", text)
    match = re.search(r"\{.*\}", text, re.DOTALL)
    return match.group(0) if match else text.strip()


def analyze_resume_vs_jd(resume_text: str, jd_text: str) -> dict:
    """
    Use Claude to perform an in-depth ATS + coaching analysis of a resume
    against a specific job description. Returns a rich structured JSON.
    """

    prompt = f"""You are a senior technical recruiter and career coach specialising in ATS systems.
Analyse the RESUME against the JOB DESCRIPTION below and return a SINGLE JSON object.

RESUME (truncated to 3000 chars):
{resume_text[:3000]}

JOB DESCRIPTION (truncated to 2000 chars):
{jd_text[:2000]}

Return ONLY valid JSON (no markdown, no commentary) matching this exact schema:
{{
  "overall_score": <integer 0-100>,
  "score_breakdown": {{
    "skills_match": <integer 0-100>,
    "experience_relevance": <integer 0-100>,
    "education_fit": <integer 0-100>,
    "keyword_density": <integer 0-100>
  }},
  "verdict": "<One sentence summary of the overall fit>",
  "matched_skills": ["<skill>"],
  "missing_skills": [
    {{
      "skill": "<skill name>",
      "importance": "<High|Medium|Low>",
      "why_needed": "<one sentence on why this matters for the role>"
    }}
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": [
    {{
      "area": "<area to improve>",
      "impact": "<High|Medium|Low>",
      "suggestion": "<specific, actionable improvement>"
    }}
  ],
  "learning_resources": [
    {{
      "skill": "<skill name>",
      "resources": [
        {{
          "type": "<Course|Book|Project|Tutorial|YouTube>",
          "name": "<resource name>",
          "platform": "<platform name>",
          "duration": "<e.g. 12 hrs / 4 weeks>",
          "url_hint": "<search query or known URL>"
        }}
      ]
    }}
  ],
  "action_plan": {{
    "this_week": ["<action 1>", "<action 2>", "<action 3>"],
    "day_30": ["<action 1>", "<action 2>", "<action 3>"],
    "day_60": ["<action 1>", "<action 2>", "<action 3>"],
    "day_90": ["<action 1>", "<action 2>", "<action 3>"]
  }},
  "ats_tips": ["<tip 1>", "<tip 2>", "<tip 3>", "<tip 4>"]
}}"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=4096,
    )

    raw = response.choices[0].message.content
    return json.loads(_clean_json(raw))


def analyze_job_fit(resume_text: str) -> dict:
    """
    Use Claude to identify the top 5 best-fit job roles for a given resume
    and provide targeted improvement advice for each.
    """

    prompt = f"""You are an expert career counsellor and talent market specialist.

RESUME (truncated to 3000 chars):
{resume_text[:3000]}

Analyse the resume and return a SINGLE JSON object. No markdown, no commentary.

Schema:
{{
  "profile_summary": "<2-3 sentence professional summary of the candidate>",
  "experience_level": "<Fresher|Entry|Mid|Senior|Lead>",
  "key_skills": ["<skill 1>", ..., "<skill 10>"],
  "top_roles": [
    {{
      "title": "<job title>",
      "fit_score": <integer 0-100>,
      "why_fits": "<1-2 sentences explaining the fit>",
      "key_strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
      "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
      "path_to_improvement": "<2-3 sentences: concrete steps to close the gaps>",
      "salary_range": "<realistic Indian market range e.g. ₹8-15 LPA>",
      "top_companies": ["<company 1>", "<company 2>", "<company 3>", "<company 4>", "<company 5>"],
      "demand_level": "<High|Medium|Low>"
    }}
  ],
  "recommended_focus": "<2-3 sentences on which path to prioritise and why>",
  "certifications": [
    {{
      "name": "<certification name>",
      "provider": "<provider>",
      "relevance": "<why it matters>",
      "duration": "<estimated time to complete>"
    }}
  ]
}}

Provide exactly 5 top_roles sorted by fit_score descending."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=4096,
    )

    raw = response.choices[0].message.content
    return json.loads(_clean_json(raw))
