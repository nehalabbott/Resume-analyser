export default function Loader({ message = 'Analysing with Claude AI…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      {/* Concentric ring animation */}
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-spin-slow" />
        {/* Mid ring */}
        <div className="absolute inset-2 rounded-full border-2 border-t-indigo-400 border-r-cyan-400 border-b-transparent border-l-transparent animate-spin"
          style={{ animationDuration: '1.4s' }} />
        {/* Inner core */}
        <div className="absolute inset-5 rounded-full"
          style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)', opacity: 0.7 }} />
      </div>

      <div className="text-center">
        <p className="font-display font-semibold text-slate-300 text-lg">{message}</p>
        <p className="text-slate-500 text-sm mt-1 font-body">This usually takes 10–20 seconds</p>
      </div>

      {/* Subtle shimmer bar */}
      <div className="w-48 h-1 rounded-full overflow-hidden"
        style={{ background: 'rgba(99,102,241,0.15)' }}>
        <div className="h-full rounded-full animate-pulse"
          style={{ background: 'linear-gradient(90deg, #6366F1, #22D3EE)', width: '60%' }} />
      </div>
    </div>
  )
}
