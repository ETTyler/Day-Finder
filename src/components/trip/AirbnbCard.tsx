interface Props {
  airbnbUrl: string
  parkName: string
  priceTierLabel: string
}

export default function AirbnbCard({ airbnbUrl, parkName, priceTierLabel }: Props) {
  return (
    <div className="rounded-xl border border-[#E4E2D9] bg-white overflow-hidden">
      <div className="h-1.5 bg-[#FF5A5F]" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-sm font-semibold text-[#1C1B14]">Airbnb</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F4EF] text-[#706F5C] border border-[#E4E2D9] shrink-0">
            {priceTierLabel}
          </span>
        </div>
        <p className="text-xs text-[#706F5C] mb-3">Homes, cottages &amp; unique stays near {parkName}</p>
        <a
          href={airbnbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs font-medium py-2 rounded-lg bg-[#FF5A5F] text-white hover:bg-[#E04A4F] transition-colors"
        >
          Browse listings
        </a>
      </div>
    </div>
  )
}
