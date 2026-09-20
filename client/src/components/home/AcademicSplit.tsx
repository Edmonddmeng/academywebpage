import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow } from '../ui'
import Reveal from '../Reveal'
import { useLocale } from '../../content/locale'

const tagsCopy = {
  en: ['Up to 20 AP Courses', 'Small classes', 'Honors in every department', 'NCAA-aligned'],
  zh: ['最多20门AP课程', '小班教学', '每个学科均设荣誉课程', '符合NCAA要求'],
}

const copy = {
  en: {
    eyebrow: 'Academic',
    heading: 'A diploma with Ivy League rigor',
    text: 'A fully rigorous college-preparatory curriculum — honors coursework in every department, up to 20 Advanced Placement courses, and a workload that matches any top academic high school in the country — scheduled around training, not around it.',
    link: 'NCAA Eligibility',
  },
  zh: {
    eyebrow: '学术',
    heading: '媲美常春藤标准的严谨文凭',
    text: '一套完全严谨的大学预备课程——每个学科都设有荣誉课程,最多可修读20门AP课程,课业强度不逊于全美任何一所顶尖学术高中——课表围绕训练安排,而非围绕课表安排训练。',
    link: 'NCAA 参赛资格',
  },
}

// A full-bleed photo/text split — the section's image is the point, not a paragraph.
export default function AcademicSplit() {
  const locale = useLocale()
  const t = copy[locale]
  const tags = tagsCopy[locale]
  return (
    <section className="grid lg:grid-cols-2">
      <Reveal as="div" className="relative aspect-[4/3] lg:aspect-auto">
        <img
          src="/images/academic-seminar.jpg"
          alt="A teacher and students working closely in a seminar-style classroom"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </Reveal>

      <Reveal
        delay={120}
        className="flex flex-col justify-center bg-ink px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-14"
      >
        <Eyebrow onDark>{t.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
          {t.heading}
        </h2>
        <p className="mt-5 max-w-md text-lg text-white/80">
          {t.text}
        </p>

        <ul className="mt-7 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="border border-white/25 px-3 py-1.5 font-condensed text-[13px] font-semibold tracking-wide text-white/85 uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>

        <Link
          to="/academic/ncaa-eligibility"
          className="mt-8 inline-flex w-fit items-center gap-3 font-condensed text-[17px] font-semibold tracking-[0.18em] text-gold uppercase transition-colors hover:text-white"
        >
          {t.link}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Reveal>
    </section>
  )
}
