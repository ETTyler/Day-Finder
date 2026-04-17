'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { Park } from '@/lib/types'

interface Props {
  selected: Park | null
  onSelect: (park: Park) => void
  onClear: () => void
}

export default function ParkSearch({ selected, onSelect, onClear }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Park[]>([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/parks?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(query), 280)
    return () => clearTimeout(timerRef.current)
  }, [query, search])

  // Close dropdown on outside click
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  if (selected) {
    return (
      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-[#E4E2D9] bg-white">
        <span className="flex-1 text-sm font-medium text-[#1C1B14] truncate">{selected.name}</span>
        {selected.country && (
          <span className="text-xs text-[#9E9D8C] shrink-0">{selected.country}</span>
        )}
        <button
          onClick={onClear}
          aria-label="Clear park"
          className="shrink-0 text-[#9E9D8C] hover:text-[#1C1B14] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="2" x2="12" y2="12" />
            <line x1="12" y1="2" x2="2" y2="12" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#E4E2D9] bg-white focus-within:border-[#C8440B] transition-colors">
        <svg className="shrink-0 text-[#9E9D8C]" width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="6.5" cy="6.5" r="4.5" />
          <line x1="10" y1="10" x2="13" y2="13" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search for a theme park…"
          autoComplete="off"
          className="flex-1 text-sm text-[#1C1B14] placeholder-[#B0AE9D] bg-transparent outline-none"
        />
        {searching && (
          <span className="shrink-0 w-3.5 h-3.5 rounded-full border-2 border-[#E4E2D9] border-t-[#C8440B] animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-30 top-full mt-1 w-full rounded-xl border border-[#E4E2D9] bg-white shadow-lg overflow-hidden">
          {results.map((park) => (
            <button
              key={park.id}
              onPointerDown={(e) => {
                e.preventDefault()
                onSelect(park)
                setQuery('')
                setOpen(false)
                setResults([])
              }}
              className="w-full text-left flex items-baseline justify-between gap-3 px-3.5 py-2.5 hover:bg-[#F5F4EF] transition-colors border-b border-[#F0EEE6] last:border-0"
            >
              <span className="text-sm text-[#1C1B14] truncate">{park.name}</span>
              <span className="text-xs text-[#9E9D8C] shrink-0">{park.country}</span>
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && !searching && results.length === 0 && (
        <div className="absolute z-30 top-full mt-1 w-full rounded-xl border border-[#E4E2D9] bg-white shadow-lg px-3.5 py-3">
          <span className="text-sm text-[#9E9D8C]">No parks found for &ldquo;{query}&rdquo;</span>
        </div>
      )}
    </div>
  )
}
