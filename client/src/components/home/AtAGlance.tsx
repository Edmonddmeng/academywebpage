import type { ReactNode } from 'react'
import { Eyebrow } from '../ui'

// PLACEHOLDER figures are targets or estimates — confirm once enrollment and the campus site are final.
const stats = {
  enrollment: 300, // PLACEHOLDER: target enrollment
  boardingPercent: 70, // PLACEHOLDER
  countries: 15, // PLACEHOLDER
  states: 10, // PLACEHOLDER
  harknessTableSize: 12, // PLACEHOLDER: target class size
  milesToLosAngeles: '~40', // PLACEHOLDER: depends on campus site
  minutesToCoast: '~15', // PLACEHOLDER: depends on campus site
}

function Cell({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`flex items-center justify-center border border-dotted border-ink/45 px-6 py-8 text-center ${className}`}
    >
      {children}
    </div>
  )
}

function Num({ children }: { children: ReactNode }) {
  return <p className="font-serif text-5xl leading-none text-ink">{children}</p>
}

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 font-condensed text-[15px] leading-snug font-semibold tracking-wide text-ink uppercase">
      {children}
    </p>
  )
}

function BoardingPie({ boarding }: { boarding: number }) {
  const r = 25
  const c = 2 * Math.PI * r
  return (
    <div className="relative mx-auto mb-4 h-28 w-48">
      <svg
        viewBox="0 0 100 100"
        className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 -rotate-90"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="50" fill="var(--color-mist)" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="50"
          strokeDasharray={`${(boarding / 100) * c} ${c}`}
        />
      </svg>
      <span className="absolute top-0 left-0 text-left leading-tight">
        <span className="block font-serif text-sm text-ink">{100 - boarding}%</span>
        <span className="font-condensed text-[11px] font-semibold text-ink uppercase">Day</span>
      </span>
      <span className="absolute right-0 bottom-0 text-left leading-tight">
        <span className="block font-serif text-sm text-ink">{boarding}%</span>
        <span className="font-condensed text-[11px] font-semibold text-ink uppercase">Boarding</span>
      </span>
    </div>
  )
}

function FiveToOneRing() {
  const r = 38
  const c = 2 * Math.PI * r
  const seg = c / 5
  const gap = 2.5
  const colors = ['var(--color-ink)', 'var(--color-sky)', 'var(--color-mist)', 'var(--color-ink-soft)', 'var(--color-sky)']
  return (
    <svg viewBox="0 0 100 100" className="mx-auto mb-4 h-24 w-24 -rotate-90" aria-hidden="true">
      {colors.map((color, i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="22"
          strokeDasharray={`${seg - gap} ${c - seg + gap}`}
          strokeDashoffset={-i * seg}
        />
      ))}
    </svg>
  )
}

const iconStroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 64 64" className="mx-auto h-16 w-16 text-ink" aria-hidden="true" {...iconStroke}>
      <circle cx="32" cy="32" r="29" />
      <ellipse cx="32" cy="32" rx="13" ry="29" />
      <path d="M32 3v58M3 32h58M7.5 18h49M7.5 46h49" />
    </svg>
  )
}

function CaliforniaIcon() {
  return (
    <svg viewBox="0 0 80 100" className="mx-auto h-16 w-auto text-ink" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h34v36l36 38-2 6 2 6-4 4-24-2-6-8-10-8-8-6-4-10-4-6-2-8-4-8-2-10-4-10z"
      />
      <circle cx="46" cy="82" r="3.5" fill="var(--color-brass)" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0 text-ink" aria-hidden="true" {...iconStroke}>
      <rect x="6" y="10" width="52" height="48" rx="2" />
      <path d="M6 10h52v12H6z" fill="currentColor" />
      <path d="M18 4v12M46 4v12" />
      <path d="M16 33h6M29 33h6M42 33h6M16 45h6M29 45h6M42 45h6" strokeWidth="4" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 64 56" className="mx-auto mb-4 h-14 w-16 text-ink" aria-hidden="true" {...iconStroke} strokeWidth={3}>
      <path d="M32 12C24 6 14 5 4 7v40c10-2 20-1 28 5 8-6 18-7 28-5V7C50 5 40 6 32 12z" />
      <path d="M32 12v40" />
    </svg>
  )
}

function Hand({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={color}>
      <rect x="3" y="4" width="3" height="18" rx="1.5" />
      <rect x="6.6" y="0" width="3" height="22" rx="1.5" />
      <rect x="10.2" y="1.5" width="3" height="20" rx="1.5" />
      <rect x="13.8" y="5" width="3" height="17" rx="1.5" />
      <rect x="-1" y="15" width="3" height="11" rx="1.5" transform="rotate(-30 0.5 20)" />
      <rect x="3" y="17" width="13.8" height="13" rx="4" />
      <rect x="5" y="28" width="10" height="10" />
    </g>
  )
}

function HandsIcon() {
  return (
    <svg viewBox="0 0 70 50" className="mx-auto mb-4 h-14 w-20" aria-hidden="true">
      <Hand x={4} y={12} color="var(--color-ink)" />
      <Hand x={26} y={2} color="var(--color-mist)" />
      <Hand x={48} y={10} color="var(--color-sky)" />
    </svg>
  )
}

function SkylineIcon() {
  return (
    <svg viewBox="0 0 72 72" className="h-20 w-20 shrink-0 text-ink" aria-hidden="true" {...iconStroke} strokeWidth={1.75}>
      <circle cx="36" cy="36" r="33" />
      <path d="M12 56h48" />
      <path d="M17 56V38h8v18M25 56V26h9v30M34 56V18h8v38M42 56V30h9v26M51 56V40h6v16" />
      <path d="M28 32h3M28 38h3M28 44h3M37 24h3M37 30h3M37 36h3M37 42h3M45 36h3M45 42h3" />
      <path d="M38 18v-6" />
    </svg>
  )
}

function CoastIcon() {
  return (
    <svg viewBox="0 0 72 72" className="h-20 w-20 shrink-0 text-ink" aria-hidden="true" {...iconStroke} strokeWidth={1.75}>
      <circle cx="36" cy="36" r="33" />
      <path d="M24 38a12 12 0 0 1 24 0" />
      <path d="M36 18v-4M22 24l-3-3M50 24l3-3" />
      <path d="M8 44c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3 5-3 10-3 5 3 8 3" />
      <path d="M10 52c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3 5-3 10-3 4 2 6 3" />
      <path d="M16 60c4 0 4-2 8-2s4 2 8 2 4-2 8-2 4 2 8 2 4-2 8-2" />
    </svg>
  )
}

export default function AtAGlance() {
  return (
    <section id="at-a-glance" className="scroll-mt-16 bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <Eyebrow className="text-center">At a Glance</Eyebrow>

        <div className="mt-10 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-8">
          <Cell className="flex-col lg:col-[1/3] lg:row-[1/2]">
            <BoardingPie boarding={stats.boardingPercent} />
            <Num>{stats.enrollment}</Num>
            <Label>Students at full enrollment</Label>
          </Cell>

          <Cell className="-order-1 flex-col sm:col-span-2 lg:order-none lg:col-[3/7] lg:row-[1/2]">
            <p className="font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase">
              Students from
            </p>
            <div className="mt-4 flex items-end justify-center gap-16">
              <div>
                <GlobeIcon />
                <div className="mt-4">
                  <Num>{stats.countries}</Num>
                  <Label>Countries</Label>
                </div>
              </div>
              <div>
                <CaliforniaIcon />
                <div className="mt-4">
                  <Num>{stats.states}</Num>
                  <Label>States</Label>
                </div>
              </div>
            </div>
          </Cell>

          <Cell className="flex-col lg:col-[7/9] lg:row-[1/2]">
            <FiveToOneRing />
            <Num>5:1</Num>
            <Label>
              Professionals dedicated
              <br />
              to every student
            </Label>
          </Cell>

          <Cell className="flex-col gap-6 sm:col-span-2 sm:flex-row lg:col-[1/5] lg:row-[2/3]">
            <CalendarIcon />
            <div className="sm:text-left">
              <Num>12 months</Num>
              <Label>Of year-round athletic development</Label>
            </div>
          </Cell>

          <Cell className="flex-col lg:col-[5/7] lg:row-[2/4]">
            <BookIcon />
            <Num>13</Num>
            <Label>Academic programs, including</Label>
            <div className="mt-4">
              <Num>3</Num>
              <Label>Research, advanced &amp; independent study tracks</Label>
            </div>
          </Cell>

          <Cell className="flex-col lg:col-[7/9] lg:row-[2/4]">
            <HandsIcon />
            <Num>{stats.harknessTableSize}</Num>
            <Label>
              Students at the average
              <br />
              Harkness table
            </Label>
          </Cell>

          <Cell className="flex-col lg:col-[1/3] lg:row-[3/5]">
            <Num>6</Num>
            <Label>Year-round programs in</Label>
            <div className="mt-4">
              <Num>3</Num>
              <Label>Elite sports</Label>
            </div>
          </Cell>

          <Cell className="flex-col lg:col-[3/5] lg:row-[3/4]">
            <Num>2</Num>
            <Label>Students per room in every residence hall</Label>
          </Cell>

          <Cell className="gap-5 sm:col-span-2 lg:col-[3/6] lg:row-[4/5]">
            <SkylineIcon />
            <div className="text-left">
              <Num>{stats.milesToLosAngeles}</Num>
              <Label>Miles to Los Angeles</Label>
            </div>
          </Cell>

          <Cell className="gap-5 sm:col-span-2 lg:col-[6/9] lg:row-[4/5]">
            <CoastIcon />
            <div className="text-left">
              <Num>{stats.minutesToCoast}</Num>
              <Label>
                Minutes to the
                <br />
                Pacific coast
              </Label>
            </div>
          </Cell>
        </div>
      </div>
    </section>
  )
}
