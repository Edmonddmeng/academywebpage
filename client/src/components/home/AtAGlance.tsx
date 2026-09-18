import type { ReactNode } from 'react'
import { Eyebrow } from '../ui'
import Reveal from '../Reveal'
import { SportSymbol } from '../symbols'
import { sportKinds, sports } from '../../content/sports'

function Cell({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`flex items-center justify-center border border-dotted border-ink/40 px-6 py-8 text-center ${className}`}
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

/** A two-color ring split evenly between the two campuses. */
function CampusRing() {
  const r = 25
  const c = 2 * Math.PI * r
  return (
    <div className="relative mx-auto mb-4 h-28 w-48">
      <svg
        viewBox="0 0 100 100"
        className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 -rotate-90"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-mist)" strokeWidth="50" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="50"
          strokeDasharray={`${c / 2} ${c}`}
        />
      </svg>
      <span className="absolute top-0 left-0 text-left leading-tight">
        <span className="block font-serif text-sm text-ink">Irvine</span>
        <span className="font-condensed text-[11px] font-semibold text-ink/70 uppercase">
          Orange County
        </span>
      </span>
      <span className="absolute right-0 bottom-0 text-right leading-tight">
        <span className="block font-serif text-sm text-ink">San Diego</span>
        <span className="font-condensed text-[11px] font-semibold text-ink/70 uppercase">
          Coastal SD
        </span>
      </span>
    </div>
  )
}

function FiveToOneRing() {
  const r = 38
  const c = 2 * Math.PI * r
  const seg = c / 5
  const gap = 2.5
  const colors = [
    'var(--color-ink)',
    'var(--color-sky)',
    'var(--color-gold)',
    'var(--color-ink-soft)',
    'var(--color-sky)',
  ]
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
    <svg
      viewBox="0 0 64 56"
      className="mx-auto mb-4 h-14 w-16 text-ink"
      aria-hidden="true"
      {...iconStroke}
      strokeWidth={3}
    >
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
      <Hand x={26} y={2} color="var(--color-gold)" />
      <Hand x={48} y={10} color="var(--color-sky)" />
    </svg>
  )
}

function AirportIcon() {
  return (
    <svg
      viewBox="0 0 72 72"
      className="h-20 w-20 shrink-0 text-ink"
      aria-hidden="true"
      {...iconStroke}
      strokeWidth={1.75}
    >
      <circle cx="36" cy="36" r="33" />
      <path d="M36 12 20 34l-9 2 3 4 10-2 4 10 4-1-2-9 20-14-2-7-14 9-8-9-4 2z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function CoastIcon() {
  return (
    <svg
      viewBox="0 0 72 72"
      className="h-20 w-20 shrink-0 text-ink"
      aria-hidden="true"
      {...iconStroke}
      strokeWidth={1.75}
    >
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

        <Reveal as="div" className="mt-10 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-8">
          <Cell className="flex-col lg:col-[1/3] lg:row-[1/2]">
            <CampusRing />
            <Num>2</Num>
            <Label>Campuses, one standard</Label>
          </Cell>

          <Cell className="-order-1 flex-col sm:col-span-2 lg:order-none lg:col-[3/7] lg:row-[1/2]">
            <p className="font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase">
              Four sports, boys and girls
            </p>
            <div className="mt-4 flex items-end justify-center gap-8 sm:gap-12">
              {sportKinds.map((kind) => {
                const sport = sports.find((s) => s.kind === kind)!
                return (
                  <div key={kind} className="flex flex-col items-center">
                    <SportSymbol kind={kind} className="mx-auto h-11 w-11 text-brass" />
                    <span className="mt-3 font-condensed text-[12px] font-semibold tracking-wide text-ink uppercase">
                      {sport.sport}
                    </span>
                  </div>
                )
              })}
            </div>
          </Cell>

          <Cell className="flex-col lg:col-[7/9] lg:row-[1/2]">
            <FiveToOneRing />
            <Num>5:1</Num>
            <Label>
              Professionals dedicated
              <br />
              to every athlete
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
            <HandsIcon />
            <Num>6</Num>
            <Label>
              Specialists on the average
              <br />
              coaching staff
            </Label>
          </Cell>

          <Cell className="flex-col lg:col-[7/9] lg:row-[2/4]">
            <BookIcon />
            <Num>2</Num>
            <Label>Academic partner schools</Label>
            <div className="mt-4">
              <Num>100%</Num>
              <Label>College-preparatory diploma</Label>
            </div>
          </Cell>

          <Cell className="flex-col lg:col-[1/3] lg:row-[3/5]">
            <Num>8</Num>
            <Label>Year-round programs in</Label>
            <div className="mt-4">
              <Num>4</Num>
              <Label>Elite sports</Label>
            </div>
          </Cell>

          <Cell className="flex-col lg:col-[3/5] lg:row-[3/4]">
            <Num>2</Num>
            <Label>Athletes per room in every residence</Label>
          </Cell>

          <Cell className="gap-5 sm:col-span-2 lg:col-[3/6] lg:row-[4/5]">
            <AirportIcon />
            <div className="text-left">
              <Num>2</Num>
              <Label>
                Regional airports
                <br />
                minutes from campus
              </Label>
            </div>
          </Cell>

          <Cell className="gap-5 sm:col-span-2 lg:col-[6/9] lg:row-[4/5]">
            <CoastIcon />
            <div className="text-left">
              <Num>12 months</Num>
              <Label>
                Of Pacific coast
                <br />
                training weather
              </Label>
            </div>
          </Cell>
        </Reveal>
      </div>
    </section>
  )
}
