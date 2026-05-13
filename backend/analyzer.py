import json
import re
import os
import logging

from groq import Groq

logger = logging.getLogger(__name__)

# =========================
# GROQ CONFIG
# =========================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
print(repr(GROQ_API_KEY))
print(len(GROQ_API_KEY))

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment variables")

client = Groq(api_key=GROQ_API_KEY)

MODEL = "llama-3.3-70b-versatile"


# =========================
# HELPERS
# =========================

def _clean_json(text: str) -> str:
    """
    Remove markdown code fences and extract JSON object.
    """

    text = re.sub(r"^```(?:json)?\s*", "", text.strip())
    text = re.sub(r"\s*```$", "", text)

    match = re.search(r"\{.*\}", text, re.DOTALL)

    return match.group(0) if match else text.strip()


def _safe_json_loads(raw_text: str) -> dict:
    """
    Safely parse JSON response.
    """

    try:
        cleaned = _clean_json(raw_text)
        return json.loads(cleaned)

    except Exception as e:
        logger.error(f"JSON parse failed: {e}")
        logger.error(raw_text)

        return {
            "error": "Failed to parse AI response",
            "raw_response": raw_text
        }


# =========================
# RESUME VS JD ANALYSIS
# =========================

def analyze_resume_vs_jd(resume_text: str, jd_text: str) -> dict:

    prompt = f"""
You are a strict ATS evaluator.

IMPORTANT RULES:

1. If the JOB DESCRIPTION is unclear, random, meaningless, too short,

or not an actual hiring description, return ONLY:

{{

  "error": "Invalid job description"

}}

2. Do NOT invent missing skills or matched skills if the JD is invalid.

3. Only compare skills that explicitly appear in the JOB DESCRIPTION.

4. If fewer than 3 technical/job-related keywords are found in the JD,

treat it as invalid.

Analyse the RESUME against the JOB DESCRIPTION.

Return ONLY valid JSON.
No markdown.
No explanations.

RESUME:
{resume_text[:3000]}

JOB DESCRIPTION:
{jd_text[:2000]}

Schema:

{{
  "overall_score": <integer 0-100>,

  "score_breakdown": {{
    "skills_match": <integer 0-100>,
    "experience_relevance": <integer 0-100>,
    "education_fit": <integer 0-100>,
    "keyword_density": <integer 0-100>
  }},

  "verdict": "<One sentence summary>",

  "matched_skills": ["<skill>"],

  "missing_skills": [
    {{
      "skill": "<skill>",
      "importance": "<High|Medium|Low>",
      "why_needed": "<reason>"
    }}
  ],

  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],

  "improvements": [
    {{
      "area": "<area>",
      "impact": "<High|Medium|Low>",
      "suggestion": "<specific suggestion>"
    }}
  ],

  "action_plan": {{
    "this_week": ["<action>"],
    "day_30": ["<action>"],
    "day_60": ["<action>"],
    "day_90": ["<action>"]
  }},

  "ats_tips": [
    "<tip 1>",
    "<tip 2>",
    "<tip 3>",
    "<tip 4>"
  ]
}}
"""

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=2000,
        )

        raw = response.choices[0].message.content

        return _safe_json_loads(raw)

    except Exception as e:

        logger.error(f"Resume analysis failed: {e}")

        return {
            "error": str(e)
        }


# =========================
# JOB FIT ANALYSIS
# =========================

def analyze_job_fit(resume_text: str) -> dict:

    prompt = f"""
You are an expert career counsellor and hiring specialist.

Analyse the resume below.

Return ONLY valid JSON.
No markdown.
No explanations.

RESUME:
{resume_text[:3000]}

Schema:

{{
  "profile_summary": "<2-3 sentence summary>",

  "experience_level": "<Fresher|Entry|Mid|Senior|Lead>",

  "key_skills": [
    "<skill 1>",
    "<skill 2>",
    "<skill 3>"
  ],

  "top_roles": [
    {{
      "title": "<job title>",
      "fit_score": <integer 0-100>,
      "why_fits": "<reason>",
      "key_strengths": [
        "<strength 1>",
        "<strength 2>",
        "<strength 3>"
      ],
      "gaps": [
        "<gap 1>",
        "<gap 2>",
        "<gap 3>"
      ],
      "path_to_improvement": "<improvement path>",
      "salary_range": "<salary>",
      "top_companies": [
        "<company 1>",
        "<company 2>",
        "<company 3>"
      ],
      "demand_level": "<High|Medium|Low>"
    }}
  ],

  "recommended_focus": "<recommendation>",

  "certifications": [
    {{
      "name": "<certification>",
      "provider": "<provider>",
      "relevance": "<why useful>",
      "duration": "<time>"
    }}
  ]
}}

Provide EXACTLY 5 top_roles sorted by fit_score descending.
"""

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=2000,
        )

        raw = response.choices[0].message.content

        return _safe_json_loads(raw)

    except Exception as e:

        logger.error(f"Job fit analysis failed: {e}")

        return {
            "error": str(e)
        }