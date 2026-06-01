import type { Coords } from '@/lib/tripTypes'

const NOMINATIM = 'https://nominatim.openstreetmap.org'
const UA = 'DayFinder/1.0 (zonedisme@gmail.com)'

export async function geocodeLocation(query: string): Promise<Coords> {
  const url = `${NOMINATIM}/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=0`
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    next: { revalidate: 86400 },
  })
  if (!res.ok) throw new Error(`Nominatim returned ${res.status}`)
  const data = await res.json()
  if (!data.length) throw new Error(`Could not find location: "${query}"`)
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
}

export async function geocodeWithCountry(query: string): Promise<{ coords: Coords; countryCode: string }> {
  const url = `${NOMINATIM}/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    next: { revalidate: 86400 },
  })
  if (!res.ok) throw new Error(`Nominatim returned ${res.status}`)
  const data = await res.json()
  if (!data.length) throw new Error(`Could not find location: "${query}"`)
  return {
    coords: { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) },
    countryCode: (data[0].address?.country_code ?? '').toLowerCase(),
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<{ city: string; countryCode: string }> {
  const url = `${NOMINATIM}/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    next: { revalidate: 86400 },
  })
  if (!res.ok) throw new Error(`Nominatim reverse returned ${res.status}`)
  const data = await res.json()
  const addr = data.address ?? {}
  const city =
    addr.city   ||
    addr.town   ||
    addr.village ||
    addr.municipality ||
    addr.county ||
    addr.state  ||
    (data.display_name as string).split(',')[0].trim()
  return { city, countryCode: (addr.country_code ?? '').toLowerCase() }
}

export function haversineKm(a: Coords, b: Coords): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(x))
}
