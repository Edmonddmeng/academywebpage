import type { ReactNode } from 'react'
import { ButtonLink, ImagePlaceholder } from '../ui'
import { EvenGrid } from '../EvenGrid'
import type { Sport } from '../../content/sports'
import type { SportTab } from '../../content/sportTabs'
import { useLocale } from '../../content/locale'

// "Strength & Conditioning Coach" -> "SCC"; stands in for a headshot until staff are announced.
// For Chinese role names (no spaces), fall back to the first two characters instead.
const roleInitials = (role: string) => {
  const latin = role
    .split(' ')
    .filter((word) => /^[A-Za-z]/.test(word))
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
  return latin || role.slice(0, 2)
}

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

function NumberedList({ items }: { items: string[] }) {
  return (
    <EvenGrid items={items} maxCols={2} gap="gap-x-10" as="ol">
      {(item, i) => (
        <li key={item} className="flex items-baseline gap-4 border-b border-ink/10 py-4">
          <span className="text-sm font-semibold text-brass">{String(i + 1).padStart(2, '0')}</span>
          <span className="text-lg">{item}</span>
        </li>
      )}
    </EvenGrid>
  )
}

const copy = {
  en: {
    date: 'Date',
    location: 'Location',
    result: 'Result',
    scheduleEmpty: 'The upcoming season’s schedule will be posted soon.',
    rosterEmpty: 'The roster will be announced ahead of the season.',
    coachesLead: (title: string) =>
      `Every ${title} athlete is developed by a full coaching team, not a single coach. Staff biographies will be published as appointments are announced.`,
    tba: 'To be announced',
    trainingPhilosophy: 'Training philosophy',
    trainingLead:
      'Training is planned across the season, balancing skill development, competition, strength, and recovery around each athlete’s academic schedule and Athlete Performance Profile.',
    sampleWeek: 'Sample training week',
    day: 'Day',
    morning: 'Morning',
    afternoon: 'Afternoon',
    performanceLead: (title: string) =>
      `${title} athletes work with strength coaches, conditioning coaches, and sports performance staff on an individualized plan built around their age, physical development, position, and goals.`,
    performanceItems: [
      'Athlete Performance Profile',
      'Strength & power',
      'Speed & conditioning',
      'Mobility & recovery',
      'Injury prevention',
      'Nutrition support',
    ],
    strengthConditioning: 'Strength & Conditioning',
    collegeRecruiting: 'College Recruiting',
    venuePhotos: 'Venue photography coming soon',
  },
  zh: {
    date: '日期',
    location: '地点',
    result: '结果',
    scheduleEmpty: '本赛季的赛程即将发布。',
    rosterEmpty: '本赛季的球员名单将在赛季开始前公布。',
    coachesLead: (title: string) =>
      `每一位${title}运动员都由一整支教练团队共同培养，而非单独一位教练。教练团队人选公布后，将在此发布个人简介。`,
    tba: '待公布',
    trainingPhilosophy: '训练理念',
    trainingLead:
      '训练贯穿整个赛季进行规划，兼顾技术发展、比赛、力量训练与恢复，并围绕每位运动员的学业安排与《运动员表现档案》制定。',
    sampleWeek: '典型训练周示例',
    day: '星期',
    morning: '上午',
    afternoon: '下午',
    performanceLead: (title: string) =>
      `${title}运动员与力量教练、体能教练及运动表现团队合作，依据其年龄、身体发育阶段、位置与目标，制定个人化训练计划。`,
    performanceItems: [
      '运动员表现档案',
      '力量与爆发力',
      '速度与体能',
      '灵活性与恢复',
      '伤病预防',
      '营养支持',
    ],
    strengthConditioning: '体能与力量训练',
    collegeRecruiting: '大学体育特招',
    venuePhotos: '场地实景照片拍摄中，敬请期待',
  },
}

export function SportPanel({ sport, tab }: { sport: Sport; tab: SportTab }) {
  const t = copy[useLocale()]

  switch (tab) {
    case 'schedule':
      return (
        <DataTable columns={[t.date, sport.opponentColumn, t.location, t.result]} empty={t.scheduleEmpty} />
      )

    case 'roster':
      return <DataTable columns={sport.rosterColumns} empty={t.rosterEmpty} />

    case 'coaches':
      return (
        <div className="space-y-10">
          <Lead>{t.coachesLead(sport.title)}</Lead>
          <EvenGrid items={sport.staff} maxCols={3}>
            {(role) => (
              <li key={role} className="flex items-center gap-5 border border-dotted border-ink/45 p-6">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ink font-condensed text-lg font-semibold tracking-wide text-white">
                  {roleInitials(role)}
                </span>
                <div>
                  <p className="font-serif text-2xl">{t.tba}</p>
                  <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-brass uppercase">{role}</p>
                </div>
              </li>
            )}
          </EvenGrid>
        </div>
      )

    case 'training':
      return (
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-8">
            <PanelHeading>{t.trainingPhilosophy}</PanelHeading>
            <Lead>{t.trainingLead}</Lead>
            <NumberedList items={sport.focus} />
          </div>
          <div className="space-y-8">
            <PanelHeading>{t.sampleWeek}</PanelHeading>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left">
                <thead>
                  <tr className="border-b-2 border-ink">
                    {[t.day, t.morning, t.afternoon].map((column) => (
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
          <EvenGrid items={sport.venue.features} maxCols={3}>
            {(feature, i) => (
              <li key={feature} className="border border-dotted border-ink/45 px-6 py-8">
                <span className="font-serif text-3xl text-brass">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-4 font-condensed text-[17px] font-semibold tracking-wide text-ink uppercase">
                  {feature}
                </p>
              </li>
            )}
          </EvenGrid>
          {sport.venue.gallery.length > 0 ? (
            <EvenGrid items={sport.venue.gallery} maxCols={3} gap="gap-8 md:gap-12">
              {(photo, i) => (
                <li key={'src' in photo ? photo.src : i}>
                  {'src' in photo ? (
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className="aspect-[3/2] w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder label={photo.placeholder} className="aspect-[3/2] w-full" />
                  )}
                </li>
              )}
            </EvenGrid>
          ) : (
            <ImagePlaceholder label={t.venuePhotos} className="aspect-[21/9] w-full" />
          )}
        </div>
      )

    case 'performance':
      return (
        <div className="space-y-10">
          <Lead>{t.performanceLead(sport.title)}</Lead>
          <NumberedList items={t.performanceItems} />
          <ButtonLink to="/athletic/strength-and-conditioning" variant="outline">
            {t.strengthConditioning}
          </ButtonLink>
        </div>
      )

    case 'recruiting':
      return (
        <div className="space-y-10">
          <Lead>{sport.recruiting}</Lead>
          <ButtonLink to="/counseling/college-recruiting" variant="outline">
            {t.collegeRecruiting}
          </ButtonLink>
        </div>
      )
  }
}
