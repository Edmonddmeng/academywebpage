import { useState } from 'react'
import { Eyebrow, ImagePlaceholder } from '../ui'

// Placeholder destinations — replace with real places and travel times once the campus is set.
const places = {
  Local: ['Ice rink', 'Golf course', 'Lacrosse and training fields', 'Sports medicine partners'],
  Regional: [
    'University campuses for college visits',
    'Beaches and outdoor recreation',
    'Theme parks and weekend trips',
    'Museums and cultural attractions',
  ],
  Global: [
    'International airport access',
    'Students and families from around the world',
    'National and international tournaments',
  ],
}

type Scope = keyof typeof places

export default function PlaceSection() {
  const [scope, setScope] = useState<Scope>('Local')

  return (
    <section className="bg-ivory px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow>Our Location</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            A place that shapes who you become
          </h2>

          <div className="mt-10 flex gap-8 border-b border-ink/15" role="group" aria-label="Distance">
            {(Object.keys(places) as Scope[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setScope(key)}
                aria-pressed={scope === key}
                className={`-mb-px border-b-2 pb-3 text-sm font-semibold tracking-[0.2em] uppercase transition-colors ${
                  scope === key ? 'border-brass text-ink' : 'border-transparent text-ink/50 hover:text-ink'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <ul key={scope} className="mt-4 animate-fade-in">
            {places[scope].map((place) => (
              <li key={place} className="border-b border-ink/10 py-4 font-serif text-2xl">
                {place}
              </li>
            ))}
          </ul>
        </div>

        <ImagePlaceholder label="Campus map" className="aspect-square" />
      </div>
    </section>
  )
}
