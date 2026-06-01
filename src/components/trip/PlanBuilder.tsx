'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import type { DayResult } from '@/lib/types'
import type { DayPlan, DayTag } from '@/lib/tripTypes'
import { crowdLevel } from '@/lib/crowdUtils'
import PinDecoration from './PinDecoration'
import RichNotes from './RichNotes'

export type { DayPlan }

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface Props {
  checkIn?: string
  checkOut?: string
  days: DayResult[]
  parkName: string
  parkId?: string
  onExportReady?: (plans: DayPlan[], crowdData: DayResult[]) => void
}

const TAG_CONFIG: Record<DayTag, { band: string; active: string; label: string }> = {
  travel: { band: '#C8C4B0', active: '#706F5C', label: 'Travel'   },
  park:   { band: '#C8440B', active: '#C8440B', label: 'Park day' },
  free:   { band: '#2D6A4F', active: '#2D6A4F', label: 'Free day' },
}

function datesBetween(start: string, end: string): string[] {
  const dates: string[] = []
  const [sy, sm, sd] = start.split('-').map(Number)
  const [ey, em, ed] = end.split('-').map(Number)
  const cur = new Date(sy, sm - 1, sd)
  const endDate = new Date(ey, em - 1, ed)
  while (cur <= endDate) {
    const y = cur.getFullYear()
    const m = String(cur.getMonth() + 1).padStart(2, '0')
    const d = String(cur.getDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${d}`)
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

function getWeekday(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number)
  const day = new Date(y, m - 1, d).getDay()
  return day === 0 ? 6 : day - 1
}

function fmtShortDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function PlanBuilder({ checkIn, checkOut, days, parkName, parkId, onExportReady }: Props) {
  const [plans,      setPlans]      = useState<DayPlan[]>([])
  const [allCrowd,   setAllCrowd]   = useState<DayResult[]>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const hasDates = !!(checkIn && checkOut && checkOut >= checkIn)

  const storageKey = useMemo(
    () => parkId && checkIn && checkOut ? `trip-plan-${parkId}-${checkIn}-${checkOut}` : null,
    [parkId, checkIn, checkOut],
  )

  // Fetch crowd data for the full date range
  useEffect(() => {
    if (!parkId || !hasDates || !checkIn || !checkOut) return
    const controller = new AbortController()
    const qs = new URLSearchParams({ parkId, startDate: checkIn, endDate: checkOut, topN: '365', maxCrowd: '100' })
    fetch(`/api/calendar?${qs}`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => { if (data.days) setAllCrowd(data.days) })
      .catch(() => {})
    return () => controller.abort()
  }, [parkId, checkIn, checkOut, hasDates])

  // Build / restore plan when dates or best-days seed changes
  useEffect(() => {
    if (!hasDates || !checkIn || !checkOut) return
    const dates     = datesBetween(checkIn, checkOut)
    const bestDates = new Set(days.map(d => d.date))

    if (storageKey) {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          const loaded = JSON.parse(saved) as DayPlan[]
          const loadedMap = new Map(loaded.map(p => [p.date, p]))
          setPlans(dates.map((date, i) => {
            if (loadedMap.has(date)) return loadedMap.get(date)!
            const isEdge = i === 0 || i === dates.length - 1
            return { date, tag: bestDates.has(date) ? 'park' : isEdge ? 'travel' : 'free', note: '' }
          }))
          setSaveStatus('saved')
          return
        } catch {}
      }
    }

    setPlans(prev => {
      const existing = new Map(prev.map(p => [p.date, p]))
      return dates.map((date, i) => {
        if (existing.has(date)) return existing.get(date)!
        const isEdge = i === 0 || i === dates.length - 1
        return { date, tag: bestDates.has(date) ? 'park' : isEdge ? 'travel' : 'free', note: '' }
      })
    })
  }, [checkIn, checkOut, days, storageKey, hasDates])

  // Auto-save with debounce
  useEffect(() => {
    if (!storageKey || plans.length === 0) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(plans))
      const exp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `trip-last-plan=${encodeURIComponent(storageKey)};expires=${exp};path=/;SameSite=Lax`
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }, 600)
    return () => clearTimeout(saveTimer.current)
  }, [plans, storageKey])

  // Notify parent of export data whenever plans or crowd data change
  useEffect(() => {
    onExportReady?.(plans, allCrowd.length > 0 ? allCrowd : days)
  }, [plans, allCrowd, days, onExportReady])

  const updatePlan = (date: string, updates: Partial<DayPlan>) =>
    setPlans(prev => prev.map(p => p.date === date ? { ...p, ...updates } : p))

  const clearSaved = () => {
    if (!storageKey) return
    localStorage.removeItem(storageKey)
    setSaveStatus('idle')
    if (!checkIn || !checkOut) return
    const bestDates = new Set(days.map(d => d.date))
    const allDates  = datesBetween(checkIn, checkOut)
    setPlans(allDates.map((date, i) => ({
      date,
      tag: (bestDates.has(date) ? 'park' : (i === 0 || i === allDates.length - 1) ? 'travel' : 'free') as DayTag,
      note: '',
    })))
  }

  const crowdByDate = useMemo(() => {
    const source = allCrowd.length > 0 ? allCrowd : days
    return new Map(source.map(d => [d.date, d]))
  }, [allCrowd, days])

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <PinDecoration color="#C8440B" />
        <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-[#706F5C]">
          Build your itinerary
        </h2>
        <div className="flex-1 border-t border-dashed border-[#C8C4B0]" />
        {saveStatus === 'saved' && (
          <span className="flex items-center gap-1 text-xs text-[#2D6A4F] shrink-0">
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Saved
          </span>
        )}
      </div>

      {!hasDates && (
        <p className="text-xs text-[#B0AE9D] text-center py-6">
          Set your trip dates above to build a day-by-day itinerary for {parkName}.
        </p>
      )}

      {hasDates && plans.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-4 flex-wrap">
              {(Object.entries(TAG_CONFIG) as [DayTag, typeof TAG_CONFIG[DayTag]][]).map(([tag, cfg]) => (
                <div key={tag} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.band }} />
                  <span className="text-xs text-[#706F5C]">{cfg.label}</span>
                </div>
              ))}
            </div>
            {saveStatus === 'saved' && storageKey && (
              <button onClick={clearSaved} className="text-xs text-[#9E9D8C] hover:text-[#C8440B] transition-colors shrink-0">
                Reset plan
              </button>
            )}
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {plans.map(plan => {
              const crowd   = crowdByDate.get(plan.date)
              const cfg     = TAG_CONFIG[plan.tag]
              const weekday = getWeekday(plan.date)

              return (
                <div key={plan.date} className="rounded-xl border border-[#E4E2D9] bg-white overflow-hidden flex flex-col">
                  <div className="h-1.5 shrink-0" style={{ backgroundColor: cfg.band }} />

                  <div className="px-3 pt-3 pb-2">
                    <div className="text-xs text-[#9E9D8C]">{WEEKDAY_NAMES[weekday]}</div>
                    <div className="text-sm font-semibold text-[#1C1B14]">{fmtShortDate(plan.date)}</div>
                  </div>

                  {/* Crowd bar */}
                  {crowd && (() => {
                    const level = crowdLevel(crowd.crowd_pct)
                    return (
                      <div className="px-3 mb-2 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-[#EDEAE0] overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${crowd.crowd_pct}%`, backgroundColor: level.color }} />
                          </div>
                          <span className="text-xs tabular-nums shrink-0 font-medium" style={{ color: level.color }}>
                            {crowd.crowd_pct}%{crowd.predicted ? '*' : ''}
                          </span>
                        </div>
                        <div className="text-xs" style={{ color: level.color }}>{level.label}</div>
                      </div>
                    )
                  })()}

                  {/* Tag selector */}
                  <div className="px-3 flex gap-1.5 flex-wrap">
                    {(Object.entries(TAG_CONFIG) as [DayTag, typeof TAG_CONFIG[DayTag]][]).map(([tag, tc]) => {
                      const active = plan.tag === tag
                      return (
                        <button
                          key={tag}
                          onClick={() => updatePlan(plan.date, { tag })}
                          className="text-xs px-2 py-0.5 rounded-full border transition-colors"
                          style={active
                            ? { backgroundColor: tc.active, borderColor: tc.active, color: '#fff' }
                            : { backgroundColor: 'transparent', borderColor: '#E4E2D9', color: '#706F5C' }
                          }
                        >
                          {tc.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Rich text notes */}
                  <div className="px-3 pb-3 mt-2 flex-1">
                    <RichNotes
                      content={plan.note}
                      onChange={note => updatePlan(plan.date, { note })}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {(days.some(d => d.predicted) || allCrowd.some(d => d.predicted)) && (
            <p className="mt-3 text-xs text-[#B0AE9D]">* predicted crowd level</p>
          )}
        </>
      )}
    </div>
  )
}
