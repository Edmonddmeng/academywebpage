import { Link, useSearchParams } from 'react-router-dom'
import { ImagePlaceholder } from '../components/ui'
import { SportPanel } from '../components/sport/panels'
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

        <ImagePlaceholder label={`${sport.title} in action`} className="mt-14 aspect-[16/9]" />

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

        <div id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`} className="pt-10">
          <SportPanel sport={sport} tab={active} />
        </div>
      </div>
    </div>
  )
}
