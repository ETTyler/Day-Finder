import type { DayResult } from '@/lib/types'
import { crowdLevel } from '@/lib/crowdUtils'

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ItinerarySection({ days }: { days: DayResult[] }) {
  if (days.length === 0) return null

  return (
    <div className="relative">
      {/* Tape decoration */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#F0E68C] opacity-75 rounded-sm rotate-[-1deg] z-10" />

      <div className="rounded-xl border border-[#E4E2D9] bg-white overflow-hidden">
        {days.map((day, i) => {
          const level    = crowdLevel(day.crowd_pct)
          const pctLabel = `${day.crowd_pct}%${day.predicted ? '*' : ''}`
          return (
            <div
              key={day.date}
              className={`flex items-center gap-3 px-4 py-2.5 ${i < days.length - 1 ? 'border-b border-[#F0EEE6]' : ''}`}
            >
              {/* Rank */}
              <span className="text-xs text-[#C0BDA8] tabular-nums w-4 shrink-0">{i + 1}</span>

              {/* Date + weekday */}
              <div className="min-w-0 flex-1">
                <span className="text-xs text-[#1C1B14]">{fmtDate(day.date)}</span>
                <span className="text-xs text-[#9E9D8C] ml-1">· {WEEKDAY_NAMES[day.weekday]}</span>
              </div>

              {/* Crowd bar */}
              <div className="w-16 h-1.5 rounded-full bg-[#EDEAE0] overflow-hidden shrink-0">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${day.crowd_pct}%`, backgroundColor: level.color }}
                />
              </div>

              {/* Percentage */}
              <span className="text-xs tabular-nums shrink-0" style={{ color: level.color }}>
                {pctLabel}
              </span>

              {/* Badge */}
              <span
                className="text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap hidden sm:inline shrink-0"
                style={{ color: level.color, backgroundColor: level.bg, border: `1px solid ${level.border}` }}
              >
                {level.label}
              </span>
            </div>
          )
        })}
      </div>

      {days.some((d) => d.predicted) && (
        <p className="mt-1.5 text-xs text-[#B0AE9D] px-0.5">* predicted crowd level</p>
      )}
    </div>
  )
}
