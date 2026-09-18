import { Link, useSearchParams } from 'react-router-dom'
import { SportSymbol } from '../components/symbols'
import { SportPanel } from '../components/sport/panels'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import { sportTabs, tabLabel, type SportTab } from '../content/sportTabs'
import type { Sport } from '../content/sports'

export default function SportPage({ sport }: { sport: Sport }) {
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const active: SportTab = sportTabs.find((tab) => tab === requested) ?? 'schedule'

  const selectTab = (tab: SportTab) =>
    setParams(tab === 'schedule' ? {} : { tab }, { replace: true, preventScrollReset: true })

  return (
    <div className="bg-ivory pt-32 pb-24 sm:pt-40">
      {/* Title between rules: the left rule starts at the content edge, the right rule runs to the viewport edge. */}
      <div className="flex items-center pl-(--gutter) [--gutter:1.5rem] sm:[--gutter:2.5rem] lg:[--gutter:max(3.5rem,calc((100vw-80rem)/2+3.5rem))]">
        <span className="h-px min-w-8 flex-1 bg-sky" />
        <h1 className="pl-6 font-serif text-5xl leading-none text-ink sm:pl-10 sm:text-7xl lg:text-8xl">
          {sport.title}
        </h1>
        <span className="block w-(--gutter) shrink-0 pl-6 sm:pl-10">
          <span className="block h-px bg-sky" />
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        <p className="mt-14 text-xl leading-relaxed text-ink/70 sm:text-2xl sm:leading-relaxed">
          {sport.intro(sport.title)}
        </p>

        <Reveal>
          <img
            src={sport.hero.src}
            alt={sport.hero.alt}
            className="mt-14 aspect-[16/9] w-full object-cover"
          />
        </Reveal>

        <div className="mt-6 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal
            delay={0}
            className="flex items-center justify-center border border-dotted border-ink/45 px-6 py-10"
          >
            <SportSymbol kind={sport.kind} className="h-20 w-20 text-ink" />
          </Reveal>
          {[
            { value: String(sport.focus.length), suffix: '', label: 'Training focus areas' },
            { value: String(sport.staff.length), suffix: '', label: 'Coaches & specialists' },
            { value: '5:1', suffix: '', label: 'College support model' },
          ].map((fact, i) => (
            <Reveal
              key={fact.label}
              delay={(i + 1) * 90}
              className="flex flex-col items-center justify-center border border-dotted border-ink/45 px-6 py-10 text-center"
            >
              <p className="font-serif text-5xl leading-none text-ink">
                <CountUp value={`${fact.value}${fact.suffix}`} />
              </p>
              <p className="mt-3 font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase">
                {fact.label}
              </p>
            </Reveal>
          ))}
        </div>

        <p className="mt-14 text-lg leading-relaxed text-ink/70">{sport.detail}</p>
        <p className="mt-6 text-lg text-ink/70">
          Student-athletes interested in learning more about {sport.title} should complete our{' '}
          <Link
            to="/contact"
            className="font-semibold text-ink underline decoration-brass underline-offset-4 hover:text-brass"
          >
            inquiry form
          </Link>
          .
        </p>

        <div className="relative mt-16">
          {/* Fade hints that the tab row scrolls sideways on narrow screens. */}
          <span className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-ivory lg:hidden" />
          <div className="overflow-x-auto">
          <div
            role="tablist"
            aria-label={`${sport.title} information`}
            className="flex min-w-max gap-8 shadow-[inset_0_-1px_0_rgb(19_35_63/0.15)]"
          >
            {sportTabs.map((tab) => {
              const selected = tab === active
              return (
                <button
                  key={tab}
                  id={`tab-${tab}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${tab}`}
                  onClick={() => selectTab(tab)}
                  className={`border-b-4 pb-3 text-lg font-semibold whitespace-nowrap transition-colors ${
                    selected ? 'border-ink text-ink' : 'border-transparent text-ink/55 hover:text-ink'
                  }`}
                >
                  {tabLabel(sport, tab)}
                </button>
              )
            })}
          </div>
          </div>
        </div>

        <Reveal
          key={active}
          as="div"
          id={`panel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="pt-10"
        >
          <SportPanel sport={sport} tab={active} />
        </Reveal>
      </div>
    </div>
  )
}
