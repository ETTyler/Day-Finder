import type { DayResult } from '@/lib/types'

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const CROWD_LEVELS = [
  { max: 30,  label: 'Very quiet', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  { max: 50,  label: 'Quiet',      color: '#4d7c0f', bg: '#f7fee7', border: '#bef264' },
  { max: 70,  label: 'Moderate',   color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  { max: 85,  label: 'Busy',       color: '#c2410c', bg: '#fff7ed', border: '#fdba74' },
  { max: 101, label: 'Very busy',  color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
]

function crowdLevel(pct: number) {
  return CROWD_LEVELS.find((l) => pct < l.max) ?? CROWD_LEVELS[CROWD_LEVELS.length - 1]
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface Props {
  days: DayResult[]
  parkName: string
  totalDays: number
  topN: number
}

function Badge({ level }: { level: (typeof CROWD_LEVELS)[number] }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: level.color, backgroundColor: level.bg, border: `1px solid ${level.border}` }}
    >
      {level.label}
    </span>
  )
}

function CrowdBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex-1 h-1.5 rounded-full bg-[#EDEAE0] overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, backgroundColor: color, transition: 'width 0.4s ease' }}
      />
    </div>
  )
}

export default function ResultsTable({ days, parkName, totalDays }: Props) {
  if (days.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-[#706F5C]">No open days match your filters.</p>
        <p className="text-xs text-[#9E9D8C] mt-1">Try widening the date range or raising the crowd limit.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-3 px-0.5">
        <h2 className="text-sm font-semibold text-[#1C1B14]">{parkName}</h2>
        <span className="text-xs text-[#9E9D8C]">
          {days.length < totalDays
            ? `Top ${days.length} of ${totalDays} open days`
            : `${totalDays} open day${totalDays === 1 ? '' : 's'}`}
        </span>
      </div>

      <div className="rounded-xl border border-[#E4E2D9] overflow-hidden bg-white">
        {days.map((day, i) => {
          const level = crowdLevel(day.crowd_pct)
          const pctLabel = `${day.crowd_pct}%${day.predicted ? '*' : ''}`

          return (
            <div
              key={day.date}
              className={`px-4 ${i < days.length - 1 ? 'border-b border-[#F0EEE6]' : ''} ${i === 0 ? 'bg-[#FDFCF8]' : ''}`}
            >
              {/* ── Mobile layout (< sm) ── */}
              <div className="sm:hidden py-3 space-y-2">
                {/* Line 1: rank + date · day | badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-[#C0BDA8] tabular-nums shrink-0">{i + 1}</span>
                    <span className="text-sm text-[#1C1B14]">{fmtDate(day.date)}</span>
                    <span className="text-xs text-[#9E9D8C]">·</span>
                    <span className="text-xs text-[#9E9D8C]">{WEEKDAY_NAMES[day.weekday]}</span>
                  </div>
                  <Badge level={level} />
                </div>

                {/* Line 2: crowd bar | % | hours */}
                <div className="flex items-center gap-2.5 pl-5">
                  <CrowdBar pct={day.crowd_pct} color={level.color} />
                  <span className="text-xs text-[#1C1B14] tabular-nums shrink-0">{pctLabel}</span>
                  {day.hours && (
                    <span className="text-xs text-[#9E9D8C] shrink-0 tabular-nums">{day.hours}</span>
                  )}
                </div>
              </div>

              {/* ── Desktop layout (≥ sm) ── */}
              <div className="hidden sm:flex items-center gap-3 py-3">
                <span className="w-5 shrink-0 text-xs text-[#C0BDA8] text-right tabular-nums">
                  {i + 1}
                </span>
                <span className="w-28 shrink-0 text-sm text-[#1C1B14]">
                  {fmtDate(day.date)}
                </span>
                <span className="w-7 shrink-0 text-xs text-[#9E9D8C]">
                  {WEEKDAY_NAMES[day.weekday]}
                </span>
                <div className="flex items-center gap-2.5 w-44 shrink-0">
                  <div className="w-32 h-1.5 rounded-full bg-[#EDEAE0] overflow-hidden shrink-0">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${day.crowd_pct}%`, backgroundColor: level.color, transition: 'width 0.4s ease' }}
                    />
                  </div>
                  <span className="text-xs text-[#1C1B14] tabular-nums w-10 text-right shrink-0">
                    {pctLabel}
                  </span>
                </div>
                <div className="shrink-0 w-20 px-6">
                  <Badge level={level} />
                </div>
                <span className="text-xs text-[#9E9D8C] text-right shrink-0 tabular-nums ml-auto hidden md:block">
                  {day.hours || '—'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {days.some((d) => d.predicted) && (
        <p className="mt-2 text-xs text-[#B0AE9D]">* predicted crowd level</p>
      )}
    </div>
  )
}
