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
  kind = 'image',
}: {
  label: string
  className?: string
  tone?: 'light' | 'dark'
  /** 'video' adds a play-button mark so the slot reads as reserved for footage, not a photo. */
  kind?: 'image' | 'video'
}) {
  const toneClass =
    tone === 'dark'
      ? 'border-white/25 bg-ink-soft/40 text-white/60'
      : 'border-ink/25 bg-sand text-ink/50'

  return (
    <div
      role="img"
      aria-label={`Placeholder ${kind}: ${label}`}
      className={`relative flex items-center justify-center overflow-hidden border border-dashed ${toneClass} ${className}`}
    >
      {kind === 'video' && (
        <span
          aria-hidden="true"
          className="grid h-14 w-14 place-items-center rounded-full border-2 border-current"
        >
          <span className="ml-1 h-0 w-0 border-y-8 border-l-[12px] border-y-transparent border-l-current" />
        </span>
      )}
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
