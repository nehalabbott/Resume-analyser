import { useState } from 'react'
import axios from 'axios'
import DropZone from '../shared/DropZone'
import Loader from '../shared/Loader'
import JobFitResults from './JobFitResults'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function JobFitFinder() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!file || loading) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await axios.post(`${API_BASE}/api/job-fit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120_000,
      })

      setResult(data.result)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Something went wrong.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  if (loading) return <Loader message="Discovering your best-fit career paths…" />

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
          Upload a Different Resume
        </button>
        <JobFitResults data={result} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card card-glow p-8 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-white mb-2">Job Fit Finder</h2>
          <p className="text-slate-400 text-sm font-body max-w-md mx-auto">
            Upload your resume and let Claude identify the top 5 career roles you're best suited
            for — with salary ranges, target companies, and a personalised growth roadmap.
          </p>
        </div>

        <div className="divider" />

        <DropZone
          onFile={setFile}
          file={file}
          label="Drop your resume PDF here"
        />

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm text-rose-400 font-body"
            style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Find My Best-Fit Roles
        </button>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {['Top 5 Role Matches', 'Salary Ranges', 'Target Companies', 'Skill Gaps', 'Growth Roadmap', 'Certifications'].map(f => (
            <span key={f} className="text-xs font-body text-slate-500 px-3 py-1 rounded-full"
              style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
