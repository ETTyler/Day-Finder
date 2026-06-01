export default function PinDecoration({ color = '#C8440B' }: { color?: string }) {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" fill={color} />
      <circle cx="7" cy="7" r="2.5" fill="rgba(0,0,0,0.25)" />
      <line x1="7" y1="12.5" x2="7" y2="19" stroke="#8B6914" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
