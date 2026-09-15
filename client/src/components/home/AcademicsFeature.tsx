import { Link } from 'react-router-dom'
import { ButtonLink, Eyebrow, ImagePlaceholder } from '../ui'

const pillars = [
  {
    title: 'Advanced by design',
    text: 'Accelerated mathematics, laboratory science, analytical writing, and original research, with advanced courses and independent study for students ready to go further.',
  },
  {
    title: 'Curiosity at the center',
    text: 'Harkness discussions challenge students to ask better questions, defend their thinking, and pursue ideas for their own sake.',
  },
  {
    title: 'A scholar-athlete’s work ethic',
    text: 'The same discipline that drives year-round training shapes how students prepare, persist, and hold themselves to the highest standard in the classroom.',
  },
]

const departments = [
  'English',
  'Mathematics',
  'Science',
  'History & Social Studies',
  'World Languages',
  'Arts',
  'Technology & Engineering',
  'Advanced Courses',
  'Student Research',
  'Independent Study',
]

export default function AcademicsFeature() {
  return (
    <section className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <ImagePlaceholder label="Students at the Harkness table" className="aspect-[5/4]" />

        <div>
          <Eyebrow>Academics</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            Rigor that sparks curiosity
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/75">
            Academics come first. Modeled on New England’s most demanding boarding schools, our
            curriculum pushes students well beyond grade level and asks them to work, think, and
            write like scholars long before college.
          </p>

          <ol className="mt-8 border-t border-ink/15">
            {pillars.map((pillar, i) => (
              <li key={pillar.title} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-ink/15 py-5">
                <span className="font-serif text-2xl text-brass">{i + 1}</span>
                <div>
                  <h3 className="font-serif text-2xl">{pillar.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink/70">{pillar.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <ul className="mt-8 flex flex-wrap gap-2">
            {departments.map((dept) => (
              <li key={dept}>
                <Link
                  to="/academics/departments"
                  className="inline-block border border-ink/15 px-3 py-1.5 text-sm text-ink/80 transition-colors hover:border-brass hover:text-brass"
                >
                  {dept}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <ButtonLink to="/academics">Explore Academics</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
