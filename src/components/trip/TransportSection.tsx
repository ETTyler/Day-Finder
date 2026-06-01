import type { TravelData } from '@/lib/tripTypes'
import PinDecoration from './PinDecoration'
import DriveCard from './DriveCard'
import FlightCard from './FlightCard'
import TrainCard from './TrainCard'

export default function TransportSection({ data }: { data: TravelData }) {
  const { modes, drive, flight, train, driveUnavailable } = data

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <PinDecoration />
        <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-[#706F5C]">
          How to get there
        </h2>
        <div className="flex-1 border-t border-dashed border-[#C8C4B0]" />
      </div>

      <div className="space-y-3">
        {modes.includes('drive') && (
          <DriveCard drive={drive} unavailable={driveUnavailable} />
        )}
        {modes.includes('flight') && flight && (
          <FlightCard flight={flight} />
        )}
        {modes.includes('train') && train && (
          <TrainCard train={train} />
        )}
      </div>
    </div>
  )
}
