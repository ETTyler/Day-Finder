import TripClient from './TripClient'
import type { TripPageParams } from '@/lib/tripTypes'

interface Props {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function TripPage({ searchParams }: Props) {
  const p = await searchParams
  const params: TripPageParams = {
    parkId:      p.parkId,
    parkName:    p.parkName,
    parkCountry: p.parkCountry,
    checkIn:     p.checkIn,
    checkOut:    p.checkOut,
    days:        p.days,
  }
  return <TripClient params={params} />
}
