export interface Park {
  id: number
  name: string
  country: string
  group: string
}

export interface DayResult {
  date: string
  crowd_pct: number
  predicted: boolean
  hours: string
  weekday: number
  park_name: string
}

export interface Filters {
  startDate: string
  endDate: string
  daysAhead: number
  weekdays: number[]
  maxCrowd: number
  topN: number
  useCustomDates: boolean
}
