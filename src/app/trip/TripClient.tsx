'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import type { TripPageParams, TravelData, FlightBooking, AccommodationBooking, DayPlan } from '@/lib/tripTypes'
import type { DayResult, Park } from '@/lib/types'
import ParkSearch from '@/components/ParkSearch'
import LocationInput from '@/components/trip/LocationInput'
import TripBoard from '@/components/trip/TripBoard'
import PlanBuilder from '@/components/trip/PlanBuilder'
import BookingSection from '@/components/trip/BookingSection'
import PrintLayout from '@/components/trip/PrintLayout'

const SESSION_KEY = 'trip-session'

interface TripSession {
  parkId:      string
  parkName:    string
  parkCountry: string
  checkIn:     string
  checkOut:    string
}

function emptyFlight(): FlightBooking {
  return { airline: '', flightNumber: '', departDate: '', departTime: '', arriveTime: '',
           departAirport: '', arriveAirport: '', bookingRef: '', hasReturn: true,
           returnFlightNumber: '', returnDepartDate: '', returnDepartTime: '', returnArriveTime: '' }
}
function emptyAccom(): AccommodationBooking {
  return { propertyName: '', address: '', bookingRef: '', checkInDate: '',
           checkInTime: '', checkOutDate: '', checkOutTime: '', phone: '' }
}

interface Props { params: TripPageParams }

export default function TripClient({ params }: Props) {
  const hasParkFromUrl = !!(params.parkName && params.parkCountry)

  const days = useMemo<DayResult[]>(() => {
    try { return params.days ? JSON.parse(params.days) : [] }
    catch { return [] }
  }, [params.days])

  const [localPark,   setLocalPark]   = useState<Park | null>(null)
  const [tripStart,   setTripStart]   = useState(params.checkIn  || '')
  const [tripEnd,     setTripEnd]     = useState(params.checkOut || '')
  const [travelData,  setTravelData]  = useState<TravelData | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  // Export data — lifted from PlanBuilder + BookingSection
  const [exportPlans,  setExportPlans]  = useState<DayPlan[]>([])
  const [exportCrowd,  setExportCrowd]  = useState<DayResult[]>([])
  const [flightBook,   setFlightBook]   = useState<FlightBooking>(emptyFlight)
  const [accomBook,    setAccomBook]    = useState<AccommodationBooking>(emptyAccom)

  const activeParkName    = params.parkName    || localPark?.name    || ''
  const activeParkCountry = params.parkCountry || localPark?.country || ''
  const activeParkId      = params.parkId      || localPark?.id?.toString()
  const hasPark = !!(activeParkName && activeParkCountry)

  // Restore last session from localStorage on mount
  useEffect(() => {
    if (hasParkFromUrl && params.checkIn && params.checkOut) return
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) return
      const s = JSON.parse(raw) as TripSession
      if (!hasParkFromUrl && s.parkName && s.parkCountry)
        setLocalPark({ id: parseInt(s.parkId || '0'), name: s.parkName, country: s.parkCountry, group: '' })
      if (!params.checkIn  && s.checkIn)  setTripStart(s.checkIn)
      if (!params.checkOut && s.checkOut) setTripEnd(s.checkOut)
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist session whenever park + dates are known
  useEffect(() => {
    if (!activeParkId || !activeParkName || !activeParkCountry || !tripStart || !tripEnd) return
    const session: TripSession = { parkId: activeParkId, parkName: activeParkName, parkCountry: activeParkCountry, checkIn: tripStart, checkOut: tripEnd }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    const exp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `trip-session=1;expires=${exp};path=/;SameSite=Lax`
  }, [activeParkId, activeParkName, activeParkCountry, tripStart, tripEnd])

  const handleSearch = async (fromLocation: string) => {
    if (!hasPark) return
    setLoading(true); setError(null); setTravelData(null)
    const qs = new URLSearchParams({ fromLocation, parkName: activeParkName, parkCountry: activeParkCountry })
    if (tripStart) qs.set('checkIn',  tripStart)
    if (tripEnd)   qs.set('checkOut', tripEnd)
    try {
      const res  = await fetch(`/api/trip/travel?${qs}`)
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? 'Something went wrong')
      setTravelData(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch travel data')
    } finally {
      setLoading(false)
    }
  }

  const handleExportReady = useCallback((plans: DayPlan[], crowdData: DayResult[]) => {
    setExportPlans(plans)
    setExportCrowd(crowdData)
  }, [])

  const handleBookingsChange = useCallback((f: FlightBooking, a: AccommodationBooking) => {
    setFlightBook(f); setAccomBook(a)
  }, [])

  const handleExportPdf = () => {
    const source = document.getElementById('print-layout')
    if (!source) return

    // Clone the hidden print layout and attach as a direct child of <body>
    // so the @media print visibility rules can reach it without ancestor interference
    const overlay = source.cloneNode(true) as HTMLElement
    overlay.id = 'temp-print-overlay'
    overlay.style.display = 'block'   // source has display:none; override it on the clone
    document.body.appendChild(overlay)

    window.print()

    document.body.removeChild(overlay)
  }

  const hasDates  = !!(tripStart && tripEnd && tripEnd >= tripStart)
  const dateError = !!(tripStart && tripEnd && tripEnd < tripStart)

  return (
    <div
      className="min-h-screen bg-[#F5F4EF]"
      style={{ backgroundImage: 'radial-gradient(circle, #D6D2C0 1px, transparent 1px)', backgroundSize: '24px 24px' }}
    >
      <div className="max-w-3xl mx-auto px-5 py-10">

        {/* Back link + Export button */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#706F5C] hover:text-[#1C1B14] transition-colors">
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M8 2L4 6l4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Day Finder
          </Link>
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C8440B] text-[#C8440B] text-xs font-medium hover:bg-[#C8440B] hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 11v2a1 1 0 001 1h8a1 1 0 001-1v-2M8 2v7M5 6l3 3 3-3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export PDF
          </button>
        </div>

        {/* Board panel */}
        <div className="bg-[#EDE9DD] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-[#D9D4C4] p-6 md:p-10">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-[#1C1B14]">Trip Planner</h1>
            <p className="mt-1 text-sm text-[#706F5C]">
              {activeParkName
                ? <>{activeParkName}{activeParkCountry && <span className="text-[#9E9D8C]"> · {activeParkCountry}</span>}</>
                : 'Select a park to start planning.'}
            </p>
          </div>

          {/* ① Park selector */}
          {!hasParkFromUrl && (
            <div className="mb-5">
              <label className="block text-xs font-medium text-[#706F5C] mb-2 tracking-wide uppercase">Which park?</label>
              <ParkSearch
                selected={localPark}
                onSelect={p => { setLocalPark(p); setTravelData(null); setError(null) }}
                onClear={() => { setLocalPark(null); setTravelData(null); setError(null) }}
              />
            </div>
          )}

          {/* ② Trip dates */}
          {hasPark && (
            <div className="mb-5">
              <label className="block text-xs font-medium text-[#706F5C] mb-2 tracking-wide uppercase">Trip dates</label>
              <div className="flex flex-wrap gap-3 items-start">
                <div>
                  <p className="text-xs text-[#9E9D8C] mb-1">Check in</p>
                  <input type="date" value={tripStart} onChange={e => { setTripStart(e.target.value); setTravelData(null) }}
                    className="px-3 py-2 text-sm rounded-lg border border-[#E4E2D9] bg-[#FAFAF7] text-[#1C1B14] focus:outline-none focus:ring-2 focus:ring-[#C8440B]/30 focus:border-[#C8440B]" />
                </div>
                <div>
                  <p className="text-xs text-[#9E9D8C] mb-1">Check out</p>
                  <input type="date" value={tripEnd} min={tripStart || undefined} onChange={e => { setTripEnd(e.target.value); setTravelData(null) }}
                    className="px-3 py-2 text-sm rounded-lg border border-[#E4E2D9] bg-[#FAFAF7] text-[#1C1B14] focus:outline-none focus:ring-2 focus:ring-[#C8440B]/30 focus:border-[#C8440B]" />
                </div>
              </div>
              {dateError && <p className="text-xs text-red-600 mt-1.5">Check-out must be after check-in.</p>}
            </div>
          )}

          {/* ③ Travel section */}
          {hasPark && (
            <>
              <div className="mb-2">
                <label className="block text-xs font-medium text-[#706F5C] mb-2 tracking-wide uppercase">Starting from</label>
                <LocationInput onSearch={handleSearch} loading={loading} />
              </div>
              {error && <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
              {travelData && (
                <TripBoard travelData={travelData} parkName={activeParkName} checkIn={tripStart} checkOut={tripEnd} days={days} />
              )}
              {!travelData && !loading && !error && (
                <div className="mt-6 text-center">
                  <p className="text-xs text-[#B0AE9D]">Enter your starting location above to see transport options and accommodation.</p>
                </div>
              )}
            </>
          )}

          {/* ④ Booking details */}
          {hasPark && (
            <div className="mt-8 pt-8 border-t border-[#D9D4C4]">
              <BookingSection
                parkId={activeParkId}
                checkIn={tripStart}
                checkOut={tripEnd}
                originAirport={travelData?.flight?.originAirport}
                destAirport={travelData?.flight?.destAirport}
                onBookingsChange={handleBookingsChange}
              />
            </div>
          )}

          {/* ⑤ Itinerary builder */}
          {hasPark && (
            <div className="mt-8 pt-8 border-t border-[#D9D4C4]">
              <PlanBuilder
                checkIn={tripStart}
                checkOut={tripEnd}
                days={days}
                parkName={activeParkName}
                parkId={activeParkId}
                onExportReady={handleExportReady}
              />
            </div>
          )}

        </div>
      </div>

      {/* Print layout — hidden on screen, shown when printing */}
      <PrintLayout
        parkName={activeParkName}
        parkCountry={activeParkCountry}
        tripStart={tripStart}
        tripEnd={tripEnd}
        travelData={travelData}
        flightBooking={flightBook}
        accommodationBooking={accomBook}
        plans={exportPlans}
        crowdData={exportCrowd}
      />
    </div>
  )
}
