import type { ReactNode } from 'react'
import { ButtonLink } from '../ui'
import type { Sport } from '../../content/sports'
import type { SportTab } from '../../content/sportTabs'

// "Strength & Conditioning Coach" -> "SCC"; stands in for a headshot until staff are announced.
const roleInitials = (role: string) =>
  role
    .split(' ')
    .filter((word) => /^[A-Za-z]/.test(word))
    .map((word) => word[0])
    .join('')
    .slice(0, 3)

function Lead({ children }: { children: ReactNode }) {
  return <p className="max-w-4xl text-lg leading-relaxed text-ink/75">{children}</p>
}

function PanelHeading({ children }: { children: ReactNode }) {
  return <h3 className="font-serif text-3xl text-ink">{children}</h3>
}

// Header-only table until real rows exist; the empty message sits outside the scroller so it never clips on mobile.
function DataTable({ columns, empty }: { columns: string[]; empty: string }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b-2 border-ink">
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="py-3 pr-6 font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      <p className="border-b border-ink/10 px-4 py-12 text-center text-ink/60">{empty}</p>
    </div>
  )
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="border border-dotted border-ink/40 px-6 py-14 text-center text-lg text-ink/65">
      {children}
    </div>
  )
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-x-10 sm:grid-cols-2">
      {items.map((item, i) => (
        <li key={item} className="flex items-baseline gap-4 border-b border-ink/10 py-4">
          <span className="text-sm font-semibold text-brass">{String(i + 1).padStart(2, '0')}</span>
          <span className="text-lg">{item}</span>
        </li>
      ))}
    </ol>
  )
}

export function SportPanel({ sport, tab }: { sport: Sport; tab: SportTab }) {
  switch (tab) {
    case 'schedule':
      return (
        <DataTable
          columns={['Date', sport.opponentColumn, 'Location', 'Result']}
          empty="The upcoming season’s schedule will be posted soon."
        />
      )

    case 'roster':
      return (
        <DataTable columns={sport.rosterColumns} empty="The roster will be announced ahead of the season." />
      )

    case 'coaches':
      return (
        <div className="space-y-10">
          <Lead>
            Every {sport.title} athlete is developed by a full coaching team, not a single coach.
            Staff biographies will be published as appointments are announced.
          </Lead>
          <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {sport.staff.map((role) => (
              <li key={role} className="flex items-center gap-5 border border-dotted border-ink/45 p-6">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ink font-condensed text-lg font-semibold tracking-wide text-white">
                  {roleInitials(role)}
                </span>
                <div>
                  <p className="font-serif text-2xl">To be announced</p>
                  <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-brass uppercase">{role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'training':
      return (
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-8">
            <PanelHeading>Training philosophy</PanelHeading>
            <Lead>
              There is no off-season. Training is planned across the full year, balancing skill
              development, competition, strength, and recovery around each athlete’s academic
              schedule and Athlete Performance Profile.
            </Lead>
            <NumberedList items={sport.focus} />
          </div>
          <div className="space-y-8">
            <PanelHeading>Sample training week</PanelHeading>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left">
                <thead>
                  <tr className="border-b-2 border-ink">
                    {['Day', 'Morning', 'Afternoon'].map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="py-3 pr-6 font-condensed text-[15px] font-semibold tracking-wide uppercase"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sport.week.map((session) => (
                    <tr key={session.day} className="border-b border-ink/10">
                      <th scope="row" className="py-3 pr-6 font-semibold">
                        {session.day}
                      </th>
                      <td className="py-3 pr-6 text-ink/75">{session.morning}</td>
                      <td className="py-3 text-ink/75">{session.afternoon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )

    case 'venue':
      return (
        <div className="space-y-12">
          <Lead>{sport.venue.text}</Lead>
          <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
            {sport.venue.features.map((feature, i) => (
              <li key={feature} className="border border-dotted border-ink/45 px-6 py-8">
                <span className="font-serif text-3xl text-brass">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-4 font-condensed text-[17px] font-semibold tracking-wide text-ink uppercase">
                  {feature}
                </p>
              </li>
            ))}
          </ul>
          <div
            className={`grid gap-8 md:gap-12 ${sport.venue.gallery.length > 1 ? 'md:grid-cols-2' : ''}`}
          >
            {sport.venue.gallery.map((photo) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover"
              />
            ))}
          </div>
        </div>
      )

    case 'performance':
      return (
        <div className="space-y-10">
          <Lead>
            {sport.title} athletes work with strength coaches, conditioning coaches, and sports
            performance staff on an individualized plan built around their age, physical
            development, position, and goals.
          </Lead>
          <NumberedList
            items={[
              'Athlete Performance Profile',
              'Strength & power',
              'Speed & conditioning',
              'Mobility & recovery',
              'Injury prevention',
              'Nutrition support',
            ]}
          />
          <ButtonLink to="/athletic/strength-and-conditioning" variant="outline">
            Strength & Conditioning
          </ButtonLink>
        </div>
      )

    case 'recruiting':
      return (
        <div className="space-y-10">
          <Lead>{sport.recruiting}</Lead>
          <ButtonLink to="/counseling/college-recruiting" variant="outline">
            College Recruiting
          </ButtonLink>
        </div>
      )

    case 'alumni':
      return (
        <EmptyState>
          As our first classes graduate, {sport.title} alumni competing in college and beyond will be
          featured here.
        </EmptyState>
      )

    case 'seasons':
      return (
        <details className="group border-t border-b border-ink/15">
          <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-serif text-2xl">
            Season archives
            <span className="text-3xl leading-none text-brass transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="pb-6 text-ink/70">
            Results, rosters, and highlights from each season will be archived here, beginning with
            our inaugural season.
          </p>
        </details>
      )
  }
}
