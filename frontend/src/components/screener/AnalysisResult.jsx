import ScoreGauge from '../shared/ScoreGauge'

const impactColors = {
  High: {
    bg: 'rgba(251,113,133,0.1)',
    border: 'rgba(251,113,133,0.3)',
    text: '#FB7185',
  },
  Medium: {
    bg: 'rgba(251,191,36,0.1)',
    border: 'rgba(251,191,36,0.3)',
    text: '#FBBF24',
  },
  Low: {
    bg: 'rgba(148,163,184,0.1)',
    border: 'rgba(148,163,184,0.2)',
    text: '#94A3B8',
  },
}

function ImpactBadge({ level }) {
  const c = impactColors[level] || impactColors.Low

  return (
    <span
      className="text-xs font-display font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
    >
      {level}
    </span>
  )
}

function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-body text-slate-400">
          {label}
        </span>

        <span className="text-xs font-mono font-semibold text-indigo-400">
          {value}%
        </span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function Section({ title, children, className = '' }) {
  return (
    <section className={`card p-6 ${className}`}>
      <h3 className="font-display font-bold text-white text-lg mb-4">
        {title}
      </h3>

      {children}
    </section>
  )
}

const PLAN_PHASES = [
  {
    key: 'this_week',
    label: 'This Week',
    color: '#FB7185',
    icon: '⚡',
  },
  {
    key: 'day_30',
    label: '30 Days',
    color: '#FBBF24',
    icon: '📅',
  },
  {
    key: 'day_60',
    label: '60 Days',
    color: '#818CF8',
    icon: '🚀',
  },
  {
    key: 'day_90',
    label: '90 Days',
    color: '#34D399',
    icon: '🏆',
  },
]

export default function AnalysisResult({ data }) {
  const {
    overall_score,
    score_breakdown,
    verdict,
    matched_skills,
    missing_skills,
    strengths,
    improvements,
    action_plan,
    ats_tips,
  } = data

  return (
    <div className="flex flex-col gap-5">
      {/* Verdict */}
      <div
        className="card p-4 flex items-center gap-3"
        style={{
          background: 'rgba(99,102,241,0.07)',
          borderColor: 'rgba(99,102,241,0.2)',
        }}
      >
        <span className="text-2xl">💡</span>

        <p className="font-body text-slate-300 text-sm">
          {verdict || 'Resume analysis completed successfully.'}
        </p>
      </div>

      {/* Score Section */}
      <div className="grid md:grid-cols-[auto_1fr] gap-5">
        {/* Gauge */}
        <div className="card p-6 flex flex-col items-center justify-center">
          <p className="font-display font-semibold text-slate-400 text-xs uppercase tracking-wider mb-4">
            Overall ATS Score
          </p>

          <ScoreGauge score={overall_score} />
        </div>

        {/* Breakdown */}
        <Section title="Score Breakdown">
          <div className="flex flex-col gap-3">
            <ScoreBar
              label="Skills Match"
              value={score_breakdown?.skills_match ?? 0}
            />

            <ScoreBar
              label="Experience Relevance"
              value={score_breakdown?.experience_relevance ?? 0}
            />

            <ScoreBar
              label="Education Fit"
              value={score_breakdown?.education_fit ?? 0}
            />
          </div>
        </Section>
      </div>

      {/* Skills */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Matched */}
        <Section
          title={`✅ Matched Skills (${(matched_skills || []).length})`}
        >
          <div className="flex flex-wrap gap-3">
            {(matched_skills || []).map((s, i) => (
              <div
                key={i}
                className="tag-matched stagger-item"
              >
                <span>{s.skill}</span>
              </div>
            ))}

            {(!matched_skills || matched_skills.length === 0) && (
              <p className="text-slate-500 text-sm">
                No matched skills found.
              </p>
            )}
          </div>
        </Section>

        {/* Missing */}
        <Section
          title={`❌ Missing Skills (${(missing_skills || []).length})`}
        >
          <div className="flex flex-col gap-2">
            {(missing_skills || []).map((s, i) => (
              <div
                key={i}
                className="stagger-item p-3 rounded-xl"
                style={{
                  background: 'rgba(251,113,133,0.04)',
                  border: '1px solid rgba(251,113,133,0.08)',
                }}
              >
                <div className="mb-2">
                <span className="tag-missing">
                  {s.skill}
                </span>
                </div>

                <p className="text-xs text-slate-500 font-body">
                  {s.why_needed}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Strengths + Improvements */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Strengths */}
        <Section title="💪 Your Strengths">
          <ul className="flex flex-col gap-2">
            {(strengths || []).map((s, i) => (
              <li
                key={i}
                className="stagger-item flex items-start gap-2 text-sm font-body text-slate-300"
              >
                <span className="text-emerald-400 mt-0.5">
                  ▸
                </span>

                {s}
              </li>
            ))}
          </ul>
        </Section>

        {/* Improvements */}
        <Section title="🔧 Improvements to Make">
          <div className="flex flex-col gap-3">
            {(improvements || []).map((imp, i) => (
              <div
                key={i}
                className="stagger-item p-3 rounded-xl"
                style={{
                  background: 'rgba(10,15,36,0.6)',
                  border: '1px solid rgba(99,102,241,0.08)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-semibold text-slate-200 text-sm">
                    {imp.area}
                  </span>

                  <ImpactBadge level={imp.impact} />
                </div>

                <p className="text-xs text-slate-500 font-body">
                  {imp.suggestion}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Action Plan */}
      {action_plan && (
        <Section title="🗓️ 90-Day Action Plan">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLAN_PHASES.map(({ key, label, color, icon }) => {
              const items = action_plan[key] || []

              return (
                <div
                  key={key}
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: `1px solid ${color}25`,
                    background: `${color}06`,
                  }}
                >
                  <div
                    className="px-4 py-2.5 flex items-center gap-2"
                    style={{
                      borderBottom: `1px solid ${color}20`,
                    }}
                  >
                    <span>{icon}</span>

                    <span
                      className="font-display font-bold text-sm"
                      style={{ color }}
                    >
                      {label}
                    </span>
                  </div>

                  <ul className="p-3 flex flex-col gap-2">
                    {items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-xs font-body text-slate-400"
                      >
                        <span
                          className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: color }}
                        />

                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* ATS Tips */}
      {(ats_tips || []).length > 0 && (
        <Section title="🤖 ATS Optimisation Tips">
          <div className="grid sm:grid-cols-2 gap-2">
            {ats_tips.map((tip, i) => (
              <div
                key={i}
                className="stagger-item flex items-start gap-3 p-3 rounded-xl"
                style={{
                  background: 'rgba(34,211,238,0.04)',
                  border: '1px solid rgba(34,211,238,0.1)',
                }}
              >
                <span className="text-cyan-400 text-sm mt-0.5">
                  ✦
                </span>

                <p className="text-sm font-body text-slate-400">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}