import type { DriveOption } from '@/lib/tripTypes'

export default function DriveCard({ drive, unavailable }: { drive: DriveOption | null; unavailable?: boolean }) {
  return (
    <div className="relative rounded-xl border-2 border-[#2D6A4F] bg-white overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2D6A4F]" />
      <div className="pl-5 pr-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-[#2D6A4F] shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M3 7l1.5-3.5A1 1 0 015.4 3h9.2a1 1 0 01.9.5L17 7H3zm-1 1h16l.5 1.5A2 2 0 0116.5 12H15v1a1 1 0 01-2 0v-1H7v1a1 1 0 01-2 0v-1H3.5a2 2 0 01-2-2.5L2 8z" />
          </svg>
          <span className="text-[#2D6A4F] font-bold text-xs tracking-wider uppercase">Drive</span>
        </div>

        {drive ? (
          <>
            <div className="text-2xl font-bold text-[#1C1B14] tabular-nums">{drive.durationLabel}</div>
            <div className="text-sm text-[#706F5C] mt-0.5">{drive.distanceLabel}</div>
            <a
              href={drive.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#2D6A4F] hover:text-[#1B4332] font-medium"
            >
              Open in Google Maps
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M2 10L10 2M10 2H5M10 2v5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </>
        ) : unavailable ? (
          <p className="text-sm text-[#706F5C]">Driving route unavailable for this destination.</p>
        ) : null}
      </div>
    </div>
  )
}
