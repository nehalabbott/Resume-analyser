import { useState } from 'react'
import axios from 'axios'
import DropZone from '../shared/DropZone'
import Loader from '../shared/Loader'
import AnalysisResult from './AnalysisResult'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function ResumeScreener() {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const canSubmit = file && jd.trim().length > 50 && !loading

  const handleAnalyze = async () => {
    if (!canSubmit) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('job_description', jd)

      const { data } = await axios.post(`${API_BASE}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120_000,
      })

      setResult(data.analysis)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Something went wrong.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setJd('')
    setResult(null)
    setError(null)
  }

  if (loading) return <Loader message="Analysing your resume against the job description…" />

  if (result) {
    return (
      <div>
        <button
          onClick={handleReset}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-body"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          New Analysis
        </button>
        <AnalysisResult data={result} />
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Input panel */}
      <div className="card card-glow p-6 flex flex-col gap-5">
        <div>
          <h2 className="font-display font-bold text-xl text-white mb-1">Resume Screener</h2>
          <p className="text-slate-400 text-sm font-body">
            Upload your resume PDF and paste the job description to get an ATS score,
            skill gap analysis, and a personalised 90-day action plan.
          </p>
        </div>

        <div className="divider" />

        {/* File upload */}
        <div>
          <label className="block text-xs font-display font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Your Resume (PDF)
          </label>
          <DropZone onFile={setFile} file={file} label="Drop your resume PDF here" />
        </div>

        {/* JD textarea */}
        <div>
          <label className="block text-xs font-display font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Job Description
          </label>
          <textarea
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste the full job description here (requirements, responsibilities, skills needed…)"
            rows={9}
            className="w-full rounded-xl p-4 text-sm font-body text-slate-200 placeholder-slate-600 resize-none focus:outline-none transition-colors"
            style={{
              background: 'rgba(10,15,36,0.6)',
              border: '1px solid rgba(99,102,241,0.15)',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.15)'}
          />
          <p className="text-xs text-slate-600 mt-1 font-body">
            {jd.trim().length < 50 ? `Minimum 50 characters (${jd.trim().length}/50)` : `${jd.trim().length} characters`}
          </p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm text-rose-400 font-body"
            style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!canSubmit}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Analyse Resume
        </button>
      </div>

      {/* Preview / tips panel */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-white mb-4">What you'll get</h3>
        <div className="flex flex-col gap-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.08)' }}>
              <span className="text-xl">{f.icon}</span>
              <div>
                <p className="font-display font-semibold text-slate-200 text-sm">{f.title}</p>
                <p className="text-slate-500 text-xs font-body mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  { icon: '🎯', title: 'ATS Score (0–100)', desc: 'Overall match score broken down into skills, experience, education, and keyword density.' },
  { icon: '✅', title: 'Matched vs. Missing Skills', desc: 'See exactly which required skills you have and which ones you need to build.' },
  { icon: '💪', title: 'Strengths & Improvements', desc: 'Your top advantages for this role and high-impact things to fix before applying.' },
  { icon: '🗓️', title: '90-Day Action Plan', desc: 'A concrete week-by-week plan to go from where you are to ready-to-apply.' },
  { icon: '🤖', title: 'ATS Optimisation Tips', desc: 'Specific tweaks to your resume formatting and language to pass automated filters.' },
]
