import type { DayResult } from './types'

const BASE_URL = 'https://queue-times.com'

function localIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'DayFinder/1.0' },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.text()
}

async function scrapeMonth(
  parkId: number,
  year: number,
  month: number
): Promise<{ days: DayResult[]; parkName: string }> {
  const url = `${BASE_URL}/parks/${parkId}/calendar/${year}/${String(month).padStart(2, '0')}`
  const html = await fetchHtml(url)

  const nameMatch = html.match(/<h1[^>]*>([\s\S]*?) crowd calendar\s*<\/h1>/i)
  const parkName = nameMatch
    ? nameMatch[1].replace(/<[^>]+>/g, '').trim()
    : `Park ${parkId}`

  const days: DayResult[] = []
  const seen = new Set<string>()

  // Open days — port of Python's open_pattern with re.DOTALL
  const openPattern =
    /\/parks\/\d+\/calendar\/(\d{4})\/(\d{2})\/(\d{2})[\s\S]*?(\d+)%(\*?)[\s\S]*?(\d{2}:\d{2}-\d{2}:\d{2})/g

  for (const m of html.matchAll(openPattern)) {
    const key = `${m[1]}-${m[2]}-${m[3]}`
    if (seen.has(key)) continue
    seen.add(key)
    // JS getDay() is 0=Sun; shift to 0=Mon
    const weekday = (new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])).getDay() + 6) % 7
    days.push({
      date: key,
      crowd_pct: parseInt(m[4]),
      predicted: m[5] === '*',
      hours: m[6],
      weekday,
      park_name: parkName,
    })
  }

  const closedPattern =
    /\/parks\/\d+\/calendar\/(\d{4})\/(\d{2})\/(\d{2})[\s\S]*?Closed/g

  for (const m of html.matchAll(closedPattern)) {
    const key = `${m[1]}-${m[2]}-${m[3]}`
    if (seen.has(key)) continue
    seen.add(key)
    const weekday = (new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])).getDay() + 6) % 7
    days.push({
      date: key,
      crowd_pct: 0,
      predicted: false,
      hours: '',
      weekday,
      park_name: parkName,
    })
  }

  return { days, parkName }
}

export async function getDaysInRange(
  parkId: number,
  startDate: Date,
  endDate: Date
): Promise<{ days: DayResult[]; parkName: string }> {
  // Collect unique year-month pairs spanning the range
  const months: Array<[number, number]> = []
  const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  while (cur <= endDate) {
    months.push([cur.getFullYear(), cur.getMonth() + 1])
    cur.setMonth(cur.getMonth() + 1)
  }

  let allDays: DayResult[] = []
  let parkName = ''

  for (const [year, month] of months) {
    const result = await scrapeMonth(parkId, year, month)
    allDays = allDays.concat(result.days)
    if (result.parkName) parkName = result.parkName
  }

  const startStr = localIso(startDate)
  const endStr = localIso(endDate)

  // Exclude closed days, restrict to date window, sort by crowd ascending
  const filtered = allDays
    .filter((d) => d.crowd_pct > 0 && d.date >= startStr && d.date <= endStr)
    .sort((a, b) => a.crowd_pct - b.crowd_pct)

  return { days: filtered, parkName }
}
