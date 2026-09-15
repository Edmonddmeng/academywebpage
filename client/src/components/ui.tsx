import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-semibold tracking-[0.28em] text-brass uppercase ${className}`}>
      {children}
    </p>
  )
}

const buttonStyles = {
  solid: 'bg-ink text-white hover:bg-brass',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-white',
  'outline-light': 'border-2 border-white text-white hover:bg-white hover:text-ink',
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
      ? 'bg-linear-to-br from-ink-soft to-[#0b172b] text-white/45'
      : 'bg-linear-to-br from-sand to-[#d6cdbb] text-ink/45'

  return (
    <div
      role="img"
      aria-label={`Placeholder image: ${label}`}
      className={`relative overflow-hidden ${toneClass} ${className}`}
    >
      <span className="absolute bottom-3 left-4 text-[11px] font-semibold tracking-[0.2em] uppercase">
        {label}
      </span>
    </div>
  )
}
