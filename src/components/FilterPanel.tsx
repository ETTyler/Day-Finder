'use client'

import type { Filters } from '@/lib/types'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const WEEKDAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
}

export default function FilterPanel({ filters, onChange }: Props) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  const toggleWeekday = (i: number) => {
    const next = filters.weekdays.includes(i)
      ? filters.weekdays.filter((d) => d !== i)
      : [...filters.weekdays, i].sort((a, b) => a - b)
    if (next.length > 0) update({ weekdays: next })
  }

  const allWeekdays = filters.weekdays.length === 7
  const toggleAll = () => update({ weekdays: allWeekdays ? [0] : [0, 1, 2, 3, 4, 5, 6] })

  const dateError =
    filters.useCustomDates &&
    !!filters.startDate &&
    !!filters.endDate &&
    filters.endDate <= filters.startDate

  return (
    <div className="rounded-xl border border-[#E4E2D9] bg-white divide-y divide-[#F0EEE6]">

      {/* Date range */}
      <div className="px-4 py-3.5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#706F5C] uppercase tracking-wider">
            Date range
          </span>
          <button
            onClick={() => update({ useCustomDates: !filters.useCustomDates })}
            className="text-xs text-[#C8440B] hover:text-[#A83604] transition-colors"
          >
            {filters.useCustomDates ? 'Use days ahead' : 'Custom dates'}
          </button>
        </div>

        {filters.useCustomDates ? (
          <>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => update({ startDate: e.target.value })}
                className={`flex-1 text-sm px-3 py-1.5 rounded-lg border text-[#1C1B14] bg-[#FAFAF7] outline-none transition-colors ${
                  dateError ? 'border-red-300 focus:border-red-400' : 'border-[#E4E2D9] focus:border-[#C8440B]'
                }`}
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => update({ endDate: e.target.value })}
                className={`flex-1 text-sm px-3 py-1.5 rounded-lg border text-[#1C1B14] bg-[#FAFAF7] outline-none transition-colors ${
                  dateError ? 'border-red-300 focus:border-red-400' : 'border-[#E4E2D9] focus:border-[#C8440B]'
                }`}
              />
            </div>
            {dateError && (
              <p className="mt-1.5 text-xs text-red-500">End date must be after start date.</p>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={7}
              max={180}
              step={1}
              value={filters.daysAhead}
              onChange={(e) => update({ daysAhead: parseInt(e.target.value) })}
              className="flex-1 accent-[#C8440B] h-1"
            />
            <span className="text-sm text-[#1C1B14] w-20 text-right tabular-nums">
              {filters.daysAhead} days
            </span>
          </div>
        )}
      </div>

      {/* Weekdays */}
      <div className="px-4 py-3.5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#706F5C] uppercase tracking-wider">
            Days of week
          </span>
          <button
            onClick={toggleAll}
            className="text-xs text-[#C8440B] hover:text-[#A83604] transition-colors"
          >
            {allWeekdays ? 'Clear all' : 'Select all'}
          </button>
        </div>
        <div className="flex gap-1.5">
          {WEEKDAYS.map((label, i) => (
            <button
              key={i}
              title={WEEKDAY_FULL[i]}
              onClick={() => toggleWeekday(i)}
              className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors select-none ${
                filters.weekdays.includes(i)
                  ? 'bg-[#C8440B] text-white'
                  : 'bg-[#F5F4EF] text-[#706F5C] hover:bg-[#EDEAE0] border border-[#E4E2D9]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Max crowd + top N */}
      <div className="px-4 py-3.5 flex gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#706F5C] uppercase tracking-wider">
              Max crowd
            </span>
            <span className="text-xs text-[#1C1B14] tabular-nums">{filters.maxCrowd}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={filters.maxCrowd}
            onChange={(e) => update({ maxCrowd: parseInt(e.target.value) })}
            className="w-full accent-[#C8440B] h-1"
          />
        </div>

        <div className="w-28 shrink-0">
          <span className="text-xs font-semibold text-[#706F5C] uppercase tracking-wider block mb-3">
            Show top
          </span>
          <select
            value={filters.topN}
            onChange={(e) => update({ topN: parseInt(e.target.value) })}
            className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-[#E4E2D9] bg-[#FAFAF7] text-[#1C1B14] outline-none focus:border-[#C8440B] transition-colors"
          >
            {[5, 10, 15, 20, 30].map((n) => (
              <option key={n} value={n}>{n} days</option>
            ))}
          </select>
        </div>
      </div>

    </div>
  )
}
