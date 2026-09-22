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
    lead: 'Build a profile that elite colleges can’t ignore. We prepare you for the nation’s top tiers with a fully rigorous prep curriculum, built completely around your training schedule, not against it.',
    text: 'The best universities demand true scholar-athletes. That is why we deliver honors coursework in every department and up to 20 Advanced Placement (AP) courses, matching the academic workload of the country’s most prestigious prep schools. We ensure your GPA and transcript stand alone as elite, opening doors to the highest level of collegiate competition and education.',
    link: 'NCAA Eligibility',
  },
  zh: {
    eyebrow: '学术',
    heading: '媲美常春藤标准的严谨文凭',
    lead: '打造一份顶尖大学无法忽视的个人档案。我们以完全严谨的预备课程，帮助你迈向全美顶尖学府，课程完全围绕你的训练安排设计，而不是与训练相冲突。',
    text: '顶尖大学需要真正的学者型运动员。因此，我们在每个学科都开设荣誉课程，并提供最多20门AP（Advanced Placement）课程，学术强度媲美全美最负盛名的预备学校。我们确保你的GPA与成绩单本身就足以脱颖而出，为你打开通往最高水平大学竞技与教育的大门。',
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
        <p className="mt-5 max-w-xl text-xl leading-snug text-white">
          {t.lead}
        </p>
        <p className="mt-4 max-w-xl text-lg text-white/80">
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
