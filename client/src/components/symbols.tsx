// Line symbols and diagrams used in place of stock photography.
import type { SportKind } from '../content/sports'

type SymbolProps = { className?: string }

const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function BookSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...line}>
      <path d="M24 12c-5-4-12-5-19-3.5v28c7-1.5 14-.5 19 3.5 5-4 12-5 19-3.5v-28C36 7 29 8 24 12z" />
      <path d="M24 12v28" />
      <path d="M10 17c3-.6 6-.4 9 .8M10 23c3-.6 6-.4 9 .8M29 17.8c3-1.2 6-1.4 9-.8M29 23.8c3-1.2 6-1.4 9-.8" />
    </svg>
  )
}

export function StopwatchSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...line}>
      <circle cx="24" cy="27" r="15" />
      <path d="M24 12V7M20 5h8M36 15l3-3M24 27l6-6" />
      <path d="M24 15v2M36 27h-2M24 39v-2M12 27h2" />
    </svg>
  )
}

export function ResidenceSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...line}>
      <path d="M6 22 24 8l18 14" />
      <path d="M10 19v21h28V19" />
      <path d="M20 40V30h8v10" />
      <path d="M14 24h5v4h-5zM29 24h5v4h-5z" />
    </svg>
  )
}

export function CapSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...line}>
      <path d="M4 18 24 9l20 9-20 9z" />
      <path d="M12 22v9c0 3 5.5 6 12 6s12-3 12-6v-9" />
      <path d="M44 18v11" />
    </svg>
  )
}

export function BedSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...line}>
      <path d="M5 38V12M5 30h38v8" />
      <path d="M5 24h9a4 4 0 0 1 4 4v2" />
      <path d="M18 24h21a4 4 0 0 1 4 4v2" />
      <path d="M9 19h6" />
    </svg>
  )
}

export function PlateSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...line}>
      <circle cx="24" cy="24" r="11" />
      <circle cx="24" cy="24" r="6" />
      <path d="M6 10v8a3 3 0 0 0 3 3v17M9 10v7M12 10v8a3 3 0 0 1-3 3" />
      <path d="M40 38V10c-3 2-4 6-4 11h4" />
    </svg>
  )
}

export function CompassSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...line}>
      <circle cx="24" cy="24" r="18" />
      <path d="m30 18-3.5 8.5L18 30l3.5-8.5z" />
      <path d="M24 6v4M24 38v4M6 24h4M38 24h4" />
    </svg>
  )
}

function GolfSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...line}>
      <path d="M20 38V6l14 6-14 6" />
      <ellipse cx="22" cy="39" rx="16" ry="4" />
      <circle cx="34" cy="33" r="1.8" />
    </svg>
  )
}

function HockeySymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...line}>
      <path d="M12 5l14 28h8" />
      <path d="M36 5 22 33h-8" />
      <ellipse cx="24" cy="41" rx="6" ry="2.5" />
    </svg>
  )
}

function LacrosseSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...line}>
      <ellipse cx="31" cy="15" rx="7" ry="10.5" transform="rotate(40 31 15)" />
      <path d="M26 21 7 41" />
      <path d="M26 10l9 9M29 7.5l8 8M24 14l7 7" strokeWidth="1" />
      <circle cx="39" cy="38" r="3.5" />
    </svg>
  )
}

function TennisSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...line}>
      <ellipse cx="17" cy="17" rx="10" ry="13" transform="rotate(-40 17 17)" />
      <path d="M10.5 12.5 23.5 23M11.5 22.5 22 9.5" strokeWidth="1" />
      <path d="M23 25 38 40" />
      <circle cx="39" cy="14" r="4.5" />
      <path d="M35.5 11.2a6 6 0 0 0 3.5 6.6" strokeWidth="1" />
    </svg>
  )
}

const sportGlyphs = {
  golf: GolfSymbol,
  'ice-hockey': HockeySymbol,
  tennis: TennisSymbol,
  lacrosse: LacrosseSymbol,
}

export function SportSymbol({ kind, className }: { kind: SportKind; className?: string }) {
  const Glyph = sportGlyphs[kind]
  return <Glyph className={className} />
}

// A Harkness discussion map: teachers trace each exchange around the table.
// Not currently rendered — the Academics section uses a photo slot instead. Kept for reuse.
const SEATS = 12
const conversation = [3, 8, 1, 6, 11, 4, 9, 2, 7, 10, 5, 0, 6]

const seatPoint = (i: number) => {
  const angle = (i / SEATS) * 2 * Math.PI - Math.PI / 2
  return [200 + 168 * Math.cos(angle), 130 + 100 * Math.sin(angle)]
}

export function HarknessDiagram({ className }: SymbolProps) {
  const path = conversation
    .map((seat, i) => `${i ? 'L' : 'M'}${seatPoint(seat).map((n) => n.toFixed(1)).join(' ')}`)
    .join(' ')

  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      role="img"
      aria-label="Diagram of a Harkness table with twelve seats and lines tracing the discussion between them"
    >
      <ellipse
        cx="200"
        cy="130"
        rx="135"
        ry="72"
        fill="var(--color-mist)"
        fillOpacity="0.4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d={path} fill="none" stroke="var(--color-brass)" strokeWidth="1.25" strokeLinejoin="round" />
      {Array.from({ length: SEATS }, (_, i) => {
        const [x, y] = seatPoint(i)
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="11"
            fill={i === 0 ? 'currentColor' : 'white'}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        )
      })}
    </svg>
  )
}

type Reach = 'Local' | 'Regional' | 'Global'

const rings: { label: Reach; r: number }[] = [
  { label: 'Global', r: 174 },
  { label: 'Regional', r: 118 },
  { label: 'Local', r: 62 },
]

export function PlaceRings({ active, className }: { active: Reach; className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={`${active} reach from campus`}>
      {rings.map(({ label, r }) => {
        const on = label === active
        return (
          <g key={label}>
            <circle
              cx="200"
              cy="200"
              r={r}
              fill={on ? 'var(--color-mist)' : 'none'}
              fillOpacity={on ? 0.45 : 0}
              stroke="currentColor"
              strokeWidth={on ? 2 : 1}
              strokeDasharray={on ? undefined : '3 5'}
              opacity={on ? 1 : 0.5}
              className="transition-all duration-300"
            />
            <text
              x="200"
              y={200 - r + 24}
              textAnchor="middle"
              className="font-condensed"
              fontSize="14"
              fontWeight="600"
              letterSpacing="1.5"
              fill="currentColor"
              opacity={on ? 1 : 0.55}
            >
              {label.toUpperCase()}
            </text>
          </g>
        )
      })}
      <circle cx="200" cy="200" r="15" fill="none" stroke="var(--color-brass)" strokeOpacity="0.45" />
      <circle cx="200" cy="200" r="7" fill="var(--color-brass)" />
      <text
        x="200"
        y="236"
        textAnchor="middle"
        className="font-condensed"
        fontSize="13"
        fontWeight="600"
        letterSpacing="1.5"
        fill="currentColor"
      >
        CAMPUS
      </text>
    </svg>
  )
}
