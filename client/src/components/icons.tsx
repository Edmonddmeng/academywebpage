type IconProps = { className?: string }

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true" {...stroke}>
      <path d="M1 2h22M1 9h22M1 16h22" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  )
}

export function ChevronRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} strokeWidth={2.25}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  )
}

export function MedalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M8 3h8l-2.5 6.5M8 3l2.5 6.5M8 3 5.5 9.5m0 0L8 13" />
      <circle cx="12" cy="16" r="5" />
      <path d="M12 13.8v4.4M10 16h4" />
    </svg>
  )
}
