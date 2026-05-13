// frontend UI

import { useState } from 'react'
import ResumeScreener from './components/screener/ResumeScreener'
import JobFitFinder from './components/jobfit/JobFitFinder'

const TABS = [
  {
    id: 'screener',
    label: 'Resume Screener',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 'jobfit',
    label: 'Job Fit Finder',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('screener')

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #140014 0%, #250028 30%, #3a0a3a 60%, #1a001f 100%)',
      }}
    >
      {/* Pink glow background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at top left, #ff4fd8 0%, transparent 25%), radial-gradient(circle at bottom right, #ff66c4 0%, transparent 25%)',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 pt-8 pb-0 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, #ff4fd8, #ff7ad9)',
                }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              <span className="font-bold text-2xl text-white tracking-tight">
                Resume
                <span
                  style={{
                    background:
                      'linear-gradient(135deg, #ff4fd8, #ff9de6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  AI
                </span>
              </span>
            </div>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="font-extrabold text-5xl md:text-7xl text-white mb-6 leading-tight">
              Land your dream role
              <br />
              <span
                style={{
                  background:
                    'linear-gradient(135deg, #ff4fd8, #ff9de6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                with AI precision.
              </span>
            </h1>

            <p className="text-pink-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Get a detailed ATS score, skill gap analysis, and personalised
              action plan — all in seconds.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-2">
            <div
              className="flex p-1.5 gap-2 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-pink-200 hover:text-white'
                  }`}
                  style={
                    activeTab === tab.id
                      ? {
                          background:
                            'linear-gradient(135deg, #ff4fd8, #ff7ad9)',
                          boxShadow:
                            '0 8px 24px rgba(255, 79, 216, 0.35)',
                        }
                      : {}
                  }
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="px-4 py-10 max-w-7xl mx-auto">
          {activeTab === 'screener' && <ResumeScreener />}
          {activeTab === 'jobfit' && <JobFitFinder />}
        </main>

      </div>
    </div>
  )
}