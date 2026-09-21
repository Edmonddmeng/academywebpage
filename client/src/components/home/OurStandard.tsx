import Reveal from '../Reveal'
import { useLocale } from '../../content/locale'

const copy = {
  en: {
    heading: 'Our Standard Is Results.',
    push: 'We push every student to become someone they never thought they could become.',
    ask: 'We ask for the best — as a person, as a scholar, and as an athlete. Nothing less.',
    teamHeading: 'Built by people who have done this before',
    teamText:
      'We are a team of former admission officers, educators, K–12 teachers, elite professional players and coaches, and university professors — brought together to build the best experience possible.',
    team: ['Former Admission Officers', 'Educators & K–12 Teachers', 'Elite Professional Coaches', 'University Professors'],
  },
  zh: {
    heading: '我们的标准是结果。',
    push: '我们推动每一位学生，成长为连他们自己都未曾想过能够成为的人。',
    ask: '我们对学生只有一个要求——做到最好：作为一个人，作为一名学者，也作为一名运动员。没有例外。',
    teamHeading: '由真正做过这件事的人搭建',
    teamText:
      '我们的团队由前大学招生官、资深教育工作者、K-12教师、顶尖职业球员与教练，以及大学教授组成——共同为每一位学生打造最好的成长体验。',
    team: ['前大学招生官', 'K-12教育工作者', '顶尖职业教练', '大学教授'],
  },
}

// A full-bleed dark statement band — the site's most direct, unhedged claim, followed
// immediately by the credentials that back it up.
export default function OurStandard() {
  const t = copy[useLocale()]
  return (
    <section className="bg-ink px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-14">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal as="div">
          <p className="font-serif text-4xl leading-tight text-gold sm:text-6xl lg:text-7xl">{t.heading}</p>
          <p className="mx-auto mt-9 max-w-2xl font-serif text-2xl leading-snug sm:text-3xl">{t.push}</p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">{t.ask}</p>
        </Reveal>

        <Reveal as="div" delay={120} className="mt-16 border-t border-white/15 pt-12">
          <p className="font-condensed text-[13px] font-semibold tracking-[0.24em] text-white/50 uppercase">
            {t.teamHeading}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70">{t.teamText}</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {t.team.map((role) => (
              <li
                key={role}
                className="border border-white/25 px-4 py-2 font-condensed text-[13px] font-semibold tracking-wide text-white/85 uppercase"
              >
                {role}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
