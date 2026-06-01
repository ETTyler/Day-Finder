import type { FlightOption } from '@/lib/tripTypes'

export default function FlightCard({ flight }: { flight: FlightOption }) {
  return (
    <div className="rounded-xl border border-[#BFDBFE] overflow-hidden">
      {/* Boarding pass header */}
      <div className="px-4 pt-4 pb-3 bg-[#2563EB]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-white/80" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <span className="text-white font-bold text-xs tracking-widest uppercase">Boarding Pass</span>
          </div>
          <span className="text-blue-200 text-xs">Est.</span>
        </div>

        {/* Airport route */}
        <div className="flex items-center gap-2 mb-2">
          <div className="text-center">
            <div className="text-white text-xl font-bold tabular-nums tracking-wider">
              {flight.originAirport.iata}
            </div>
            <div className="text-blue-200 text-xs truncate max-w-[80px]">{flight.originAirport.name}</div>
          </div>
          <div className="flex-1 flex items-center gap-1 px-1">
            <div className="flex-1 border-t border-dashed border-blue-300/60" />
            <svg className="w-3.5 h-3.5 text-blue-200 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8.5 1.5a1 1 0 00-1 0L1 5v2l5-1.5V9l-2 1v1.5l3-1 3 1V10l-2-1V5.5l5 1.5V5L8.5 1.5z" />
            </svg>
            <div className="flex-1 border-t border-dashed border-blue-300/60" />
          </div>
          <div className="text-center">
            <div className="text-white text-xl font-bold tabular-nums tracking-wider">
              {flight.destAirport.iata}
            </div>
            <div className="text-blue-200 text-xs truncate max-w-[80px]">{flight.destAirport.name}</div>
          </div>
        </div>

        <div className="text-white text-2xl font-bold tabular-nums">{flight.durationLabel}</div>
        <div className="text-blue-200 text-xs mt-0.5">{flight.distanceKm.toLocaleString()} km</div>
      </div>

      {/* Perforated divider */}
      <div className="relative h-4 bg-[#EFF6FF]">
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-[#BFDBFE]" />
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#EDE9DD]" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#EDE9DD]" />
      </div>

      {/* Body */}
      <div className="px-4 py-3 bg-[#EFF6FF]">
        <p className="text-xs text-[#706F5C] mb-2.5">{flight.note}</p>
        <a
          href={flight.skyscannerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8]"
        >
          Search on Skyscanner
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M2 10L10 2M10 2H5M10 2v5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  )
}
