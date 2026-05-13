import { useEffect, useRef, useState } from 'react'

function getColor(score) {
  if (score >= 75) return ['#34D399', '#22D3EE']   // green → cyan (great)
  if (score >= 50) return ['#FBBF24', '#F59E0B']   // amber (ok)
  return ['#FB7185', '#F43F5E']                    // rose (needs work)
}

function getLabel(score) {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Strong'
  if (score >= 55) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Work'
}

export default function ScoreGauge({ score = 0 }) {
  const [displayed, setDisplayed] = useState(0)
  const R = 68
  const circumference = 2 * Math.PI * R
  const gaugeOffset = circumference * 0.25          // start at 12 o'clock offset trick

  const [colors] = useState(getColor(score))
  const gradId = 'sg-grad'

  //count-up effect
  useEffect(() => {
    let frame
    const start = performance.now()
    const duration = 1400
    const from = 0

    const tick = now => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out-cubic
      setDisplayed(Math.round(from + (score - from) * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const fillOffset = circumference - (displayed / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx="90" cy="90" r={R}
            fill="none"
            stroke="rgba(99,102,241,0.1)"
            strokeWidth="10"
          />

          {/* Filled arc */}
          <circle
            cx="90" cy="90" r={R}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={fillOffset}
            transform="rotate(-90 90 90)"
            className="gauge-track"
            style={{ filter: `drop-shadow(0 0 8px ${colors[0]}60)` }}
          />

          {/* Score number */}
          <text
            x="90" y="84"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            style={{ fontFamily: 'Syne, sans-serif', fontSize: 34, fontWeight: 800 }}
          >
            {displayed}
          </text>
          <text
            x="90" y="106"
            textAnchor="middle"
            fill="#94A3B8"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12 }}
          >
            / 100
          </text>
        </svg>
      </div>

      {/* Label pill */}
      <span className="px-4 py-1 rounded-full text-sm font-display font-semibold"
        style={{
          background: `${colors[0]}18`,
          border: `1px solid ${colors[0]}40`,
          color: colors[0],
        }}>
        {getLabel(score)}
      </span>
    </div>
  )
}
