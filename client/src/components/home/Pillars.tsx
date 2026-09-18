import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow } from '../ui'
import Reveal from '../Reveal'
import { SportSymbol } from '../symbols'
import { sportKinds, sports } from '../../content/sports'

type Tone = 'dark' | 'light'

function Panel({
  index,
  label,
  title,
  lead,
  to,
  linkLabel,
  tone,
  children,
}: {
  index: string
  label: string
  title: string
  lead: string
  to: string
  linkLabel: string
  tone: Tone
  children: ReactNode
}) {
  const dark = tone === 'dark'
  return (
    <section
      className={`px-6 py-20 sm:px-10 sm:py-28 lg:px-14 ${dark ? 'bg-ink text-white' : 'bg-ivory text-ink'}`}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={`flex items-center gap-4 border-b pb-5 ${dark ? 'border-white/25' : 'border-ink/20'}`}
        >
          <span className={`font-condensed text-[15px] font-semibold tracking-[0.2em] ${dark ? 'text-white/55' : 'text-ink/45'}`}>
            {index} / 04
          </span>
          <Eyebrow onDark={dark}>{label}</Eyebrow>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{title}</h2>
            <p className={`mt-6 text-lg leading-relaxed ${dark ? 'text-white/80' : 'text-ink/75'}`}>
              {lead}
            </p>
            <Link
              to={to}
              className={`mt-8 inline-flex items-center gap-3 font-condensed text-[17px] font-semibold tracking-[0.18em] uppercase transition-colors ${
                dark ? 'text-gold hover:text-white' : 'text-brass hover:text-ink'
              }`}
            >
              {linkLabel}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Reveal>
          <Reveal delay={150}>{children}</Reveal>
        </div>
      </div>
    </section>
  )
}

/** Bordered readout tile used inside the panels. */
function Tile({
  k,
  v,
  tone,
}: {
  k: string
  v: string
  tone: Tone
}) {
  const dark = tone === 'dark'
  return (
    <div className={`border p-5 ${dark ? 'border-white/20 bg-white/5' : 'border-ink/20 bg-white'}`}>
      <p className={`font-condensed text-[14px] font-semibold tracking-[0.18em] uppercase ${dark ? 'text-gold' : 'text-brass'}`}>
        {k}
      </p>
      <p className={`mt-2 leading-relaxed ${dark ? 'text-white/80' : 'text-ink/75'}`}>{v}</p>
    </div>
  )
}

function Steps({ items, tone }: { items: { title: string; text: string }[]; tone: Tone }) {
  const dark = tone === 'dark'
  return (
    <ol className={`border-t ${dark ? 'border-white/20' : 'border-ink/20'}`}>
      {items.map((item, i) => (
        <li
          key={item.title}
          className={`grid grid-cols-[2.5rem_1fr] gap-4 border-b py-5 ${dark ? 'border-white/20' : 'border-ink/20'}`}
        >
          <span className={`font-serif text-2xl ${dark ? 'text-gold' : 'text-brass'}`}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="font-serif text-2xl">{item.title}</h3>
            <p className={`mt-1 leading-relaxed ${dark ? 'text-white/75' : 'text-ink/70'}`}>
              {item.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function PillarsIntro() {
  return (
    <section className="bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-14">
      <Reveal as="div" className="mx-auto max-w-4xl text-center">
        <Eyebrow className="justify-center">The JMC Student-Athlete</Eyebrow>
        <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
          Four things we are accountable for
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-ink/75">
          Academics, athletic development, college recruiting, and daily life are not four separate
          departments passing an athlete between them. They are one plan, reviewed together, for one
          athlete at a time.
        </p>
      </Reveal>
    </section>
  )
}

export function AcademicPillar() {
  return (
    <Panel
      index="01"
      label="Academic"
      title="A rigorous diploma, built on inquiry, not a fixed pace"
      lead="JMC athletes earn a college-preparatory diploma through our own academic program: small classes built on inquiry, critical thinking, and mastery of the material, on a schedule built around training, competition, and travel."
      to="/academic/ncaa-eligibility"
      linkLabel="NCAA Eligibility"
      tone="dark"
    >
      <div className="grid gap-1.5 sm:grid-cols-2">
        <Tile tone="dark" k="Core-course planning" v="Course selection is built against NCAA core-course rules from the first term, not the last." />
        <Tile tone="dark" k="Termly review" v="Grades, credits, and eligibility status are reviewed every term by advisor and recruiter together." />
        <Tile tone="dark" k="Approved courses" v="Every course we teach sits on the NCAA-approved course list." />
        <Tile tone="dark" k="Eligibility Center" v="Registration, transcripts, and test scores handled and submitted on time." />
        <Tile tone="dark" k="Testing & applications" v="SAT and AP preparation timed so competition travel never collides with an exam." />
        <Tile tone="dark" k="One shared record" v="Advisor, coach, recruiter, and family all work from the same up-to-date file." />
      </div>
    </Panel>
  )
}

export function AthleticPillar() {
  return (
    <Panel
      index="02"
      label="Athletic Development"
      title="Season-long development under professional coaching"
      lead="Eight programs across four sports, each led by a full coaching staff rather than a single coach. Training runs in planned blocks across the season, supported by strength, conditioning, and recovery specialists."
      to="/athletic"
      linkLabel="Explore Athletics"
      tone="light"
    >
      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {sportKinds.map((kind, i) => {
          const sport = sports.find((s) => s.kind === kind)!
          return (
            <Reveal as="li" key={kind} delay={i * 70}>
              <Link
                to={`/athletic/boys-${kind}`}
                className="flex h-full flex-col items-center justify-center gap-3 border border-ink/20 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brass hover:shadow-[0_10px_24px_-12px_rgba(18,61,40,0.35)]"
              >
                <SportSymbol kind={kind} className="h-11 w-11 text-brass" />
                <span className="font-serif text-xl leading-tight">{sport.sport}</span>
                <span className="font-condensed text-[13px] font-semibold tracking-[0.16em] text-ink/55 uppercase">
                  Boys · Girls
                </span>
              </Link>
            </Reveal>
          )
        })}
      </ul>

      <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
        <Tile tone="light" k="D1 coaching resources" v="Coaches hired for playing and coaching experience at the level our athletes are aiming for." />
        <Tile tone="light" k="High-tier club training" v="Daily technical blocks at club standard, not a school-season practice schedule." />
        <Tile tone="light" k="Competition calendar" v="League play, tournaments, and showcases chosen for the athlete's level and exposure." />
        <Tile tone="light" k="Strength & conditioning" v="Individual plans from an Athlete Performance Profile, tested and re-tested." />
      </div>
    </Panel>
  )
}

const recruitingSteps = [
  {
    title: 'Build',
    text: 'Develop the athlete, establish grades, and learn how recruiting actually works. No premature outreach.',
  },
  {
    title: 'Exposure',
    text: 'Targeted tournaments and showcases, first highlight film, and an honest assessment of realistic levels.',
  },
  {
    title: 'Outreach',
    text: 'Direct coach communication, campus visits, official interest, and applications — prepared by the team.',
  },
  {
    title: 'Commit',
    text: 'Comparing offers on playing time, academics, cost, and fit, then supporting the move to college.',
  },
]

export function RecruitingPillar() {
  return (
    <Panel
      index="03"
      label="College Recruiting"
      title="Five professionals on one athlete's recruitment"
      lead="A typical high-school counselor carries hundreds of students and no recruiting brief. At JMC every athlete has a team of five — recruiter, coach, academic advisor, student assistant, and family advisor — meeting regularly about that athlete alone."
      to="/counseling/5-to-1-model"
      linkLabel="The 5-to-1 Model"
      tone="dark"
    >
      <Steps items={recruitingSteps} tone="dark" />
    </Panel>
  )
}

export function StudentLifePillar() {
  return (
    <Panel
      index="04"
      label="Student Life"
      title="Fuelled, rested, and recovered — every single day"
      lead="Training only counts if the body absorbs it. Meals are timed around sessions rather than a standard school lunch bell, sleep is protected, and recovery is scheduled like any other block in the day."
      to="/student-life/dining-and-nutrition"
      linkLabel="Dining & Nutrition"
      tone="light"
    >
      <div className="grid gap-1.5 sm:grid-cols-2">
        <Tile tone="light" k="Athlete nutrition" v="Menus built around protein, carbohydrate, and hydration needs on heavy and light training days." />
        <Tile tone="light" k="Extra fuelling" v="Pre-training, post-training, and evening snacks beyond three meals a day." />
        <Tile tone="light" k="Strength & fitness" v="Daily performance-centre access with coaching, not an unsupervised weight room." />
        <Tile tone="light" k="Recovery & sleep" v="Mobility, treatment, and protected lights-out hours built into the routine." />
        <Tile tone="light" k="Residence life" v="Two athletes per room with residential staff on every floor and supervised study." />
        <Tile tone="light" k="Life off campus" v="Weekend trips, service, and downtime away from the rink, course, court, and field." />
      </div>
    </Panel>
  )
}
