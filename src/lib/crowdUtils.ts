export const CROWD_LEVELS = [
  { max: 30,  label: 'Very quiet', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  { max: 50,  label: 'Quiet',      color: '#4d7c0f', bg: '#f7fee7', border: '#bef264' },
  { max: 70,  label: 'Moderate',   color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  { max: 85,  label: 'Busy',       color: '#c2410c', bg: '#fff7ed', border: '#fdba74' },
  { max: 101, label: 'Very busy',  color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
]

export function crowdLevel(pct: number) {
  return CROWD_LEVELS.find((l) => pct < l.max) ?? CROWD_LEVELS[CROWD_LEVELS.length - 1]
}
