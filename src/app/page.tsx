'use client'

import { useState } from 'react'
import ParkSearch from '@/components/ParkSearch'
import FilterPanel from '@/components/FilterPanel'
import ResultsTable from '@/components/ResultsTable'
import type { Park, DayResult, Filters } from '@/lib/types'

function todayIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function defaultFilters(): Filters {
  return {
    startDate: todayIso(),
    endDate: '',
    daysAhead: 30,
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    maxCrowd: 100,
    topN: 10,
    useCustomDates: false,
  }
}

export default function Home() {
  const [selectedPark, setSelectedPark] = useState<Park | null>(null)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [results, setResults] = useState<DayResult[] | null>(null)
  const [parkName, setParkName] = useState('')
  const [totalDays, setTotalDays] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectPark = (park: Park) => {
    setSelectedPark(park)
    setResults(null)
    setError(null)
  }

  const handleClearPark = () => {
    setSelectedPark(null)
    setResults(null)
    setError(null)
    setFilters(defaultFilters())
  }

  const handleFindDays = async () => {
    if (!selectedPark) return
    setLoading(true)
    setError(null)
    setResults(null)

    const params = new URLSearchParams({ parkId: String(selectedPark.id) })

    if (filters.useCustomDates && filters.startDate) {
      params.set('startDate', filters.startDate)
      if (filters.endDate) params.set('endDate', filters.endDate)
    } else {
      params.set('daysAhead', String(filters.daysAhead))
    }

    if (filters.weekdays.length < 7) {
      params.set('weekdays', filters.weekdays.join(','))
    }
    if (filters.maxCrowd < 100) params.set('maxCrowd', String(filters.maxCrowd))
    params.set('topN', String(filters.topN))

    try {
      const res = await fetch(`/api/calendar?${params}`)
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? 'Something went wrong')
      setResults(data.days)
      setParkName(data.parkName)
      setTotalDays(data.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const hasResults = results !== null && !loading

  const dateError =
    filters.useCustomDates &&
    !!filters.startDate &&
    !!filters.endDate &&
    filters.endDate <= filters.startDate

  return (
    <div className="min-h-screen bg-[#F5F4EF]">
      <div className="max-w-2xl mx-auto px-5 py-14">

        {/* Header */}
        <div className={`${selectedPark ? 'mb-6' : 'mb-10 text-center'}`}>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1C1B14]">
            Day Finder
          </h1>
          <p className="mt-1 text-sm text-[#706F5C]">
            Find the quietest days to visit any theme park
          </p>
        </div>

        {/* Park search */}
        <ParkSearch
          selected={selectedPark}
          onSelect={handleSelectPark}
          onClear={handleClearPark}
        />

        {/* Filters + CTA */}
        {selectedPark && (
          <div className="mt-5">
            <FilterPanel filters={filters} onChange={setFilters} />

            <button
              onClick={handleFindDays}
              disabled={loading || dateError}
              className="mt-5 w-full py-2.5 rounded-lg bg-[#C8440B] text-white text-sm font-medium hover:bg-[#A83604] active:bg-[#8E2D03] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Fetching data…' : 'Find best days'}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="mt-10 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#C8440B] animate-bounce"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        )}

        {/* Results */}
        {hasResults && (
          <div className="mt-8">
            <ResultsTable
              days={results!}
              parkName={parkName}
              totalDays={totalDays}
              topN={filters.topN}
            />
          </div>
        )}
      </div>
    </div>
  )
}
