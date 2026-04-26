import { useState } from 'react'
import ScoreGauge from '../shared/ScoreGauge'

const DEMAND_COLORS = {
  High:   { text: '#34D399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)' },
  Medium: { text: '#FBBF24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)' },
  Low:    { text: '#94A3B8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
}

function DemandBadge({ level }) {
  const c = DEMAND_COLORS[level] || DEMAND_COLORS.Medium
  return (
    <span className="text-xs font-display font-semibold px-2.5 py-0.5 rounded-full"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      {level} Demand
    </span>
  )
}

function FitBar({ score }) {
  const color = score >= 75 ? '#34D399' : score >= 50 ? '#FBBF24' : '#FB7185'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,0.15)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, background: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
      <span className="font-mono text-sm font-bold" style={{ color }}>{score}%</span>
    </div>
  )
}

function JobCard({ role, index }) {
  const [expanded, setExpanded] = useState(index === 0)

  return (
    <div
      className="stagger-item rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border: '1px solid rgba(99,102,241,0.12)',
        background: expanded ? 'rgba(15,24,48,0.9)' : 'rgba(10,15,36,0.6)',
        boxShadow: expanded ? '0 0 40px rgba(99,102,241,0.07)' : 'none',
      }}
    >
      {/* Card header */}
      <div
        className="p-5 cursor-pointer select-none"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-slate-500"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                {index + 1}
              </span>
              <h3 className="font-display font-bold text-lg text-white">{role.title}</h3>
              <DemandBadge level={role.demand_level} />
            </div>
            <p className="text-slate-400 text-sm font-body mb-3">{role.why_fits}</p>
            <FitBar score={role.fit_score} />
          </div>
          <svg
            className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 mt-1 ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-5 pb-5 flex flex-col gap-4"
          style={{ borderTop: '1px solid rgba(99,102,241,0.08)' }}>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            {/* Strengths */}
            <div>
              <p className="text-xs font-display font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                Key Strengths
              </p>
              <ul className="flex flex-col gap-1.5">
                {(role.key_strengths || []).map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-body text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div>
              <p className="text-xs font-display font-semibold text-rose-400 uppercase tracking-wider mb-2">
                Skill Gaps
              </p>
              <ul className="flex flex-col gap-1.5">
                {(role.gaps || []).map((g, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-body text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Path to improvement */}
          <div className="p-4 rounded-xl"
            style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
            <p className="text-xs font-display font-semibold text-indigo-400 mb-1.5">How to Bridge the Gap</p>
            <p className="text-sm font-body text-slate-400">{role.path_to_improvement}</p>
          </div>

          {/* Salary + companies */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl"
              style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.12)' }}>
              <p className="text-xs font-display font-semibold text-slate-500 mb-0.5">Salary Range (India)</p>
              <p className="font-mono font-bold text-emerald-400 text-sm">{role.salary_range}</p>
            </div>

            <div className="p-3 rounded-xl"
              style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.12)' }}>
              <p className="text-xs font-display font-semibold text-slate-500 mb-1.5">Top Hiring Companies</p>
              <div className="flex flex-wrap gap-1">
                {(role.top_companies || []).map((c, i) => (
                  <span key={i} className="text-xs font-body text-cyan-400 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.15)' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function JobFitResults({ data }) {
  const { profile_summary, experience_level, key_skills, top_roles, recommended_focus, certifications } = data

  return (
    <div className="flex flex-col gap-5">
      {/* Profile summary */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
            👤
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display font-bold text-white text-xl">Your Profile</h2>
              <span className="text-xs font-display font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818CF8' }}>
                {experience_level}
              </span>
            </div>
            <p className="text-slate-400 font-body text-sm mb-4">{profile_summary}</p>
            <div className="flex flex-wrap gap-2">
              {(key_skills || []).map((s, i) => (
                <span key={i} className="tag-matched">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended focus */}
      {recommended_focus && (
        <div className="card p-4 flex items-start gap-3"
          style={{ background: 'rgba(251,191,36,0.05)', borderColor: 'rgba(251,191,36,0.2)' }}>
          <span className="text-xl">🧭</span>
          <div>
            <p className="font-display font-semibold text-amber-400 text-sm mb-0.5">Recommended Focus</p>
            <p className="text-slate-400 font-body text-sm">{recommended_focus}</p>
          </div>
        </div>
      )}

      {/* Role cards */}
      <div>
        <h3 className="font-display font-bold text-white text-xl mb-4">🎯 Your Top 5 Role Matches</h3>
        <div className="flex flex-col gap-3">
          {(top_roles || []).map((role, i) => (
            <JobCard key={i} role={role} index={i} />
          ))}
        </div>
      </div>

      {/* Certifications */}
      {(certifications || []).length > 0 && (
        <div className="card p-6">
          <h3 className="font-display font-bold text-white text-lg mb-4">🏅 Recommended Certifications</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {certifications.map((cert, i) => (
              <div key={i} className="stagger-item p-4 rounded-xl"
                style={{ background: 'rgba(10,15,36,0.6)', border: '1px solid rgba(99,102,241,0.1)' }}>
                <p className="font-display font-semibold text-slate-200 text-sm">{cert.name}</p>
                <p className="text-xs text-indigo-400 font-body mt-0.5">{cert.provider}</p>
                <p className="text-xs text-slate-500 font-body mt-1">{cert.relevance}</p>
                <p className="text-xs text-slate-600 mt-1.5 font-mono">⏱ {cert.duration}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
