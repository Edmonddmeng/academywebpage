import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

// `onDark` swaps to the brighter gold, which stays legible on the deep green grounds.
export function Eyebrow({
  children,
  className = '',
  onDark = false,
}: {
  children: ReactNode
  className?: string
  onDark?: boolean
}) {
  return (
    <p
      className={`font-condensed text-[15px] font-semibold tracking-[0.24em] uppercase ${
        onDark ? 'text-gold' : 'text-brass'
      } ${className}`}
    >
      {children}
    </p>
  )
}

const buttonStyles = {
  solid: 'bg-ink text-white hover:bg-ink-soft',
  gold: 'bg-gold text-ink hover:bg-white',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-white',
  'outline-light': 'border-2 border-white text-white hover:bg-white hover:text-ink',
}

export function ImagePlaceholder({
  label,
  className = '',
  tone = 'light',
}: {
  label: string
  className?: string
  tone?: 'light' | 'dark'
}) {
  const toneClass =
    tone === 'dark'
      ? 'border-white/25 bg-ink-soft/40 text-white/60'
      : 'border-ink/25 bg-sand text-ink/50'

  return (
    <div
      role="img"
      aria-label={`Placeholder image: ${label}`}
      className={`relative overflow-hidden border border-dashed ${toneClass} ${className}`}
    >
      <span className="absolute bottom-3 left-4 text-[11px] font-semibold tracking-[0.2em] uppercase">
        {label}
      </span>
    </div>
  )
}

export function ButtonLink({
  to,
  children,
  variant = 'solid',
}: {
  to: string
  children: ReactNode
  variant?: keyof typeof buttonStyles
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-[0.18em] uppercase transition-colors ${buttonStyles[variant]}`}
    >
      {children}
    </Link>
  )
}
