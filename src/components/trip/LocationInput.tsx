'use client'

import { useState } from 'react'

interface Props {
  onSearch: (location: string) => void
  loading: boolean
}

export default function LocationInput({ onSearch, loading }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-[#9E9D8C]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your starting city or postcode…"
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#E4E2D9] bg-[#FAFAF7] text-sm text-[#1C1B14] placeholder-[#B0AE9D] focus:outline-none focus:ring-2 focus:ring-[#C8440B]/30 focus:border-[#C8440B]"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="px-4 py-2.5 rounded-lg bg-[#C8440B] text-white text-sm font-medium hover:bg-[#A83604] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
      >
        {loading ? (
          <span className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1 h-1 rounded-full bg-white/80 animate-bounce"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </span>
        ) : (
          'Plan trip'
        )}
      </button>
    </form>
  )
}
