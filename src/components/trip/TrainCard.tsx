import type { TrainOption } from '@/lib/tripTypes'

export default function TrainCard({ train }: { train: TrainOption }) {
  return (
    <div className="rounded-xl border-2 border-[#7C2D12] overflow-hidden">
      {/* Ticket header band */}
      <div className="bg-[#7C2D12] px-4 py-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-white/80 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zm0 2h10v8H5V4zm0 10h10v1H5v-1zm2-7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
        </svg>
        <span className="text-white font-bold text-xs tracking-widest uppercase">Train / Rail</span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 bg-[#FFF7F5] space-y-3">
        <p className="text-xs text-[#706F5C]">{train.note}</p>
        <div className="flex gap-2 flex-wrap">
          {/* Google Maps transit — most reliable */}
          <a
            href={train.googleTransitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#7C2D12] text-white hover:bg-[#991B1B] transition-colors"
          >
            Google Maps transit
          </a>
          <a
            href={train.omioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#7C2D12] text-[#7C2D12] hover:bg-[#FEF2F2] transition-colors"
          >
            Omio
          </a>
          <a
            href={train.trainlineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#7C2D12] text-[#7C2D12] hover:bg-[#FEF2F2] transition-colors"
          >
            Trainline
          </a>
        </div>
      </div>
    </div>
  )
}
