import { useRef, useState } from 'react'

export default function DropZone({ onFile, file, label = 'Drop your PDF resume here' }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === 'application/pdf') onFile(dropped)
  }

  const handleChange = e => {
    const selected = e.target.files[0]
    if (selected) onFile(selected)
  }

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative cursor-pointer rounded-2xl p-8 text-center transition-all duration-200 select-none
        ${dragging ? 'dropzone-active' : ''}`}
      style={{
        border: `2px dashed ${dragging ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
        background: dragging ? 'rgba(99,102,241,0.05)' : 'rgba(10,15,36,0.4)',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleChange}
      />

      {file ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-display font-semibold text-emerald-400 text-sm">{file.name}</p>
            <p className="text-slate-500 text-xs mt-0.5">{(file.size / 1024).toFixed(1)} KB · PDF</p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onFile(null) }}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors mt-1"
          >
            Remove file
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="font-display font-medium text-slate-300 text-sm">{label}</p>
            <p className="text-slate-500 text-xs mt-1">PDF only · Click or drag & drop</p>
          </div>
        </div>
      )}
    </div>
  )
}
