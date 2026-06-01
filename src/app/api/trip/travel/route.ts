import { NextRequest, NextResponse } from 'next/server'
import { geocodeWithCountry, reverseGeocode, haversineKm } from '@/lib/geocode'
import { findNearestAirport } from '@/lib/airports'
import {
  buildAccommodationLinks,
  buildGoogleMapsUrl,
  buildGoogleTransitUrl,
  buildSkyscannerUrl,
  buildOmioUrl,
  buildTrainlineUrl,
  formatDuration,
  formatDistance,
} from '@/lib/tripLinks'
import type { TravelData, TransportMode, DriveOption } from '@/lib/tripTypes'

function determineModes(km: number, sameCountry: boolean): TransportMode[] {
  const modes: TransportMode[] = []
  if (km <= 700) modes.push('drive')
  if (sameCountry) modes.push('train')
  if (!sameCountry || km > 700) modes.push('flight')
  return modes
}

async function fetchDriveRoute(
  originLon: number, originLat: number,
  parkLon: number,   parkLat: number,
): Promise<{ durationSec: number; distanceM: number } | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${originLon},${originLat};${parkLon},${parkLat}?overview=false`
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) return null
    const data = await res.json()
    if (data.code !== 'Ok' || !data.routes?.length) return null
    return { durationSec: data.routes[0].duration, distanceM: data.routes[0].distance }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const fromLocation = searchParams.get('fromLocation')?.trim()
  const parkName     = searchParams.get('parkName')?.trim()
  const parkCountry  = searchParams.get('parkCountry')?.trim()
  const checkIn      = searchParams.get('checkIn') ?? undefined
  const checkOut     = searchParams.get('checkOut') ?? undefined

  if (!fromLocation || !parkName || !parkCountry) {
    return NextResponse.json({ error: 'fromLocation, parkName and parkCountry are required' }, { status: 400 })
  }

  // Step 1: forward-geocode both locations with country codes
  let originResult, parkForward
  try {
    ;[originResult, parkForward] = await Promise.all([
      geocodeWithCountry(fromLocation),
      geocodeWithCountry(`${parkName}, ${parkCountry}`),
    ])
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Geocoding failed' }, { status: 422 })
  }

  const originCoords   = originResult.coords
  const parkCoords     = parkForward.coords
  const sameCountry    = originResult.countryCode === parkForward.countryCode
  const straightLineKm = haversineKm(originCoords, parkCoords)
  const modes          = determineModes(straightLineKm, sameCountry)

  // Step 2: nearest airports + driving route + park city name (all parallelisable)
  const originAirport = findNearestAirport(originCoords.lat, originCoords.lon)
  const destAirport   = findNearestAirport(parkCoords.lat, parkCoords.lon)

  const [driveRoute, parkGeoInfo] = await Promise.all([
    modes.includes('drive')
      ? fetchDriveRoute(originCoords.lon, originCoords.lat, parkCoords.lon, parkCoords.lat)
      : Promise.resolve(null),
    reverseGeocode(parkCoords.lat, parkCoords.lon)
      .catch(() => ({ city: parkName, countryCode: parkForward.countryCode })),
  ])

  const nearestCity = parkGeoInfo.city

  let drive: DriveOption | null = null
  let driveUnavailable = false

  if (modes.includes('drive')) {
    if (driveRoute) {
      const durationMin = Math.round(driveRoute.durationSec / 60)
      const distanceKm  = driveRoute.distanceM / 1000
      drive = {
        durationMin,
        durationLabel: formatDuration(durationMin),
        distanceKm,
        distanceLabel: formatDistance(distanceKm),
        googleMapsUrl: buildGoogleMapsUrl(originCoords, parkCoords),
      }
    } else {
      driveUnavailable = true
    }
  }

  const flight = modes.includes('flight') ? (() => {
    const flightMin = Math.round(((straightLineKm / 800) * 60 + 45) / 15) * 15
    return {
      durationLabel: `~${formatDuration(flightMin)} (est.)`,
      distanceKm:    Math.round(straightLineKm),
      skyscannerUrl: buildSkyscannerUrl(originAirport.iata, destAirport.iata, checkIn, checkOut),
      note:          'Estimated flight time including typical airport overhead.',
      originAirport: { iata: originAirport.iata, name: originAirport.name },
      destAirport:   { iata: destAirport.iata,   name: destAirport.name   },
    }
  })() : null

  const train = modes.includes('train') ? {
    omioUrl:          buildOmioUrl(fromLocation, nearestCity, checkIn),
    trainlineUrl:     buildTrainlineUrl(fromLocation, nearestCity, checkIn),
    googleTransitUrl: buildGoogleTransitUrl(originCoords, parkCoords),
    note:             `Trains or coaches to ${nearestCity}.`,
  } : null

  const accommodation = buildAccommodationLinks(parkName, parkCountry, checkIn, checkOut)

  const travelData: TravelData = {
    drive,
    flight,
    train,
    accommodation,
    parkCoords,
    originCoords,
    straightLineKm: Math.round(straightLineKm),
    modes,
    driveUnavailable,
    nearestCity,
    sameCountry,
  }

  return NextResponse.json(travelData)
}
