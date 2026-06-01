export interface Coords {
  lat: number
  lon: number
}

export interface DriveOption {
  durationMin: number
  durationLabel: string
  distanceKm: number
  distanceLabel: string
  googleMapsUrl: string
}

export interface AirportInfo {
  iata: string
  name: string
}

export interface FlightOption {
  durationLabel: string
  distanceKm: number
  skyscannerUrl: string
  note: string
  originAirport: AirportInfo
  destAirport: AirportInfo
}

export interface TrainOption {
  omioUrl: string
  trainlineUrl: string
  googleTransitUrl: string
  note: string
}

export interface AccommodationOptions {
  bookingUrl: string
  airbnbUrl: string
  priceTier: 'budget' | 'mid' | 'premium'
  priceTierLabel: string
}

export type TransportMode = 'drive' | 'flight' | 'train'

export interface TravelData {
  drive: DriveOption | null
  flight: FlightOption | null
  train: TrainOption | null
  accommodation: AccommodationOptions
  parkCoords: Coords
  originCoords: Coords
  straightLineKm: number
  modes: TransportMode[]
  driveUnavailable?: boolean
  nearestCity?: string
  sameCountry?: boolean
}

export type DayTag = 'travel' | 'park' | 'free'

export interface DayPlan {
  date: string
  tag: DayTag
  note: string
}

export interface FlightBooking {
  airline: string
  flightNumber: string
  departDate: string
  departTime: string
  arriveTime: string
  departAirport: string
  arriveAirport: string
  bookingRef: string
  hasReturn: boolean
  returnFlightNumber: string
  returnDepartDate: string
  returnDepartTime: string
  returnArriveTime: string
}

export interface AccommodationBooking {
  propertyName: string
  address: string
  bookingRef: string
  checkInDate: string
  checkInTime: string
  checkOutDate: string
  checkOutTime: string
  phone: string
}

export interface TripPageParams {
  parkId?: string
  parkName?: string
  parkCountry?: string
  checkIn?: string
  checkOut?: string
  days?: string
}
