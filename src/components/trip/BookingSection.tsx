'use client'

import { useState, useEffect, useRef } from 'react'
import type { FlightBooking, AccommodationBooking } from '@/lib/tripTypes'
import PinDecoration from './PinDecoration'

interface Props {
  parkId?: string
  checkIn?: string
  checkOut?: string
  originAirport?: { iata: string; name: string }
  destAirport?: { iata: string; name: string }
  onBookingsChange?: (f: FlightBooking, a: AccommodationBooking) => void
}

function emptyFlight(checkIn = '', originIata = '', destIata = ''): FlightBooking {
  return {
    airline: '', flightNumber: '', departDate: checkIn, departTime: '',
    arriveTime: '', departAirport: originIata, arriveAirport: destIata,
    bookingRef: '', hasReturn: true, returnFlightNumber: '',
    returnDepartDate: '', returnDepartTime: '', returnArriveTime: '',
  }
}

function emptyAccom(checkIn = '', checkOut = ''): AccommodationBooking {
  return {
    propertyName: '', address: '', bookingRef: '',
    checkInDate: checkIn, checkInTime: '', checkOutDate: checkOut, checkOutTime: '', phone: '',
  }
}

function storageKey(parkId?: string, checkIn?: string, checkOut?: string) {
  return parkId && checkIn && checkOut ? `trip-bookings-${parkId}-${checkIn}-${checkOut}` : null
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-[#9E9D8C] mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E4E2D9] bg-[#FAFAF7] text-[#1C1B14] focus:outline-none focus:ring-1 focus:ring-[#C8440B]/30 focus:border-[#C8440B]'

export default function BookingSection({ parkId, checkIn, checkOut, originAirport, destAirport, onBookingsChange }: Props) {
  const [flight, setFlight] = useState<FlightBooking>(() =>
    emptyFlight(checkIn, originAirport?.iata, destAirport?.iata))
  const [accom,  setAccom]  = useState<AccommodationBooking>(() => emptyAccom(checkIn, checkOut))
  const [flightOpen, setFlightOpen] = useState(false)
  const [accomOpen,  setAccomOpen]  = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Pre-fill airports when travelData loads
  useEffect(() => {
    if (originAirport?.iata) setFlight(f => f.departAirport ? f : { ...f, departAirport: originAirport.iata })
    if (destAirport?.iata)   setFlight(f => f.arriveAirport ? f : { ...f, arriveAirport: destAirport.iata })
  }, [originAirport?.iata, destAirport?.iata])

  // Pre-fill dates when they arrive
  useEffect(() => {
    if (checkIn)  { setFlight(f => f.departDate ? f : { ...f, departDate: checkIn }) }
    if (checkIn)  { setAccom(a => a.checkInDate  ? a : { ...a, checkInDate:  checkIn  }) }
    if (checkOut) { setAccom(a => a.checkOutDate ? a : { ...a, checkOutDate: checkOut }) }
  }, [checkIn, checkOut])

  // Load from localStorage
  useEffect(() => {
    const key = storageKey(parkId, checkIn, checkOut)
    if (!key) return
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return
      const saved = JSON.parse(raw)
      if (saved.flight) setFlight(saved.flight)
      if (saved.accom)  setAccom(saved.accom)
    } catch {}
  }, [parkId, checkIn, checkOut])

  // Auto-save with debounce
  useEffect(() => {
    onBookingsChange?.(flight, accom)
    const key = storageKey(parkId, checkIn, checkOut)
    if (!key) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify({ flight, accom }))
    }, 600)
    return () => clearTimeout(saveTimer.current)
  }, [flight, accom, parkId, checkIn, checkOut])

  const upF = (patch: Partial<FlightBooking>) => setFlight(f => ({ ...f, ...patch }))
  const upA = (patch: Partial<AccommodationBooking>) => setAccom(a => ({ ...a, ...patch }))

  const flightFilled = !!(flight.airline || flight.flightNumber || flight.bookingRef)
  const accomFilled  = !!(accom.propertyName || accom.bookingRef)

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <PinDecoration color="#706F5C" />
        <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-[#706F5C]">My Bookings</h2>
        <div className="flex-1 border-t border-dashed border-[#C8C4B0]" />
      </div>

      <div className="space-y-3">
        {/* Flight booking card */}
        <div className="rounded-xl border border-[#BFDBFE] bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setFlightOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#2563EB] shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-[#1C1B14]">My Flight</p>
                {flightFilled && !flightOpen && (
                  <p className="text-xs text-[#706F5C] mt-0.5">
                    {[flight.airline, flight.flightNumber].filter(Boolean).join(' ')}
                    {flight.bookingRef && ` · Ref: ${flight.bookingRef}`}
                  </p>
                )}
                {!flightFilled && (
                  <p className="text-xs text-[#9E9D8C] mt-0.5">Add your booked flight details</p>
                )}
              </div>
            </div>
            <svg className={`w-4 h-4 text-[#9E9D8C] shrink-0 transition-transform ${flightOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {flightOpen && (
            <div className="px-4 pb-4 border-t border-[#BFDBFE] pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Airline">
                  <input className={inputCls} value={flight.airline} onChange={e => upF({ airline: e.target.value })} placeholder="e.g. British Airways" />
                </Field>
                <Field label="Flight number">
                  <input className={inputCls} value={flight.flightNumber} onChange={e => upF({ flightNumber: e.target.value })} placeholder="e.g. BA334" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Departs from (IATA)">
                  <input className={inputCls} value={flight.departAirport} onChange={e => upF({ departAirport: e.target.value.toUpperCase() })} placeholder="e.g. LHR" maxLength={4} />
                </Field>
                <Field label="Arrives at (IATA)">
                  <input className={inputCls} value={flight.arriveAirport} onChange={e => upF({ arriveAirport: e.target.value.toUpperCase() })} placeholder="e.g. CDG" maxLength={4} />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Departure date">
                  <input type="date" className={inputCls} value={flight.departDate} onChange={e => upF({ departDate: e.target.value })} />
                </Field>
                <Field label="Departs">
                  <input type="time" className={inputCls} value={flight.departTime} onChange={e => upF({ departTime: e.target.value })} />
                </Field>
                <Field label="Arrives">
                  <input type="time" className={inputCls} value={flight.arriveTime} onChange={e => upF({ arriveTime: e.target.value })} />
                </Field>
              </div>
              <Field label="Booking reference">
                <input className={inputCls} value={flight.bookingRef} onChange={e => upF({ bookingRef: e.target.value })} placeholder="e.g. ABCDEF" />
              </Field>

              {/* Return flight toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" checked={flight.hasReturn} onChange={e => upF({ hasReturn: e.target.checked })} className="rounded accent-[#C8440B]" />
                <span className="text-xs text-[#706F5C]">Include return flight</span>
              </label>

              {flight.hasReturn && (
                <div className="space-y-3 pt-1 border-t border-[#E4E2D9]">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Return flight number">
                      <input className={inputCls} value={flight.returnFlightNumber} onChange={e => upF({ returnFlightNumber: e.target.value })} placeholder="e.g. BA335" />
                    </Field>
                    <Field label="Return departure date">
                      <input type="date" className={inputCls} value={flight.returnDepartDate} onChange={e => upF({ returnDepartDate: e.target.value })} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Return departs">
                      <input type="time" className={inputCls} value={flight.returnDepartTime} onChange={e => upF({ returnDepartTime: e.target.value })} />
                    </Field>
                    <Field label="Return arrives">
                      <input type="time" className={inputCls} value={flight.returnArriveTime} onChange={e => upF({ returnArriveTime: e.target.value })} />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accommodation booking card */}
        <div className="rounded-xl border border-[#E4E2D9] bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setAccomOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#2D6A4F] shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-[#1C1B14]">My Accommodation</p>
                {accomFilled && !accomOpen && (
                  <p className="text-xs text-[#706F5C] mt-0.5">
                    {accom.propertyName}
                    {accom.bookingRef && ` · Ref: ${accom.bookingRef}`}
                  </p>
                )}
                {!accomFilled && (
                  <p className="text-xs text-[#9E9D8C] mt-0.5">Add your accommodation booking</p>
                )}
              </div>
            </div>
            <svg className={`w-4 h-4 text-[#9E9D8C] shrink-0 transition-transform ${accomOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {accomOpen && (
            <div className="px-4 pb-4 border-t border-[#E4E2D9] pt-4 space-y-3">
              <Field label="Property name">
                <input className={inputCls} value={accom.propertyName} onChange={e => upA({ propertyName: e.target.value })} placeholder="e.g. Newport Bay Club" />
              </Field>
              <Field label="Address">
                <textarea
                  rows={2}
                  className={`${inputCls} resize-none`}
                  value={accom.address}
                  onChange={e => upA({ address: e.target.value })}
                  placeholder="Full address"
                />
              </Field>
              <Field label="Booking reference">
                <input className={inputCls} value={accom.bookingRef} onChange={e => upA({ bookingRef: e.target.value })} placeholder="Booking ref or confirmation number" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Check-in date">
                  <input type="date" className={inputCls} value={accom.checkInDate} onChange={e => upA({ checkInDate: e.target.value })} />
                </Field>
                <Field label="Check-in time">
                  <input type="time" className={inputCls} value={accom.checkInTime} onChange={e => upA({ checkInTime: e.target.value })} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Check-out date">
                  <input type="date" className={inputCls} value={accom.checkOutDate} onChange={e => upA({ checkOutDate: e.target.value })} />
                </Field>
                <Field label="Check-out time">
                  <input type="time" className={inputCls} value={accom.checkOutTime} onChange={e => upA({ checkOutTime: e.target.value })} />
                </Field>
              </div>
              <Field label="Phone / contact">
                <input className={inputCls} value={accom.phone} onChange={e => upA({ phone: e.target.value })} placeholder="e.g. +33 1 60 45 55 00" />
              </Field>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
