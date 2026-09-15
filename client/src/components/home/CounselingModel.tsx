import { ButtonLink, Eyebrow } from '../ui'

const team = [
  {
    role: 'Athlete Recruiter',
    text: 'Builds a recruiting strategy and leads outreach to college coaches.',
  },
  {
    role: 'Coach',
    text: 'Develops the athlete and advocates for their next level of play.',
  },
  {
    role: 'Education Consultant',
    text: 'Guides course selection, GPA planning, competitions, and essays.',
  },
  {
    role: 'Student Assistant',
    text: 'Keeps daily progress, deadlines, and applications on track.',
  },
  {
    role: 'Family Advisor',
    text: 'Partners with parents through every decision, offer, and enrollment.',
  },
]

export default function CounselingModel() {
  return (
    <section className="bg-ivory px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div>
          <p className="font-serif text-[7rem] leading-none text-brass sm:text-[10rem]">5:1</p>
          <Eyebrow className="mt-6">College Counseling</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            Five professionals. One student.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/75">
            Instead of one counselor for hundreds of students, every student is supported by a
            dedicated team of five, working together from course selection and summer programs to
            recruitment, applications, and the transition to college.
          </p>
          <div className="mt-10">
            <ButtonLink to="/college-counseling/5-to-1-counseling-model">
              The 5-to-1 Model
            </ButtonLink>
          </div>
        </div>

        <ol className="self-center border-t border-ink/15">
          {team.map((member, i) => (
            <li key={member.role} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-ink/15 py-7">
              <span className="font-serif text-3xl text-brass">{i + 1}</span>
              <div>
                <h3 className="font-serif text-2xl">{member.role}</h3>
                <p className="mt-1 text-ink/70">{member.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
