import type { Park, DayResult, Filters } from '@/lib/types'
import type { AccommodationOptions, Coords } from '@/lib/tripTypes'

const PREMIUM_COUNTRIES = ['Switzerland', 'Norway', 'Denmark', 'Sweden', 'Iceland', 'Finland', 'Japan', 'Singapore', 'Australia']
const BUDGET_COUNTRIES  = ['Bulgaria', 'Romania', 'Poland', 'Hungary', 'Czech Republic', 'Croatia', 'Portugal', 'Mexico', 'Turkey', 'Thailand', 'Vietnam', 'Indonesia', 'Malaysia']

export function getPriceTier(country: string): 'budget' | 'mid' | 'premium' {
  if (PREMIUM_COUNTRIES.includes(country)) return 'premium'
  if (BUDGET_COUNTRIES.includes(country))  return 'budget'
  return 'mid'
}

const TIER_LABELS: Record<string, string> = {
  budget:  'Budget (~€40–80/night)',
  mid:     'Mid-range (~€80–200/night)',
  premium: 'Premium (~€150–350/night)',
}

export function buildAccommodationLinks(
  parkName: string,
  parkCountry: string,
  checkIn?: string,
  checkOut?: string,
): AccommodationOptions {
  const tier = getPriceTier(parkCountry)
  const dest = `${parkName} ${parkCountry}`
  const slug = `${parkName}--${parkCountry}`.replace(/\s+/g, '-')

  const bookingParams = new URLSearchParams({
    ss: dest,
    group_adults: '2',
    no_rooms: '1',
  })
  if (checkIn)  bookingParams.set('checkin',  checkIn)
  if (checkOut) bookingParams.set('checkout', checkOut)

  const airbnbParams = new URLSearchParams({ adults: '2' })
  if (checkIn)  airbnbParams.set('checkin',  checkIn)
  if (checkOut) airbnbParams.set('checkout', checkOut)

  return {
    bookingUrl:    `https://www.booking.com/searchresults.html?${bookingParams}`,
    airbnbUrl:     `https://www.airbnb.com/s/${encodeURIComponent(slug)}/homes?${airbnbParams}`,
    priceTier:     tier,
    priceTierLabel: TIER_LABELS[tier],
  }
}

export function buildSkyscannerUrl(
  originIata: string, destIata: string, checkIn?: string, checkOut?: string,
): string {
  const fmt = (iso: string) => { const [y, m, d] = iso.split('-'); return y.slice(2) + m + d }
  if (checkIn && checkOut) {
    return `https://www.skyscanner.net/transport/flights/${originIata}/${destIata}/${fmt(checkIn)}/${fmt(checkOut)}/`
  }
  if (checkIn) {
    return `https://www.skyscanner.net/transport/flights/${originIata}/${destIata}/${fmt(checkIn)}/`
  }
  return `https://www.skyscanner.net/transport/flights/${originIata}/${destIata}/`
}

export function buildOmioUrl(fromCity: string, parkCity: string, checkIn?: string): string {
  const date = checkIn || new Date().toISOString().slice(0, 10)
  return `https://www.omio.com/results/${encodeURIComponent(fromCity)}/${encodeURIComponent(parkCity)}/${date}?adults=1`
}

export function buildTrainlineUrl(fromCity: string, parkCity: string, checkIn?: string): string {
  const params = new URLSearchParams({
    origin:      fromCity,
    destination: parkCity,
  })
  if (checkIn) params.set('outwardDate', `${checkIn}T08:00:00`)
  return `https://www.thetrainline.com/search?${params}`
}

export function buildGoogleMapsUrl(origin: Coords, dest: Coords): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lon}&destination=${dest.lat},${dest.lon}&travelmode=driving`
}

export function buildGoogleTransitUrl(origin: Coords, dest: Coords): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lon}&destination=${dest.lat},${dest.lon}&travelmode=transit`
}

export function buildTripUrl(park: Park, filters: Filters, days: DayResult[]): string {
  const p = new URLSearchParams({
    parkId:      String(park.id),
    parkName:    park.name,
    parkCountry: park.country,
  })
  if (filters.useCustomDates && filters.startDate) p.set('checkIn',  filters.startDate)
  if (filters.useCustomDates && filters.endDate)   p.set('checkOut', filters.endDate)
  if (days.length > 0) p.set('days', JSON.stringify(days))
  return `/trip?${p.toString()}`
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`
  return `${Math.round(km)} km`
}
