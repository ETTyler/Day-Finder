import { NextRequest, NextResponse } from 'next/server'
import { getDaysInRange } from '@/lib/scraper'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams

  const parkIdStr = params.get('parkId')
  if (!parkIdStr || isNaN(parseInt(parkIdStr))) {
    return NextResponse.json({ error: 'Valid parkId is required' }, { status: 400 })
  }
  const parkId = parseInt(parkIdStr)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startStr = params.get('startDate')
  const endStr = params.get('endDate')
  const daysAhead = Math.min(Math.max(parseInt(params.get('daysAhead') ?? '30'), 1), 365)

  const startDate = startStr ? new Date(startStr + 'T00:00:00') : today
  const endDate = endStr
    ? new Date(endStr + 'T00:00:00')
    : new Date(new Date(startDate).setDate(startDate.getDate() + daysAhead - 1))

  if (endDate < startDate) {
    return NextResponse.json({ error: 'endDate must be after startDate' }, { status: 400 })
  }

  const weekdaysParam = params.get('weekdays')
  const allowedWeekdays = weekdaysParam
    ? new Set(weekdaysParam.split(',').map(Number).filter((n) => n >= 0 && n <= 6))
    : null

  const maxCrowd = Math.min(Math.max(parseInt(params.get('maxCrowd') ?? '100'), 1), 100)
  const topN = Math.min(Math.max(parseInt(params.get('topN') ?? '10'), 1), 50)

  try {
    let { days, parkName } = await getDaysInRange(parkId, startDate, endDate)

    if (allowedWeekdays && allowedWeekdays.size < 7) {
      days = days.filter((d) => allowedWeekdays.has(d.weekday))
    }
    if (maxCrowd < 100) {
      days = days.filter((d) => d.crowd_pct <= maxCrowd)
    }

    return NextResponse.json({
      days: days.slice(0, topN),
      parkName,
      total: days.length,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch calendar data' },
      { status: 502 }
    )
  }
}
