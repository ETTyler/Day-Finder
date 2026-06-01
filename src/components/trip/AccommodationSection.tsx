import type { AccommodationOptions } from '@/lib/tripTypes'
import PinDecoration from './PinDecoration'
import BookingCard from './BookingCard'
import AirbnbCard from './AirbnbCard'

interface Props {
  accommodation: AccommodationOptions
  parkName: string
  hasDates: boolean
}

export default function AccommodationSection({ accommodation, parkName, hasDates }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <PinDecoration color="#706F5C" />
        <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-[#706F5C]">
          Where to stay
        </h2>
        <div className="flex-1 border-t border-dashed border-[#C8C4B0]" />
      </div>

      {!hasDates && (
        <p className="text-xs text-[#9E9D8C] mb-3 px-0.5">
          Add travel dates for date-specific availability.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
        <BookingCard
          bookingUrl={accommodation.bookingUrl}
          parkName={parkName}
          priceTierLabel={accommodation.priceTierLabel}
        />
        <AirbnbCard
          airbnbUrl={accommodation.airbnbUrl}
          parkName={parkName}
          priceTierLabel={accommodation.priceTierLabel}
        />
      </div>
    </div>
  )
}
