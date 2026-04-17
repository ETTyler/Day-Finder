import { NextRequest, NextResponse } from 'next/server'

const PARKS_API = 'https://queue-times.com/parks.json'

interface RawPark {
  id: number
  name: string
  country?: string
}

interface RawGroup {
  name: string
  parks: RawPark[]
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() ?? ''

  const res = await fetch(PARKS_API, {
    headers: { 'User-Agent': 'DayFinder/1.0' },
    next: { revalidate: 86400 },
  })
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch parks list' }, { status: 502 })
  }

  const groups: RawGroup[] = await res.json()
  const results: Array<{ id: number; name: string; country: string; group: string }> = []

  for (const group of groups) {
    for (const park of group.parks ?? []) {
      const nameMatch = park.name.toLowerCase().includes(q)
      const countryMatch = (park.country ?? '').toLowerCase().includes(q)
      if (!q || nameMatch || countryMatch) {
        results.push({
          id: park.id,
          name: park.name,
          country: park.country ?? '',
          group: group.name,
        })
      }
    }
  }

  return NextResponse.json(results.slice(0, 20))
}
