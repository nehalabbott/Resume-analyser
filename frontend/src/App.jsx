import { useState } from 'react'
import ResumeScreener from './components/screener/ResumeScreener'
import JobFitFinder from './components/jobfit/JobFitFinder'

const TABS = [
  {
    id: 'screener',
    label: 'Resume Screener',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Match your resume to a job description',
  },
  {
    id: 'jobfit',
    label: 'Job Fit Finder',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    description: 'Discover your best-fit career roles',
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('screener')

  return (
    <div className="min-h-screen relative">
      {/* Ambient background */}
      <div className="mesh-bg" />

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 pt-8 pb-0 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Resume<span className="gradient-text">AI</span>
              </span>
            </div>

            {/* Powered-by badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-body text-slate-400">Powered by Claude</span>
            </div>
          </div>

          {/* Hero text */}
          <div className="text-center mb-10">
            <h1 className="font-display font-extrabold text-5xl md:text-6xl text-white mb-4 leading-none tracking-tight">
              Land your dream role<br />
              <span className="gradient-text">with AI precision.</span>
            </h1>
            <p className="font-body text-slate-400 text-lg max-w-xl mx-auto">
              Get a detailed ATS score, skill gap analysis, personalised action plan,
              and curated learning resources — all in seconds.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center mb-0">
            <div className="flex p-1 gap-1 rounded-2xl"
              style={{
                background: 'rgba(10,15,36,0.8)',
                border: '1px solid rgba(99,102,241,0.12)',
                backdropFilter: 'blur(12px)',
              }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-display font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  style={activeTab === tab.id ? {
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(34,211,238,0.1))',
                    border: '1px solid rgba(99,102,241,0.3)',
                    boxShadow: '0 4px 16px rgba(99,102,241,0.15)',
                  } : {}}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 py-8 max-w-7xl mx-auto">
          {activeTab === 'screener' && <ResumeScreener />}
          {activeTab === 'jobfit' && <JobFitFinder />}
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-slate-600 text-sm font-body">
          <div className="divider mb-6 max-w-md mx-auto" />
          Built with FastAPI · React · Claude AI
        </footer>
      </div>
    </div>
  )
}
