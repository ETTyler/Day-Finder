import type { TravelData } from '@/lib/tripTypes'
import type { DayResult } from '@/lib/types'
import TransportSection from './TransportSection'
import AccommodationSection from './AccommodationSection'
import ItinerarySection from './ItinerarySection'
import PinDecoration from './PinDecoration'

interface Props {
  travelData: TravelData
  parkName: string
  checkIn?: string
  checkOut?: string
  days: DayResult[]
}

export default function TripBoard({ travelData, parkName, checkIn, checkOut, days }: Props) {
  const hasDates = !!(checkIn && checkOut)

  return (
    <div className="mt-6 md:mt-8">
      <div className="md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
        {/* Left column: How to get there */}
        <div>
          <TransportSection data={travelData} />
        </div>

        {/* Right column: Stay + Itinerary */}
        <div className="space-y-6">
          <AccommodationSection
            accommodation={travelData.accommodation}
            parkName={parkName}
            hasDates={hasDates}
          />

          {days.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <PinDecoration color="#C8440B" />
                <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-[#706F5C]">
                  Your best days
                </h2>
                <div className="flex-1 border-t border-dashed border-[#C8C4B0]" />
              </div>
              <ItinerarySection days={days} />
            </div>
          )}
        </div>
      </div>

      {/* Distance note */}
      <p className="mt-6 text-xs text-[#B0AE9D] text-center">
        {travelData.straightLineKm.toLocaleString()} km straight-line distance · Transport modes based on distance
      </p>
    </div>
  )
}
