import type { ReactNode } from 'react'
import { Eyebrow } from '../ui'
import Reveal from '../Reveal'
import { SportSymbol } from '../symbols'
import { useSports } from '../../content/sports'
import { useLocale } from '../../content/locale'

const copy = {
  en: {
    eyebrow: 'At a Glance',
    grades: 'Grades served',
    fourSports: 'Four sports',
    boysGirls: 'Boys & girls',
    management: 'Student-athlete management',
    integrated: 'Integrated',
    performanceTeam: 'Performance team for every student-athlete',
  },
  zh: {
    eyebrow: '学院概览',
    grades: '招生年级',
    fourSports: '四项体育项目',
    boysGirls: '男女均设',
    management: '学生运动员管理配比',
    integrated: '一体化',
    performanceTeam: '为每位学生运动员配备的综合体能团队',
  },
}

function Cell({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`flex flex-col items-center justify-center border border-dotted border-ink/40 px-6 py-10 text-center ${className}`}
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
    <p className="mt-3 font-condensed text-[15px] leading-snug font-semibold tracking-wide text-ink uppercase">
      {children}
    </p>
  )
}

const iconStroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function GradesIcon() {
  return (
    <svg viewBox="0 0 64 56" className="mx-auto mb-4 h-14 w-16 text-ink" aria-hidden="true" {...iconStroke} strokeWidth={3}>
      <path d="M32 12C24 6 14 5 4 7v40c10-2 20-1 28 5 8-6 18-7 28-5V7C50 5 40 6 32 12z" />
      <path d="M32 12v40" />
    </svg>
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

export default function AtAGlance() {
  const sports = useSports()
  const t = copy[useLocale()]
  return (
    <section id="at-a-glance" className="scroll-mt-16 bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <Eyebrow className="text-center">{t.eyebrow}</Eyebrow>

        <Reveal as="div" className="mt-10 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
          <Cell>
            <GradesIcon />
            <Num>6–12</Num>
            <Label>{t.grades}</Label>
          </Cell>

          <Cell>
            <p className="font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase">
              {t.fourSports}
            </p>
            <div className="mt-4 flex items-end justify-center gap-4">
              {(['ice-hockey', 'golf', 'lacrosse', 'tennis'] as const).map((kind) => {
                const sport = sports.find((s) => s.kind === kind)!
                return (
                  <div key={kind} className="flex flex-col items-center">
                    <SportSymbol kind={kind} className="mx-auto h-9 w-9 text-brass" />
                    <span className="mt-2 font-condensed text-[11px] font-semibold tracking-wide text-ink uppercase">
                      {sport.sport}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="mt-4 font-condensed text-[13px] font-semibold tracking-wide text-ink/60 uppercase">
              {t.boysGirls}
            </p>
          </Cell>

          <Cell>
            <FiveToOneRing />
            <Num>5:1</Num>
            <Label>{t.management}</Label>
          </Cell>

          <Cell>
            <HandsIcon />
            <p className="font-serif text-2xl leading-tight text-ink">{t.integrated}</p>
            <Label>{t.performanceTeam}</Label>
          </Cell>
        </Reveal>
      </div>
    </section>
  )
}
