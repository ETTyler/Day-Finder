import type { DayPlan, DayTag, FlightBooking, AccommodationBooking, TravelData } from '@/lib/tripTypes'
import type { DayResult } from '@/lib/types'
import { crowdLevel } from '@/lib/crowdUtils'

const WEEKDAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekday(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number)
  const day = new Date(y, m - 1, d).getDay()
  return day === 0 ? 6 : day - 1
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function fmtShort(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const TAG_LABELS: Record<DayTag, string> = {
  travel: 'Travel day',
  park:   'Park day',
  free:   'Free day',
}

const TAG_COLORS: Record<DayTag, string> = {
  travel: '#706F5C',
  park:   '#C8440B',
  free:   '#2D6A4F',
}

interface Props {
  parkName: string
  parkCountry: string
  tripStart: string
  tripEnd: string
  travelData: TravelData | null
  flightBooking: FlightBooking
  accommodationBooking: AccommodationBooking
  plans: DayPlan[]
  crowdData: DayResult[]
}

function Section({ title }: { title: string }) {
  return (
    <div style={{ borderBottom: '2px solid #C8440B', marginBottom: 12, paddingBottom: 4, marginTop: 24 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8440B' }}>
        {title}
      </span>
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 9, color: '#706F5C', minWidth: 100, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 9, color: '#1C1B14', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

export default function PrintLayout({
  parkName, parkCountry, tripStart, tripEnd,
  travelData, flightBooking, accommodationBooking, plans, crowdData,
}: Props) {
  const crowdByDate = new Map(crowdData.map(d => [d.date, d]))
  const hasFlight = !!(flightBooking.airline || flightBooking.flightNumber || flightBooking.bookingRef)
  const hasAccom  = !!(accommodationBooking.propertyName || accommodationBooking.bookingRef)

  return (
    <div
      id="print-layout"
      style={{
        display: 'none',
        fontFamily: '"Inter", system-ui, sans-serif',
        color: '#1C1B14',
        padding: '32px 40px',
        maxWidth: 740,
        margin: '0 auto',
        fontSize: 10,
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: '3px solid #1C1B14', paddingBottom: 16, marginBottom: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#1C1B14' }}>
          Trip Plan
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6, color: '#1C1B14' }}>
          {parkName}
          {parkCountry && <span style={{ color: '#706F5C', fontWeight: 400 }}> · {parkCountry}</span>}
        </div>
        {tripStart && tripEnd && (
          <div style={{ fontSize: 10, color: '#706F5C', marginTop: 4 }}>
            {fmtDate(tripStart)} – {fmtDate(tripEnd)}
          </div>
        )}
      </div>

      {/* Flight estimates from search */}
      {travelData?.flight && (
        <>
          <Section title="Getting There" />
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600 }}>
              {travelData.flight.originAirport.iata} → {travelData.flight.destAirport.iata}
            </span>
            <span style={{ fontSize: 9, color: '#706F5C', marginLeft: 8 }}>
              {travelData.flight.originAirport.name} → {travelData.flight.destAirport.name}
            </span>
          </div>
          <Row label="Est. flight time" value={travelData.flight.durationLabel} />
          <Row label="Distance" value={`${travelData.flight.distanceKm.toLocaleString()} km`} />
        </>
      )}

      {/* Booked flight details */}
      {hasFlight && (
        <>
          <Section title="My Flight" />
          <Row label="Airline" value={flightBooking.airline} />
          <Row label="Flight" value={flightBooking.flightNumber} />
          <Row label="From" value={flightBooking.departAirport} />
          <Row label="To" value={flightBooking.arriveAirport} />
          <Row label="Departure date" value={flightBooking.departDate ? fmtShort(flightBooking.departDate) : undefined} />
          <Row label="Departs" value={flightBooking.departTime} />
          <Row label="Arrives" value={flightBooking.arriveTime} />
          <Row label="Booking reference" value={flightBooking.bookingRef} />
          {flightBooking.hasReturn && (flightBooking.returnFlightNumber || flightBooking.returnDepartTime) && (
            <>
              <div style={{ marginTop: 8, marginBottom: 4, fontSize: 9, fontWeight: 600, color: '#706F5C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Return</div>
              <Row label="Flight" value={flightBooking.returnFlightNumber} />
              <Row label="Departure date" value={flightBooking.returnDepartDate ? fmtShort(flightBooking.returnDepartDate) : undefined} />
              <Row label="Departs" value={flightBooking.returnDepartTime} />
              <Row label="Arrives" value={flightBooking.returnArriveTime} />
            </>
          )}
        </>
      )}

      {/* Drive details */}
      {travelData?.drive && (
        <>
          <Section title="Driving" />
          <Row label="Duration" value={travelData.drive.durationLabel} />
          <Row label="Distance" value={travelData.drive.distanceLabel} />
        </>
      )}

      {/* Train/transit details */}
      {travelData?.train && (
        <>
          <Section title="Train / Transit" />
          <Row label="Note" value={travelData.train.note} />
        </>
      )}

      {/* Accommodation */}
      {hasAccom && (
        <>
          <Section title="My Accommodation" />
          <Row label="Property" value={accommodationBooking.propertyName} />
          <Row label="Address" value={accommodationBooking.address} />
          <Row label="Booking reference" value={accommodationBooking.bookingRef} />
          <Row label="Check-in" value={[
            accommodationBooking.checkInDate ? fmtShort(accommodationBooking.checkInDate) : '',
            accommodationBooking.checkInTime,
          ].filter(Boolean).join(' at ')} />
          <Row label="Check-out" value={[
            accommodationBooking.checkOutDate ? fmtShort(accommodationBooking.checkOutDate) : '',
            accommodationBooking.checkOutTime,
          ].filter(Boolean).join(' at ')} />
          <Row label="Phone" value={accommodationBooking.phone} />
        </>
      )}

      {/* Itinerary */}
      {plans.length > 0 && (
        <>
          <Section title="Itinerary" />
          {plans.map((plan, i) => {
            const crowd   = crowdByDate.get(plan.date)
            const weekday = getWeekday(plan.date)
            const level   = crowd ? crowdLevel(crowd.crowd_pct) : null
            const isLast  = i === plans.length - 1

            return (
              <div
                key={plan.date}
                style={{
                  marginBottom: isLast ? 0 : 12,
                  paddingBottom: isLast ? 0 : 12,
                  borderBottom: isLast ? 'none' : '1px solid #E4E2D9',
                  pageBreakInside: 'avoid',
                }}
              >
                {/* Day header */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#1C1B14' }}>
                    {WEEKDAY[weekday]} {fmtShort(plan.date)}
                  </span>
                  <span style={{
                    fontSize: 8,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: TAG_COLORS[plan.tag],
                    border: `1px solid ${TAG_COLORS[plan.tag]}`,
                    padding: '1px 5px',
                    borderRadius: 3,
                  }}>
                    {TAG_LABELS[plan.tag]}
                  </span>
                  {crowd && level && (
                    <span style={{ fontSize: 9, color: level.color }}>
                      {crowd.crowd_pct}% {level.label}
                      {crowd.predicted ? '*' : ''}
                      {crowd.hours ? ` · ${crowd.hours}` : ''}
                    </span>
                  )}
                </div>

                {/* Rich text notes */}
                {plan.note && plan.note !== '<p></p>' && (
                  <div
                    className="print-notes"
                    dangerouslySetInnerHTML={{ __html: plan.note }}
                    style={{ fontSize: 9, color: '#1C1B14', lineHeight: 1.6, paddingLeft: 8 }}
                  />
                )}
              </div>
            )
          })}
          {crowdData.some(d => d.predicted) && (
            <p style={{ fontSize: 8, color: '#B0AE9D', marginTop: 8 }}>* predicted crowd level</p>
          )}
        </>
      )}

      <div style={{ borderTop: '1px solid #E4E2D9', marginTop: 32, paddingTop: 8, fontSize: 8, color: '#B0AE9D', textAlign: 'center' }}>
        Generated by Day Finder
      </div>
    </div>
  )
}
