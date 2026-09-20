// Page content for every non-sport page. Keys are `${section.slug}/${link.slug}`.
// Anything marked with a `note` block is unconfirmed and must be reviewed before launch.

import { site } from './site'

export type Block =
  | { type: 'prose'; heading?: string; paragraphs: string[] }
  | { type: 'numbered'; heading?: string; items: { title: string; text: string }[] }
  | { type: 'features'; heading?: string; items: { title: string; text?: string }[] }
  | { type: 'stats'; items: { value: string; label: string }[] }
  | { type: 'table'; heading?: string; columns: string[]; rows: string[][]; note?: string }
  | {
      type: 'matrix'
      heading?: string
      columns: string[]
      rows: { label: string; cells: string[][] }[]
      note?: string
    }
  | { type: 'faq'; heading?: string; items: { q: string; a: string }[] }
  | { type: 'cta'; heading: string; text?: string; links: { label: string; to: string }[] }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | {
      type: 'gallery'
      heading?: string
      items: { src: string; alt: string; caption?: string }[]
    }
  | {
      type: 'logos'
      heading?: string
      text?: string
      // Entries without `src` render as a typographic tile.
      items: { label: string; src?: string; alt?: string }[]
    }
  | { type: 'note'; text: string }
  | { type: 'statement'; text: string; attribution?: string }
  | {
      type: 'split'
      heading: string
      paragraphs: string[]
      reverse?: boolean
      image: { src: string; alt: string } | { placeholder: string }
    }
  | {
      type: 'people'
      heading?: string
      text?: string
      items: { name: string; role: string; bio?: string }[]
    }
  | {
      type: 'calendar'
      heading?: string
      items: { period: string; focus: string }[]
    }
  | { type: 'signature'; name: string; role: string; extra?: string }

export type PageContent = { intro: string; blocks: Block[] }

const visitCta: Block = {
  type: 'cta',
  heading: 'See it for yourself',
  text: 'The fastest way to understand the academy is to spend a day on campus during training.',
  links: [
    { label: 'Schedule a Visit', to: '/admission/visit' },
    { label: 'Inquire', to: '/contact' },
  ],
}

export const pageContent: Record<string, PageContent> = {
  // ABOUT
  // Jonathan Reyes is a placeholder person, invented for launch. Replace with the real
  // Head of Academy's name, background, and photo once hired.
  'about/head-of-academy': {
    intro: 'A letter from our founding Head of Academy.',
    blocks: [
      {
        type: 'split',
        heading: 'A letter before you apply',
        image: { src: '/images/jonathan-reyes.jpg', alt: 'Jonathan Reyes, Head of Academy' },
        paragraphs: [
          'I spent eleven seasons on the bench before I ever stood in front of a classroom, and both jobs taught me the same lesson: a kid who is only pushed in one direction eventually breaks in the other.',
        ],
      },
      {
        type: 'statement',
        text: 'The most competitive athletes I have ever coached were also the ones who felt safest off the field.',
      },
      {
        type: 'prose',
        paragraphs: [
          'A few years ago I sat across from a family who had flown in from overseas to see the campus before committing their son to us. The mother asked one question before anything else — not about ice time, not about our coaching staff, but whether he would be judged by how he played. She had heard the stories: American programs that treat a talented kid like an asset first and a teenager second, and quietly drop the second part the moment the first one stops being useful.',
          'That is the question I want every international family to ask, because it is the right one. We work with day schools we would trust with our own children — traditional, warm places built around the same thing every good American school has always been built around: a community that knows a student by name before it knows their statistics. Our athletes are not evaluated by how they perform. They are simply welcomed, the way any new student should be.',
          'For a family sending a child across an ocean especially, we are not only offering a training program. We are offering an actual American life — friends who stick around after the season ends, service trips and weekend outings that have nothing to do with a scoreboard, a dorm rector who lives and trains alongside our athletes rather than simply supervising them, and enough structure and discipline that a kid leaves us equipped to handle far more than a difficult opponent.',
          'None of that happens by accident. It happens because we chose to build a school where competitive excellence and a genuinely happy childhood are not in tension — where an athlete can be pushed hard on the field and still come home, every day, to people who care about them regardless of how the day went.',
          'I will not pretend we have this fully figured out. We are a new school, building toward the standard we have set for ourselves, one class and one season at a time. What I can promise is that every decision here starts from the same question: does this serve the whole person, or just the part of them that shows up on a highlight reel?',
          'If you are a family — especially one weighing this decision from another country — asking whether an American sports academy can also be a genuine home, I would like to talk with you. Come watch a training session, sit in on a class, meet the dorm rector who will actually live alongside your child, and judge for yourself whether we are building what we say we are.',
        ],
      },
      {
        type: 'signature',
        name: 'Jonathan Reyes',
        role: 'Founding Head of Academy',
      },
      visitCta,
    ],
  },

  'about/mission-and-vision': {
    intro: 'Academic Excellence · Elite Competition · All-Round Growth · Long-Term Development.',
    blocks: [
      {
        type: 'statement',
        text: 'JMC exists to build a professional, systematic, and enduring development path for grade 6–12 student-athletes serious about competing at the highest level of their sport — without ever trading away the rigor of their education.',
        attribution: 'Our Mission',
      },
      {
        type: 'prose',
        paragraphs: [
          'Most student-athletes are pushed to choose: train seriously and let school slip, or protect the transcript and train around whatever time is left. We think that choice is a failure of design, not a fact of life. So every student who joins JMC is issued a personal Student-Athlete Development Plan — built around their age, academic background, competitive level, physical development, and long-term goals — and a dedicated Student-Athlete Manager who coordinates their academics, training, competition, and college pathway as one continuous plan, not four separate conversations.',
          'That plan follows a student from their first term through college placement: academic planning and NCAA eligibility, competitive development and event scheduling, physical training and recovery, residential life, and — when the time comes — college athletic recruiting and admission support. One student. One plan. One team accountable for all of it.',
        ],
      },
      {
        type: 'numbered',
        heading: 'What we believe',
        items: [
          {
            title: 'Excellence without trade-offs',
            text: 'Competitive excellence should never come at the cost of academic ability, personal growth, or a student’s future options. We built JMC to make that trade-off unnecessary, not to manage it.',
          },
          {
            title: 'Athlete first, person always',
            text: 'Careers end. Character, discipline, and the ability to work with others do not.',
          },
          {
            title: 'Development is individual',
            text: 'Every student trains and studies on a plan built for their age, academic background, competitive level, and goals — not a fixed pace.',
          },
          {
            title: 'Honesty over hype',
            text: 'We do not promise admission to any specific school, university, or professional program. What we promise is a professional plan, continuous follow-up, and a student who arrives at that decision genuinely prepared.',
          },
          {
            title: 'Attention, not scale',
            text: 'Small cohorts and a named Student-Athlete Manager exist so that no student’s development depends on being remembered in a crowd.',
          },
        ],
      },
      {
        type: 'prose',
        heading: 'Our vision',
        paragraphs: [
          'To become the Academy families choose when a Grade 6–12 student-athlete is serious about both sides of their future: where the training, the coaching, the academics, and the college guidance all meet a standard that holds up next to any program in the country.',
        ],
      },
      visitCta,
    ],
  },

  'about/academy-overview': {
    intro:
      'A private, integrated student-development and athletic-management academy across two Southern California campuses, built for athletes who intend to play in college and beyond.',
    blocks: [
      {
        type: 'prose',
        heading: 'A private, integrated student-development and athletic-management academy',
        paragraphs: [
          'JMC Academy is not a school with a strong athletic program, and not a club team that happens to offer classes. We are the system that sits underneath both: academics, elite training, competition, physical development, residential life, and college athletic recruiting, coordinated as one continuous plan by one team, for grade 6–12 student-athletes.',
          'Athletes pursue a rigorous, college-preparatory course load — including Advanced Placement coursework where it fits — at value-aligned partner day schools, then move directly into JMC’s own training, tutoring, and development program every afternoon and evening. One student. One plan. One team accountable for all of it.',
        ],
      },
      {
        type: 'cta',
        heading: 'Our mission and vision',
        text: 'Why the academy exists, and what we believe about developing a scholar-athlete.',
        links: [{ label: 'Mission & Vision', to: '/about/mission-and-vision' }],
      },
      {
        type: 'stats',
        items: [
          { value: '5', label: 'Sports, boys and girls' },
          { value: '10', label: 'Season-long programs' },
          { value: '2', label: 'Southern California campuses' },
          { value: '5:1', label: 'Professionals per athlete' },
        ],
      },
      {
        type: 'numbered',
        heading: 'Academic rigor, by design',
        items: [
          {
            title: 'Partner day schools, not a watered-down curriculum',
            text: 'Students attend rigorous, value-aligned American private day schools for their formal academic education — real classrooms, real teachers, real transcripts — with course pacing planned against each student’s age, academic background, and long-term goals, including AP coursework where the school’s schedule and the student’s readiness support it.',
          },
          {
            title: 'Daily small-group coaching',
            text: 'Every student trains in small, personalized groups every single day — never lost in a crowd, never coasting.',
          },
          {
            title: 'Nightly private tutoring, every subject',
            text: 'Every evening, students receive private or small-group academic tutoring across every subject on their course load, tracked and adjusted as grades come in.',
          },
          {
            title: 'A private, full-time counselor',
            text: 'Each student has a dedicated academic counselor available throughout the week to guide course selection, monitor progress, and plan the path ahead — not a shared office visited once a term.',
          },
          {
            title: 'Small, bespoke cohorts',
            text: 'Class groups and training groups stay small and closely watched, by design, so no student’s time — or potential — goes to waste.',
          },
        ],
      },
      {
        type: 'prose',
        heading: 'A day in the life',
        paragraphs: [
          'Illustrated below through the day of a JMC ice hockey player — the same structure, adjusted by sport and training location, holds across every program.',
        ],
      },
      {
        type: 'table',
        heading: 'A typical student-athlete day',
        columns: ['Time', 'Block', 'Focus'],
        rows: [
          ['7:00 AM', 'Wake up', 'Morning routine'],
          ['7:30 AM', 'Breakfast', 'A nutritious buffet — fresh fruit, protein, and complex carbohydrates'],
          ['Morning', 'Academics', 'A full course load at the partner day school, including AP coursework'],
          ['2:30 PM', 'Dismissal', 'Bussed directly from school to the training facility'],
          ['2:30–4:00 PM', 'Club training', 'Club team practice, about 1.5 hours'],
          ['4:00–5:00 PM', 'JMC training', 'Private small-group session with JMC coaching staff, about 1 hour'],
          ['~6:00 PM', 'Return home', 'Back to residence'],
          ['6:00–7:00 PM', 'Dinner & wind-down', 'Shower, relaxation, and a home-cooked dinner'],
          ['7:00–9:00 PM', 'Tutoring', 'Private academic tutoring, about 2 hours'],
          ['9:00–10:30 PM', 'Free time', 'Unstructured personal time'],
          ['10:30 PM', 'Lights out', 'Protected sleep'],
        ],
        note: 'A sample day for an ice hockey player, not a fixed schedule. Timing shifts by sport, training location, student age, and the partner school’s calendar — and adequate rest is always preserved between training and academics.',
      },
      {
        type: 'prose',
        paragraphs: [
          'Dinner is home-cooked American cuisine, prepared by our chefs using fresh, locally sourced ingredients whenever possible — because a student’s development depends as much on recovery and nutrition as it does on repetitions.',
        ],
      },
      {
        type: 'prose',
        heading: 'Professional coaching & athlete counseling',
        paragraphs: [
          'Every head coach at JMC is directly involved in the prep-school and college recruiting process — not just training. Coaches travel regularly to accompany athletes to elite tryouts, handle communication with school and college coaches, and work alongside each student’s Student-Athlete Manager to keep training, competition, and the path ahead moving together, not treated as separate conversations.',
        ],
      },
      {
        type: 'features',
        items: [
          {
            title: 'Head coaches in recruiting',
            text: 'Involved in every athlete’s tryout, showcase, and recruiting calendar — not a separate office down the hall.',
          },
          {
            title: 'Coaches travel with athletes',
            text: 'Our staff accompanies students to elite tryouts and competitions in person, handling logistics and communication.',
          },
          {
            title: 'A dedicated Student-Athlete Manager',
            text: 'One coordinator, available all week, responsible for the whole picture — academics, training, competition, and family communication.',
          },
          {
            title: 'Extreme attention, by design',
            text: 'Small, bespoke cohorts mean nothing falls through the cracks and no time is wasted. We do not promise a specific school, university, or professional outcome — we promise a professional plan, continuous follow-up, and a student who is genuinely ready to compete for it.',
          },
        ],
      },
      {
        type: 'cta',
        heading: 'Value-aligned partner day schools',
        text: 'We partner with prestigious American private day schools that share our educational philosophy — immersing students in American culture, English, and a genuine, traditional school life, while preparing them seriously, academically and personally.',
        links: [{ label: 'Our Campuses', to: '/about/campuses' }],
      },
      {
        type: 'features',
        heading: 'What sets us apart',
        items: [
          {
            title: 'Structured training blocks',
            text: 'Training is planned in deliberate phases across the season, not left to chance.',
          },
          {
            title: 'Everyone lives here',
            text: 'A single residential community means training, meals, study, and recovery all happen on schedule.',
          },
          {
            title: 'Professional performance staff',
            text: 'Strength, conditioning, nutrition, and recovery specialists, not a traditional PE program.',
          },
          {
            title: 'Academics that fit training',
            text: 'Small classes and nightly tutoring scheduled around daily sessions, competition, and travel.',
          },
          {
            title: '5-to-1 recruiting',
            text: 'Five professionals guide each athlete from first highlight film to signing day.',
          },
          {
            title: 'Small by design',
            text: 'Enrollment is capped so every athlete is known by the staff responsible for their development.',
          },
        ],
      },
      {
        type: 'prose',
        heading: 'Leadership',
        paragraphs: [
          'The academy is led by a small team with clear ownership. Each leader below is responsible for one part of the athlete’s day, and together they review every athlete’s progress across training, school, health, and recruiting.',
        ],
      },
      {
        type: 'features',
        items: [
          { title: 'Head of Academy', text: 'Jonathan Reyes. Overall leadership, culture, and standards.' },
          { title: 'Director of Student Life', text: 'To be announced. Residential life, daily routine, and student wellbeing.' },
          { title: 'Director of Athletics', text: 'To be announced. Coaching staffs, competition, and program standards.' },
          { title: 'Head Coach, Ice Hockey', text: 'To be announced. Program standards, recruiting, and athlete development for boys’ and girls’ ice hockey.' },
          { title: 'Head Coach, Golf', text: 'To be announced. Program standards, recruiting, and athlete development for boys’ and girls’ golf.' },
          { title: 'Head Coach, Tennis', text: 'To be announced. Program standards, recruiting, and athlete development for boys’ and girls’ tennis.' },
          { title: 'Head Coach, Fencing', text: 'To be announced. Program standards, recruiting, and athlete development for boys’ and girls’ fencing.' },
          { title: 'Head Coach, Lacrosse', text: 'To be announced. Program standards, recruiting, and athlete development for boys’ and girls’ lacrosse.' },
          { title: 'Director of Admissions', text: 'To be announced. Applications, athletic evaluation, and enrollment.' },
          { title: 'Director of Finance & Operations', text: 'To be announced. Tuition, facilities, and day-to-day operations.' },
        ],
      },
      visitCta,
    ],
  },

  'about/campuses': {
    intro: 'Two Southern California campuses — Irvine and San Diego — each with its own college-preparatory academic program.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'JMC trains on two campuses, chosen for their venues and their climate. Athletes live, train, and recover on campus; classes are taken at our value-aligned partner day schools, so students earn a rigorous college-preparatory diploma while training at a professional standard.',
          'Both campuses share the same daily structure, the same performance staff standards, and the same 5-to-1 counseling model. Which campus an athlete joins depends mainly on their sport.',
        ],
      },
      {
        type: 'features',
        heading: 'Irvine Campus — Orange County',
        items: [
          { title: 'Academic program', text: 'A rigorous, college-preparatory course load at Capistrano Valley Christian School.' },
          { title: 'Primary sports', text: 'Ice hockey, lacrosse, tennis, and fencing.' },
          { title: 'Training venues', text: 'Home rink, full-size turf field, and hard courts.' },
          { title: 'Performance center', text: 'Strength, conditioning, and testing space for daily use.' },
          { title: 'Residence', text: 'Two athletes per room, with residential staff on every floor.' },
          { title: 'Location', text: 'Minutes from the Orange County coast, close to John Wayne Airport.' },
        ],
      },
      {
        type: 'features',
        heading: 'San Diego Campus',
        items: [
          { title: 'Academic program', text: 'A rigorous, college-preparatory course load at Maranatha Christian School.' },
          { title: 'Primary sports', text: 'Golf, tennis, and lacrosse.' },
          { title: 'Training venues', text: 'Championship coastal course access, hard courts, and turf field.' },
          { title: 'Performance center', text: 'Strength, conditioning, and recovery alongside sports medicine.' },
          { title: 'Residence', text: 'Two athletes per room, with residential staff on every floor.' },
          { title: 'Location', text: 'Coastal San Diego, close to San Diego International Airport.' },
        ],
      },
      {
        type: 'image',
        src: '/images/academic-seminar.jpg',
        alt: 'A teacher and students working closely in a seminar-style classroom',
        caption: 'Academics on both campuses — a rigorous, college-preparatory course load at our partner day schools',
      },
      {
        type: 'gallery',
        heading: 'Where we train',
        items: [
          {
            src: '/images/hockey-sticks.jpg',
            alt: 'Sticks resting against the boards at the rink',
            caption: 'Irvine — the home rink',
          },
          {
            src: '/images/golf-course-aerial.jpg',
            alt: 'Aerial view of a coastal golf course along the Pacific',
            caption: 'San Diego — championship coastal golf',
          },
        ],
      },
      {
        type: 'stats',
        items: [
          { value: '2', label: 'Campuses' },
          { value: '1', label: 'Academic program across both campuses' },
          { value: '5', label: 'Sports across both campuses' },
        ],
      },
      visitCta,
    ],
  },

  'academic/ncaa-eligibility': {
    intro:
      'Eligibility is tracked from the first term, not discovered in the final year.',
    blocks: [
      {
        type: 'prose',
        heading: 'Why this page exists',
        paragraphs: [
          'Talented athletes lose college opportunities every year over paperwork and course selection, not ability. A missing core course, a class that was never approved, or a late registration can end a recruitment that took years to build.',
          'At JMC, eligibility is somebody’s job. Every athlete’s course plan, grades, and registration status are reviewed each term by their academic advisor together with the recruiting team, and families see the same record.',
        ],
      },
      {
        type: 'numbered',
        heading: 'How we track it',
        items: [
          {
            title: 'Core-course planning from day one',
            text: 'Course selection is built against NCAA core-course rules from an athlete’s first term, not their last.',
          },
          {
            title: 'Approved courses only',
            text: 'We confirm every course we teach appears on the NCAA-approved course list.',
          },
          {
            title: 'Termly eligibility review',
            text: 'Grades, credits, and progress are reviewed every term against both graduation and eligibility requirements.',
          },
          {
            title: 'Eligibility Center registration',
            text: 'We guide families through registration and make sure transcripts and test scores are sent on time.',
          },
          {
            title: 'Amateurism and recruiting rules',
            text: 'Athletes and parents are briefed on contact rules, official visits, and what affects amateurism status.',
          },
          {
            title: 'One shared record',
            text: 'Advisor, coach, recruiter, and family all work from the same up-to-date eligibility record.',
          },
        ],
      },
      {
        type: 'faq',
        heading: 'Common questions',
        items: [
          {
            q: 'Who sets the eligibility requirements?',
            a: 'The NCAA does, and the requirements differ by division and change over time. We track the current rules for each athlete’s target division rather than working from a fixed checklist.',
          },
          {
            q: 'Does JMC guarantee eligibility?',
            a: 'No school can. Eligibility depends on an athlete’s own grades, courses, and amateurism status. What we guarantee is that nobody reaches their final year without knowing exactly where they stand.',
          },
          {
            q: 'What about NAIA or junior college?',
            a: 'Those have their own requirements, and we plan against whichever pathway fits the athlete.',
          },
          {
            q: 'When should we start paying attention?',
            a: 'Grade 9. Core-course GPA counts from the first high-school term, and it cannot be repaired later.',
          },
        ],
      },
      {
        type: 'cta',
        heading: 'Eligibility and recruiting run together',
        links: [
          { label: 'College Recruiting', to: '/counseling/college-recruiting' },
          { label: 'Academic Support', to: '/academic/academic-support' },
        ],
      },
    ],
  },

  'student-life/competition-travel': {
    intro: 'Athletes compete across the country and abroad, without losing the school term.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Serious competition means travel. Our teams and individual athletes travel to tournaments, showcases, and league fixtures throughout the year, and every trip is planned so that school, training, and recovery survive it.',
          'Staff travel with athletes. Coursework is assigned before departure and collected on return, meals and sleep are planned around competition times, and families receive the itinerary and updates from the road.',
        ],
      },
      {
        type: 'numbered',
        heading: 'How travel works',
        items: [
          {
            title: 'Planned around the academic calendar',
            text: 'The competition calendar is set alongside the school calendar, so travel avoids assessment weeks wherever possible.',
          },
          {
            title: 'Staff on every trip',
            text: 'Athletes travel with coaching staff, and with performance or medical staff on longer trips.',
          },
          {
            title: 'Work before you go',
            text: 'Assignments are issued before departure and collected on return, with tutoring available on the road.',
          },
          {
            title: 'Fuelling and recovery on the road',
            text: 'Meal timing, hydration, and sleep are planned for travel days, not left to chance.',
          },
          {
            title: 'Families kept informed',
            text: 'Itineraries, results, and arrival times are shared with parents through the portal.',
          },
          {
            title: 'College exposure built in',
            text: 'Campus visits and coach meetings are scheduled alongside competition travel wherever the calendar allows.',
          },
        ],
      },
      {
        type: 'cta',
        heading: 'See how exposure is planned',
        links: [
          { label: 'College Recruiting', to: '/counseling/college-recruiting' },
          { label: 'Academic Support', to: '/academic/academic-support' },
        ],
      },
    ],
  },

  'counseling/college-planning': {
    intro: 'A plan that starts in the first year and ends with the right offer.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'College planning at JMC is not a senior-year conversation. From an athlete’s first term, the counseling team builds a plan that lines up courses, grades, testing, competition exposure, and coach contact against a realistic set of target programs.',
          'The plan is reviewed every term and adjusted as the athlete develops. Families see the same plan the staff see, so nobody is guessing about where things stand.',
        ],
      },
      {
        type: 'numbered',
        heading: 'What the plan covers',
        items: [
          {
            title: 'Academic planning',
            text: 'Course selection, GPA targets, and testing timed so they support the recruiting calendar.',
          },
          {
            title: 'Athletic exposure',
            text: 'Which tournaments, showcases, and events actually matter for the athlete’s level and position.',
          },
          {
            title: 'Target college list',
            text: 'An honest list across reach, match, and likely programs, built on athletic and academic fit.',
          },
          {
            title: 'Coach communication',
            text: 'Who reaches out, when, and with what — film, results, transcript, and academic record.',
          },
          {
            title: 'Applications and essays',
            text: 'Application strategy, essays, and deadlines handled alongside the athletic side.',
          },
          {
            title: 'Offers and the decision',
            text: 'Comparing offers on playing time, academics, cost, and fit, then supporting the transition.',
          },
        ],
      },
      {
        type: 'cta',
        heading: 'How the team works',
        links: [
          { label: 'The 5-to-1 Model', to: '/counseling/5-to-1-model' },
          { label: 'College Recruiting', to: '/counseling/college-recruiting' },
        ],
      },
    ],
  },

  'parent-support/parent-resources': {
    intro: 'Everything a JMC family needs, in one place.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Sending an athlete to train away from home is a big decision, and it does not end at enrolment. JMC keeps families close to the daily reality of their athlete’s training, schooling, health, and recruiting.',
          'Parents have a named family advisor as part of the 5-to-1 team, scheduled check-ins through the year, and a portal showing the same record the staff work from.',
        ],
      },
      {
        type: 'features',
        heading: 'Family support',
        items: [
          { title: 'Family advisor', text: 'A named member of your athlete’s 5-to-1 team, dedicated to parent communication.' },
          { title: 'Scheduled check-ins', text: 'Regular conversations covering academics, training, health, and recruiting together.' },
          { title: 'Progress reports', text: 'Termly academic reports alongside training and performance updates.' },
          { title: 'Recruiting updates', text: 'Where your athlete stands with college coaches, in plain language.' },
          { title: 'Travel notifications', text: 'Itineraries, departures, and arrivals for every competition trip.' },
          { title: 'Time-zone aware contact', text: 'Communication scheduled to work for international families.' },
        ],
      },
      {
        type: 'cta',
        heading: 'Family tools',
        links: [
          { label: 'Parent Portal', to: '/parent-support/parent-portal' },
          { label: 'Academy Calendar', to: '/parent-support/academy-calendar' },
        ],
      },
    ],
  },

  'parent-support/parent-portal': {
    intro: 'One login for academics, training, health, travel, and recruiting.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'The parent portal brings every part of an athlete’s life at JMC into a single view, so families are never chasing four different people for an answer.',
        ],
      },
      {
        type: 'features',
        heading: 'In the portal',
        items: [
          { title: 'Class schedule & grades', text: 'Current courses, assignments, and termly reports.' },
          { title: 'Training schedule', text: 'Daily sessions, strength work, and recovery blocks.' },
          { title: 'Competition calendar', text: 'Fixtures, tournaments, and travel itineraries.' },
          { title: 'Attendance', text: 'Class, training, and study hall attendance.' },
          { title: 'Health & medical', text: 'Injury status, treatment plans, and clearance to train.' },
          { title: 'Recruiting progress', text: 'Target list, coach contact, and next steps.' },
          { title: 'Billing & forms', text: 'Invoices, payment schedule, and outstanding paperwork.' },
          { title: 'Messages', text: 'Direct contact with the family advisor and coaching staff.' },
        ],
      },
      {
        type: 'cta',
        heading: 'Not yet enrolled?',
        text: 'Portal access is issued at enrolment. Admission can walk you through what families see.',
        links: [{ label: 'Contact Admission', to: '/contact' }],
      },
    ],
  },

  'parent-support/academy-calendar': {
    intro: 'Terms, training blocks, competition windows, and family events.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'JMC runs a twelve-month calendar. Academic terms, training blocks, competition windows, and breaks are published together so families can plan travel well in advance.',
        ],
      },
      {
        type: 'table',
        heading: 'Academy year at a glance',
        columns: ['Period', 'Academics', 'Training & competition'],
        rows: [
          ['Late summer', 'Orientation and placement testing', 'Build block: highest training volume'],
          ['Autumn term', 'Term one classes', 'Sharpen block, early-season competition'],
          ['Winter', 'Term two classes', 'Peak competition for ice hockey and indoor tennis'],
          ['Spring term', 'Term three classes', 'Peak competition for golf, lacrosse, and tennis'],
          ['Early summer', 'Term reports and course planning', 'Showcases, college visits, and camps'],
          ['Mid summer', 'Break and optional coursework', 'Restore block and individual programs'],
        ],
        note: 'Structure of the academy year. Exact dates for the coming year are published to families in the portal.',
      },
      {
        type: 'cta',
        heading: 'Planning a visit?',
        links: [
          { label: 'Schedule a Visit', to: '/admission/visit' },
          { label: 'Parent Portal', to: '/parent-support/parent-portal' },
        ],
      },
    ],
  },

  'parent-support/forms-and-health': {
    intro: 'The paperwork that has to be complete before an athlete can train.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Athletes cannot take the ice, the course, the court, or the field until their medical and consent paperwork is complete. We tell families exactly what is needed and when, and track it in the portal so nothing is discovered late.',
        ],
      },
      {
        type: 'features',
        heading: 'Before arrival',
        items: [
          { title: 'Physical examination', text: 'A sports physical dated within the window required for the training year.' },
          { title: 'Medical history', text: 'Injury history, conditions, and prior surgeries for the medical team.' },
          { title: 'Immunisation records', text: 'Records as required by state and school health rules.' },
          { title: 'Consent to treat', text: 'Authorisation for treatment and emergency care.' },
          { title: 'Insurance details', text: 'Coverage information, including international policies.' },
          { title: 'Emergency contacts', text: 'Parents, guardians, and a local contact where applicable.' },
        ],
      },
      {
        type: 'features',
        heading: 'During the year',
        items: [
          { title: 'Concussion protocol', text: 'Baseline testing and a staged return-to-play process.' },
          { title: 'Injury reporting', text: 'Injuries logged and visible to families in the portal.' },
          { title: 'Travel consent', text: 'Permissions for competition travel, renewed each year.' },
          { title: 'Medication records', text: 'Prescriptions held and administered by residential staff.' },
        ],
      },
      {
        type: 'cta',
        heading: 'Questions about health cover?',
        links: [
          { label: 'Recovery & Medical', to: '/student-life/recovery-and-medical' },
          { label: 'Contact Admission', to: '/contact' },
        ],
      },
    ],
  },

  // ATHLETICS
  'athletic/coaching-staff': {
    intro: 'Every program is led by a full staff, not a single coach.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'A head coach sets the standard for each program, but development is shared across specialists: position and skills coaches, a goalie or short-game coach, video staff, and the performance team. That structure means athletes get expert attention on the specific parts of their game that decide the next level.',
          'Coaches are hired for playing and coaching experience at the level our athletes are aiming for, and each one carries a small enough group to know every athlete’s plan in detail.',
        ],
      },
      {
        type: 'features',
        heading: 'Roles across our programs',
        items: [
          { title: 'Head Coach', text: 'Program standards, competition plan, and athlete development.' },
          { title: 'Assistant Coaches', text: 'Daily sessions, position groups, and individual work.' },
          { title: 'Skills Specialists', text: 'Skating, short game, stick skills, and position technique.' },
          { title: 'Goalie & Position Coaches', text: 'Dedicated coaching for the most specialized roles.' },
          { title: 'Video Staff', text: 'Film capture, breakdown, and recruiting reels.' },
          { title: 'Performance Coaches', text: 'Strength, conditioning, and recovery built into every program.' },
        ],
      },
      {
        type: 'cta',
        heading: 'Explore the programs',
        links: [
          { label: 'Athletics', to: '/athletic' },
          { label: 'Performance', to: '/athletic' },
        ],
      },
    ],
  },

  'athletic/facilities': {
    intro: 'Training venues, performance space, and recovery in one place.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Athletes train where they live. Daily sessions, strength work, treatment, and video review happen within the same routine, which removes the travel time that usually limits how much quality training a young athlete can absorb.',
        ],
      },
      {
        type: 'features',
        heading: 'Where our athletes train',
        items: [
          { title: 'Ice rink', text: 'Refrigerated ice for practices, skills sessions, and games.' },
          { title: 'Golf practice & course access', text: 'Range, short-game areas, and regular on-course play.' },
          { title: 'Turf field', text: 'Full-size field for lacrosse training and competition.' },
          { title: 'Performance center', text: 'Strength equipment, testing, and speed and agility space.' },
          { title: 'Sports medicine & recovery', text: 'Treatment tables, rehabilitation space, and recovery tools.' },
          { title: 'Video rooms', text: 'Film review for teams and individual athletes.' },
        ],
      },
    ],
  },

  // PERFORMANCE
  'athletic/training-model': {
    intro: 'Training is planned in deliberate phases across the season.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Most young athletes train hard in season and lose ground out of it. Our calendar is built the way professional programs build theirs: distinct blocks with different goals, so athletes arrive at competition sharp and finish the year healthier than they started.',
          'Every athlete has an Athlete Performance Profile that records their physical testing, training history, injury history, position demands, and goals. The profile decides the plan, and the plan is adjusted as the athlete develops.',
        ],
      },
      {
        type: 'numbered',
        heading: 'The training year',
        items: [
          {
            title: 'Build',
            text: 'Highest training volume of the year: strength, engine, and technical foundations while competition is lightest.',
          },
          {
            title: 'Sharpen',
            text: 'Volume drops and intensity rises. Sport-specific speed, power, and game situations take over.',
          },
          {
            title: 'Compete',
            text: 'Training maintains what was built. Sessions are timed around competition, travel, and recovery.',
          },
          {
            title: 'Restore',
            text: 'Planned lighter weeks for tissue recovery, mobility, rehabilitation, and mental reset.',
          },
        ],
      },
      {
        type: 'table',
        heading: 'A typical training day',
        columns: ['Time', 'Block', 'Focus'],
        rows: [
          ['Early morning', 'Strength or mobility', 'Performance center session before classes'],
          ['Mid-day', 'Academics', 'Classes, tutoring, and academic support'],
          ['Afternoon', 'Sport session', 'On-ice, on-course, or on-field training'],
          ['Late afternoon', 'Recovery', 'Treatment, mobility, and nutrition'],
          ['Evening', 'Study hall & film', 'Supervised study, then video review'],
        ],
        note: 'Sample day. Exact times vary by program and competition schedule.',
      },
      {
        type: 'cta',
        heading: 'Go deeper',
        links: [
          { label: 'Strength & Conditioning', to: '/athletic/strength-and-conditioning' },
          { label: 'Nutrition & Recovery', to: '/student-life/recovery-and-medical' },
        ],
      },
    ],
  },

  'athletic/strength-and-conditioning': {
    intro: 'A professional performance team behind every athlete.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Strength and conditioning here is not a weight-room period on a schedule. Athletes are tested, given an individual plan, coached through it, and re-tested, with everything recorded in their Athlete Performance Profile.',
          'Plans account for age and physical maturity first. A thirteen-year-old and a post-graduate athlete do not train the same way, and neither trains like an adult professional.',
        ],
      },
      {
        type: 'numbered',
        heading: 'What we work on',
        items: [
          { title: 'Strength & power', text: 'Foundational strength, then the explosive qualities each sport demands.' },
          { title: 'Speed & conditioning', text: 'Acceleration, change of direction, and the energy systems of the sport.' },
          { title: 'Mobility & movement', text: 'Range of motion and movement quality that protect against injury.' },
          { title: 'Injury prevention', text: 'Screening and targeted work on the injuries most common to each sport and position.' },
          { title: 'Performance testing', text: 'Regular testing so progress is measured, not assumed.' },
          { title: 'Return to play', text: 'Structured rehabilitation with sports medicine before full training resumes.' },
        ],
      },
      {
        type: 'features',
        heading: 'The team',
        items: [
          { title: 'Strength Coach', text: 'To be announced.' },
          { title: 'Conditioning Coach', text: 'To be announced.' },
          { title: 'Sports Performance Coach', text: 'To be announced.' },
          { title: 'Athletic Trainer', text: 'To be announced.' },
        ],
      },
    ],
  },

  'student-life/recovery-and-medical': {
    intro: 'Recovery is scheduled, and medical care is coordinated with the people who train the athlete.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Training only counts if the body absorbs it. Recovery at JMC is a scheduled block in the day rather than something athletes fit in if there is time, and it is managed by staff who see the athlete’s full training load.',
          'When an athlete is hurt, one team handles it. Sports medicine, coaches, the performance staff, and the family advisor work from a single plan, so nobody is cleared to play by one person while another is still treating them.',
        ],
      },
      {
        type: 'numbered',
        heading: 'Daily recovery',
        items: [
          { title: 'Mobility & soft tissue', text: 'Daily mobility work and treatment for tight or overloaded areas.' },
          { title: 'Protected sleep', text: 'Consistent lights-out hours in residence, treated as part of training.' },
          { title: 'Load monitoring', text: 'Training load tracked so fatigue is managed before it becomes injury.' },
          { title: 'Recovery nutrition', text: 'Post-training and evening fuelling planned with the dining programme.' },
          { title: 'Planned lighter weeks', text: 'Restore blocks built into the training year, not improvised after a breakdown.' },
          { title: 'Screening', text: 'Movement screening to catch the patterns that turn into injuries.' },
        ],
      },
      {
        type: 'numbered',
        heading: 'Medical coordination',
        items: [
          { title: 'On-site sports medicine', text: 'Treatment and rehabilitation space alongside the performance centre.' },
          { title: 'One injury plan', text: 'Medical staff, coaches, and performance staff work from the same record.' },
          { title: 'Staged return to play', text: 'Clear criteria for each stage back to full training and competition.' },
          { title: 'Concussion protocol', text: 'Baseline testing and a staged, documented return process.' },
          { title: 'Specialist referral', text: 'Coordination with physicians and specialists when an injury needs more.' },
          { title: 'Families informed', text: 'Injury status, treatment, and clearance visible to parents in the portal.' },
        ],
      },
      {
        type: 'cta',
        heading: 'Related',
        links: [
          { label: 'Dining & Nutrition', to: '/student-life/dining-and-nutrition' },
          { label: 'Forms & Health', to: '/parent-support/forms-and-health' },
        ],
      },
    ],
  },

  // ACADEMICS
  'academic/upper-school': {
    intro: 'Grades 9–12: a college-preparatory program with honors, advanced, and AP coursework, scheduled around training.',
    blocks: [
      {
        type: 'split',
        heading: 'Rigor with a reason',
        image: { src: '/images/upper-school-classroom.jpg', alt: 'Upper School classroom' },
        paragraphs: [
          'By the time an athlete reaches Grade 9 at JMC, the habits are in place and the standard rises again. Upper School classes run like small seminars, not lectures: students are expected to arrive prepared, argue a position, and defend it in writing.',
          'We would rather graduate an athlete who thinks clearly under pressure than one who simply accumulated credits. Course selection is planned with NCAA eligibility requirements in view from the first term, so no athlete arrives at their final year to discover a missing requirement.',
        ],
      },
      {
        type: 'prose',
        heading: 'Flexible in schedule. Rigorous in standard.',
        paragraphs: [
          'Training moves. The standard does not. Class times, study hall, and tutoring flex around sessions, competition, and travel, but the work itself is held to a level that would be demanding at any strong school in the country.',
          'We are unapologetic about the scholar half of scholar-athlete. The discipline that gets an athlete to a 6 a.m. session is the same discipline that produces careful writing, finished problem sets, and serious test preparation — and we expect our athletes to outwork and outperform the expectations people usually attach to student-athletes.',
        ],
      },
      {
        type: 'split',
        heading: 'Every athlete, known by name',
        reverse: true,
        image: { src: '/images/upper-school-classroom.jpg', alt: 'Upper School classroom' },
        paragraphs: [
          'A full course load stays manageable because no class is large enough to hide in. Teachers know which students are traveling for a tournament next Thursday, which ones are chasing an advanced science requirement, and which ones need a different kind of push entirely.',
        ],
      },
      {
        type: 'logos',
        heading: 'Prepared for the work that counts',
        text: 'Coursework and preparation aligned to the programs and exams that schools and college admission offices actually look at.',
        items: [
          { label: 'Art of Problem Solving', src: '/images/logos/aops.png', alt: 'Art of Problem Solving' },
          { label: 'SSAT' },
          { label: 'ISEE', src: '/images/logos/isee.jpg', alt: 'ISEE' },
          { label: 'SAT', src: '/images/logos/sat.png', alt: 'SAT' },
          { label: 'AP', src: '/images/logos/ap.png', alt: 'AP' },
          { label: 'College Board', src: '/images/logos/college-board.png', alt: 'College Board' },
        ],
      },
      {
        type: 'features',
        heading: 'Subjects',
        items: [
          { title: 'English', text: 'Reading, analytical writing, and discussion in every year.' },
          { title: 'Mathematics', text: 'Sequenced from algebra through advanced coursework.' },
          { title: 'Science', text: 'Laboratory science, including options connected to human performance.' },
          { title: 'History & Social Science', text: 'Writing-intensive courses in history and civics.' },
          { title: 'World Languages', text: 'Language study that meets college admission expectations.' },
          { title: 'Electives', text: 'Focused options, including sport science and media.' },
        ],
      },
      {
        type: 'numbered',
        heading: 'Honors, AP, and advanced study',
        items: [
          {
            title: 'Honors by demonstration',
            text: 'Placement into honors sections is earned through work in the previous course, not requested. Students move up mid-year when they are ready.',
          },
          {
            title: 'AP where it counts',
            text: 'Advanced Placement courses are offered in the subjects that carry weight in college admission, and are scheduled so competition travel does not derail exam preparation.',
          },
          {
            title: 'Advanced study after AP',
            text: 'Seniors who exhaust a sequence continue with advanced study courses — data science, software engineering, research methods, advanced portfolio — rather than repeating.',
          },
          {
            title: 'Writing in every year',
            text: 'Every Upper School year includes sustained analytical writing, because it is the skill colleges notice first and athletes practise least.',
          },
        ],
      },
      {
        type: 'table',
        heading: 'Graduation requirements',
        columns: ['Subject', 'Required'],
        rows: [
          ['English', '4 years'],
          ['Mathematics', '4 years, through Precalculus'],
          ['Science', '3 years, including two laboratory sciences'],
          ['History & Social Science', '3 years'],
          ['World Language', '3 years in the same language'],
          ['Visual & Performing Arts', '1 year'],
          ['Computer Science', '1 year'],
          ['Health & Human Development', '1 semester'],
          ['Athletics & program training', 'Every term'],
          ['College Seminar', 'Grades 11 and 12'],
        ],
        note: 'Designed to meet NCAA Eligibility Center core-course requirements. Each athlete’s plan is reviewed every term against both graduation and eligibility rules.',
      },
      {
        type: 'cta',
        heading: 'Support when it is needed',
        links: [
          { label: 'Academic Support', to: '/academic/academic-support' },
          { label: 'Academic Progression', to: '/academic/academic-progression' },
        ],
      },
    ],
  },

  'academic/middle-school': {
    intro:
      'Grades 6–8: building the habits, skills, and foundation that make demanding Upper School work possible.',
    blocks: [
      {
        type: 'split',
        heading: 'Where the habits are built',
        image: { src: '/images/middle-school-classroom.jpg', alt: 'Middle School students working in class' },
        paragraphs: [
          'Twelve and thirteen-year-olds are not small versions of eighteen-year-olds. They need more structure, not less — clear routines, direct instruction in how to study, and adults who notice quickly when something is off.',
          'Middle School athletes are training seriously for the first time, often while living away from home for the first time. Those years decide whether an athlete arrives in the Upper School able to carry a heavy course load, or spends four years catching up.',
        ],
      },
      {
        type: 'numbered',
        heading: 'How Middle School works',
        items: [
          {
            title: 'Five core courses',
            text: 'English, mathematics, science, history, and a world language form the spine of every grade.',
          },
          {
            title: 'Placement, not lockstep',
            text: 'Mathematics and world language placement is by assessment, so a strong Grade 6 student can begin Algebra 1A early and a student who needs ground work gets it.',
          },
          {
            title: 'Study skills taught, not assumed',
            text: 'Planning, note-taking, revision, and test preparation are explicit parts of the Grade 6 and 7 program.',
          },
          {
            title: 'An advisor who knows the whole athlete',
            text: 'Every student has an advisor tracking academics, training load, and life in residence together.',
          },
          {
            title: 'Enrichment and electives',
            text: 'Art, technology, music, and service rotate through the year alongside the core.',
          },
          {
            title: 'Training in the schedule',
            text: 'Program training is part of the school day, not an after-school add-on squeezed around homework.',
          },
        ],
      },
      {
        type: 'features',
        heading: 'Grade by grade',
        items: [
          {
            title: 'Grade 6',
            text: 'Reading 6, Writing 6, Pre-Algebra (or accelerated by placement), Earth & Environmental Science, World History, plus Art & Design, Technology, Health & Wellness, and a music rotation.',
          },
          {
            title: 'Grade 7',
            text: 'English 7, Algebra 1A (or accelerated by placement), Life Science, World History, and a world language — Spanish or Chinese — plus semester electives and service learning.',
          },
          {
            title: 'Grade 8',
            text: 'English 8, Algebra 1B (or accelerated by placement), Physical Science, United States History, and a continuing world language, plus semester electives and yearbook.',
          },
        ],
      },
      {
        type: 'logos',
        heading: 'Beyond the classroom',
        text: 'Middle School students prepare for secondary-school testing and stretch themselves in outside programs, with coaching from our faculty.',
        items: [
          { label: 'Art of Problem Solving', src: '/images/logos/aops.png', alt: 'Art of Problem Solving' },
          { label: 'SSAT' },
          { label: 'ISEE', src: '/images/logos/isee.jpg', alt: 'ISEE' },
        ],
      },
      {
        type: 'split',
        heading: 'Living and learning together',
        reverse: true,
        image: { src: '/images/middle-school-classroom.jpg', alt: 'Middle School students working in class' },
        paragraphs: [
          'Academics do not stop at the classroom door. Evening study hall runs in residence, supervised by the same staff who oversee training and daily life, so a Middle School student is never more than a few steps from someone who can help with a hard problem set.',
        ],
      },
      {
        type: 'cta',
        heading: 'See the full progression',
        text: 'Every course from Grade 6 through Grade 12, department by department.',
        links: [
          { label: 'Academic Progression', to: '/academic/academic-progression' },
          { label: 'Upper School', to: '/academic/upper-school' },
        ],
      },
    ],
  },

  'academic/academic-progression': {
    intro:
      'Every department, Grade 6 through Grade 12, and the routes students take through them.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'The matrix below shows the planned course progression across the Middle School and Upper School. Most students follow the central path; placement assessments, prior coursework, and individual interests move athletes ahead or sideways within it.',
          'Mathematics and world languages are placed by assessment rather than by age, so it is normal for a single grade to be spread across three different courses.',
        ],
      },
      {
        type: 'matrix',
        heading: 'Grades 6–12 academic progression',
        columns: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
        rows: [
          {
            label: 'English',
            cells: [
              ['Reading 6', 'Writing 6'],
              ['English 7', 'Creative Writing 7'],
              ['English 8', 'Creative Writing 8'],
              ['English I'],
              ['English II / Honors'],
              ['English III / Honors', 'AP English Language & Composition'],
              ['Senior Seminars in Literature & Writing', 'AP English Literature & Composition'],
            ],
          },
          {
            label: 'Mathematics',
            cells: [
              ['Pre-Algebra', 'Algebra 1A (by placement)'],
              ['Algebra 1A', 'Algebra 1B (by placement)'],
              ['Algebra 1B', 'Algebra I', 'Geometry / Honors (by placement)'],
              ['Algebra I', 'Geometry / Honors', 'Algebra II / Honors'],
              ['Geometry / Honors', 'Algebra II / Honors', 'Precalculus'],
              ['Precalculus / Honors', 'Calculus I', 'AP Calculus AB', 'AP Statistics'],
              ['AP Calculus AB', 'AP Calculus BC', 'AP Statistics', 'Introduction to Data Science'],
            ],
          },
          {
            label: 'Science',
            cells: [
              ['Earth & Environmental Science'],
              ['Life Science'],
              ['Physical Science'],
              ['Conceptual Physics', 'Physics'],
              ['Biology', 'Chemistry / Honors'],
              ['Chemistry / Honors', 'Physiology', 'AP Biology'],
              ['AP Biology', 'AP Chemistry', 'AP Physics 1', 'Sports Science & Human Performance'],
            ],
          },
          {
            label: 'History & Social Science',
            cells: [
              ['World History (8000 BCE–600 CE)'],
              ['World History (600–1450)'],
              ['United States History 8'],
              ['World History & Geography (1450–1914)'],
              ['U.S. History', 'AP U.S. History'],
              ['American Government', 'Economics', 'AP World History'],
              ['AP U.S. Government & Politics', 'AP Macroeconomics', 'AP Psychology', 'Historical Research Methods'],
            ],
          },
          {
            label: 'World Languages',
            cells: [
              ['Spanish 1A', 'Chinese 1A'],
              ['Spanish 1B', 'Chinese 1B'],
              ['Spanish I', 'Chinese I'],
              ['Spanish I / II', 'Chinese I / II'],
              ['Spanish II / III', 'Chinese II / III'],
              ['Spanish III Honors / IV', 'Chinese III / IV', 'AP Spanish Language & Culture'],
              ['AP Spanish Language & Culture', 'AP Chinese Language & Culture', 'Advanced Conversation & Culture'],
            ],
          },
          {
            label: 'Computer Science',
            cells: [
              ['Technology & Design 6'],
              ['Creative Coding 7'],
              ['Emerging Technologies 8'],
              ['Introduction to Programming'],
              ['Web Design & Development', 'AI in a Digital World'],
              ['AP Computer Science Principles', 'AP Computer Science A'],
              ['AP Computer Science A', 'Introduction to Software Engineering'],
            ],
          },
          {
            label: 'Visual & Performing Arts',
            cells: [
              ['Art & Design 6', 'Music 6'],
              ['Studio Art 7', 'Digital Media 7'],
              ['Studio Art 8', 'Film & Photography 8'],
              ['Studio Art', 'Photography'],
              ['Studio Art: Intermediate', 'Photography: Intermediate', 'Film Production'],
              ['Studio Art: Advanced', 'AP Art History'],
              ['AP 2-D Art & Design', 'AP Drawing', 'Advanced Portfolio'],
            ],
          },
          {
            label: 'Athletics & Performance',
            cells: [
              ['Health & Wellness 6', 'Program training'],
              ['Personal Fitness & Wellness', 'Program training'],
              ['Personal Fitness & Wellness', 'Program training'],
              ['Health & Human Development', 'Program training'],
              ['Strength & Conditioning', 'Program training'],
              ['Sports Medicine', 'Program training'],
              ['Sports Medicine', 'Program training'],
            ],
          },
          {
            label: 'Other Electives',
            cells: [
              ['Study Skills 6'],
              ['Service Learning 7'],
              ['Service Learning 8', 'Yearbook 8'],
              ['Leadership'],
              ['Leadership'],
              ['Leadership', 'College Seminar'],
              ['Leadership', 'College Seminar'],
            ],
          },
        ],
        note: 'Planned progression. Offerings each year depend on enrollment and staffing, and individual schedules vary with placement and prior coursework.',
      },
      {
        type: 'cta',
        heading: 'Questions about placement?',
        text: 'Admission can walk through where an athlete would land in each subject.',
        links: [
          { label: 'Contact Admission', to: '/contact' },
          { label: 'Academic Support', to: '/academic/academic-support' },
        ],
      },
    ],
  },

  'academic/academic-support': {
    intro: 'Structure, tutoring, and tracking so training never costs an athlete their eligibility.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Travel and heavy training make it easy to fall behind. Our support system is built to catch that early: supervised study, tutoring on demand, and coordination between teachers and coaches whenever an athlete is away.',
        ],
      },
      {
        type: 'numbered',
        heading: 'How support works',
        items: [
          { title: 'Supervised study hall', text: 'Protected evening study hours in residence, every school night.' },
          { title: 'Tutoring', text: 'Subject tutoring scheduled around training, not instead of it.' },
          { title: 'Travel plans', text: 'Work assigned before departure and collected on return for every competition trip.' },
          { title: 'Progress checks', text: 'Regular reports shared with athletes, families, and coaches.' },
          { title: 'Eligibility tracking', text: 'Courses, grades, and NCAA requirements reviewed every term.' },
          { title: 'Testing support', text: 'Preparation and scheduling for college entrance testing.' },
        ],
      },
    ],
  },

  // ACADEMY LIFE
  'student-life/residence-life': {
    intro: 'Every athlete lives on campus, in a routine built for training and recovery.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Residence life is where the training plan either holds together or falls apart. Meals, study, sleep, and recovery all happen here on a predictable schedule, supervised by staff who live alongside the athletes.',
          'Athletes share double rooms with teammates. Living with people chasing the same goal is the fastest way to make hard standards feel normal.',
        ],
      },
      {
        type: 'stats',
        items: [
          { value: '2', label: 'Athletes per room' },
          { value: '100%', label: 'Of athletes live on campus' },
          { value: 'Nightly', label: 'Supervised study hours' },
        ],
      },
      {
        type: 'features',
        heading: 'Life in residence',
        items: [
          { title: 'Residential staff', text: 'Staff on every floor, responsible for daily routine and wellbeing.' },
          { title: 'Evening study', text: 'Quiet, supervised study hours before lights out.' },
          { title: 'Protected sleep', text: 'Consistent lights-out so recovery actually happens.' },
          { title: 'Common areas', text: 'Lounge and shared space for downtime with teammates.' },
          { title: 'Laundry & essentials', text: 'On-site laundry, including training gear turnaround.' },
          { title: 'Health & safety', text: 'Sports medicine access and clear procedures for illness or injury.' },
        ],
      },
    ],
  },

  'student-life/dining-and-nutrition': {
    intro: 'An athlete nutrition program, not a school cafeteria.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Athletes training twice a day cannot eat on a standard school schedule and expect to recover. Menus are built around protein, carbohydrate, vegetables, fruit, and hydration, and served at the times the training day demands.',
          'Beyond three meals, athletes get the extra fueling that heavy training requires: something before training, something immediately after, and a protein-based snack before sleep.',
        ],
      },
      {
        type: 'table',
        heading: 'A training day of fueling',
        columns: ['Time', 'Meal', 'Focus'],
        rows: [
          ['Early morning', 'Pre-training fuel', 'Light carbohydrate before the first session'],
          ['Morning', 'Breakfast', 'Protein and carbohydrate to start recovery'],
          ['Mid-day', 'Lunch', 'Balanced plate: protein, carbohydrate, vegetables'],
          ['Afternoon', 'Pre-session snack', 'Carbohydrate before the sport session'],
          ['Evening', 'Dinner', 'Recovery-focused: protein, carbohydrate, color'],
          ['Before bed', 'Evening snack', 'Protein to support overnight recovery'],
        ],
        note: 'Sample day. Menus and timing vary by program and competition schedule.',
      },
      {
        type: 'features',
        heading: 'How we plan menus',
        items: [
          { title: 'Built around training load', text: 'Heavier fueling on heavy days, lighter on recovery days.' },
          { title: 'Competition days', text: 'Pre-game meals and travel fueling planned with coaches.' },
          { title: 'Dietary needs', text: 'Allergies, restrictions, and preferences accommodated.' },
          { title: 'Education', text: 'Athletes learn to fuel themselves before they leave for college.' },
        ],
      },
    ],
  },

  'student-life/activities-and-service': {
    intro: 'Time away from training, and a habit of contributing to the community.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Athletes who never switch off break down. Weekends include planned downtime, trips off campus, and service work that connects the academy to the surrounding community.',
          'Service is also honest preparation for life after sport, and it gives college applications substance beyond athletic results.',
        ],
      },
      {
        type: 'image',
        src: '/images/coast-beach.jpg',
        alt: 'Surfers and beachgoers along the Southern California coast at sunset',
        caption: 'The coast is a short drive from campus — a regular weekend destination.',
      },
      {
        type: 'features',
        heading: 'Beyond training',
        items: [
          { title: 'Weekend trips', text: 'Beaches, parks, and Southern California destinations near campus.' },
          { title: 'Community service', text: 'Regular service projects with local organizations.' },
          { title: 'Youth clinics', text: 'Athletes coaching younger players in their own sport.' },
          { title: 'Team events', text: 'Meals, film nights, and traditions that build the group.' },
          { title: 'College visits', text: 'Campus visits organized alongside competition travel.' },
          { title: 'Downtime', text: 'Protected unstructured time, because recovery is not only physical.' },
        ],
      },
      {
        type: 'gallery',
        heading: 'Where weekends go',
        items: [
          {
            src: '/images/orange-county-coast.jpg',
            alt: 'Hillside town above the Orange County coastline at golden hour',
            caption: 'The Orange County coast, minutes from campus',
          },
          {
            src: '/images/la-jolla-mall.jpg',
            alt: 'An open-air shopping center in the evening',
            caption: 'Shops, food, and downtime off campus',
          },
        ],
      },
    ],
  },

  // RECRUITING
  'counseling/5-to-1-model': {
    intro: 'Five professionals dedicated to one athlete.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'At a typical high school, one counselor carries hundreds of students and has no time for athletic recruiting. We invert that: every athlete has a team of five, each with a defined job, meeting regularly about that athlete alone.',
        ],
      },
      {
        type: 'numbered',
        heading: 'The five',
        items: [
          {
            title: 'Athlete Recruiter',
            text: 'Owns the recruiting strategy: target list, timing, and outreach to college coaches.',
          },
          {
            title: 'Coach',
            text: 'Develops the athlete and speaks directly to college coaches about their game and character.',
          },
          {
            title: 'Academic Advisor',
            text: 'Keeps courses, grades, testing, and NCAA eligibility on track from the first term.',
          },
          {
            title: 'Student Assistant',
            text: 'Keeps deadlines, film, forms, and applications moving week to week.',
          },
          {
            title: 'Family Advisor',
            text: 'Keeps parents informed and guides the family through offers and decisions.',
          },
        ],
      },
      {
        type: 'features',
        heading: 'What the team handles together',
        items: [
          { title: 'Course & GPA planning' },
          { title: 'Competition & exposure planning' },
          { title: 'Highlight film & athletic résumé' },
          { title: 'College list & target programs' },
          { title: 'Coach outreach & campus visits' },
          { title: 'NCAA registration & compliance' },
          { title: 'Applications & essays' },
          { title: 'Offer comparison & commitment' },
        ],
      },
      {
        type: 'cta',
        heading: 'How recruiting runs year by year',
        links: [{ label: 'College Recruiting', to: '/counseling/college-recruiting' }],
      },
    ],
  },

  'counseling/college-recruiting': {
    intro: 'A recruiting plan that starts years before signing day.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Recruiting rewards preparation. Athletes who wait until their final year to think about college are negotiating from behind. Our athletes build a record, a reputation, and a relationship with coaches over several years.',
        ],
      },
      {
        type: 'numbered',
        heading: 'The recruiting timeline',
        items: [
          {
            title: 'Early years — build',
            text: 'Develop the athlete, establish grades, and learn how recruiting actually works. No shortcuts, no premature outreach.',
          },
          {
            title: 'Middle years — exposure',
            text: 'Targeted tournaments and showcases, first highlight film, an honest assessment of realistic levels, and a working college list.',
          },
          {
            title: 'Final years — outreach',
            text: 'Direct coach communication, campus visits, official interest, and applications, with the team preparing every piece.',
          },
          {
            title: 'Decision — commit',
            text: 'Comparing offers on fit, playing time, academics, and cost, then supporting the transition to college.',
          },
        ],
      },
      {
        type: 'features',
        heading: 'What we provide',
        items: [
          { title: 'Highlight & game film', text: 'Filmed, edited, and distributed by our video staff.' },
          { title: 'Athletic résumé', text: 'Testing data, results, and academic record in one profile.' },
          { title: 'Coach outreach', text: 'Introductions from coaches who know the college landscape.' },
          { title: 'NCAA compliance', text: 'Eligibility Center registration and rules guidance.' },
          { title: 'Campus visits', text: 'Visits planned around competition travel.' },
          { title: 'Family guidance', text: 'Plain answers on scholarships, cost, and what offers actually mean.' },
        ],
      },
      visitCta,
    ],
  },

  'counseling/commitments': {
    intro: 'Where our athletes go next.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'As athletes commit to college programs, they will be listed here by sport, program, and division, alongside the story of how they got there.',
        ],
      },
      {
        type: 'table',
        heading: 'College commitments',
        columns: ['Athlete', 'Sport', 'College', 'Division', 'Year'],
        rows: [],
        note: 'Our first class has not yet committed. This list will grow as athletes sign.',
      },
      {
        type: 'cta',
        heading: 'How we get athletes there',
        links: [
          { label: 'The 5-to-1 Model', to: '/counseling/5-to-1-model' },
          { label: 'College Recruiting', to: '/counseling/college-recruiting' },
        ],
      },
    ],
  },

  // ADMISSION
  'admission/overview': {
    intro:
      'Welcome to Admission at JMC. Rolling admission, with an athletic and academic review for every applicant — no ISEE or SSAT required.',
    blocks: [
      {
        type: 'statement',
        text: 'We admit the whole student: the transcript, the character, and where they stand in their sport — never a single test score.',
        attribution: 'Our Admission Philosophy',
      },
      {
        type: 'prose',
        paragraphs: [
          'That philosophy follows directly from our mission. JMC exists so that grade 6–12 student-athletes never have to choose between a serious sport and a serious education, and admission is the first place we put that into practice. We admit athletes throughout the year rather than against a single deadline, because athletic calendars do not line up with school ones — but every application still gets the same close look, academic and athletic, before a decision is made.',
          'We do not require the ISEE or SSAT that most independent schools ask for. A coach’s evaluation of film and, where possible, live play tells us more about a prospective JMC athlete than a standardized admission test does, and it sits alongside a genuine look at transcripts, teacher comments, and the family itself.',
        ],
      },
      {
        type: 'calendar',
        heading: 'Admission Calendar',
        items: [
          { period: 'Fall', focus: 'Inquiries open, campus tours resume, and coaches begin reviewing fall film.' },
          { period: 'Winter', focus: 'Application review, interviews, and early decisions for winter sport programs.' },
          { period: 'Spring', focus: 'Peak visit season, decisions for fall enrollment, and spring tournament evaluations.' },
          { period: 'Summer', focus: 'Enrollment, orientation planning, and late openings as space allows.' },
        ],
      },
      {
        // Placeholder team, invented for launch. Replace with real admission staff once hired.
        type: 'people',
        heading: 'Meet the Admission Team',
        text: 'Four people, each responsible for a different part of your family’s application.',
        items: [
          {
            name: 'Sarah Kim',
            role: 'Director of Admission',
            bio: 'Leads the admission process end to end — usually the first person a family talks to.',
          },
          {
            name: 'Marcus Bellamy',
            role: 'Athletic Recruiting Coordinator',
            bio: 'Reviews game film and coordinates with our coaching staff on every prospective athlete.',
          },
          {
            name: 'Elena Torres',
            role: 'Admission & Family Counselor',
            bio: 'Reviews transcripts and works directly with families through interviews and decisions.',
          },
          {
            name: 'David Okafor',
            role: 'International Admission Coordinator',
            bio: 'Supports international families through visas, travel, and the move to campus.',
          },
        ],
      },
      {
        type: 'numbered',
        heading: 'The process',
        items: [
          { title: 'Inquire', text: 'Send us the athlete’s sport, position, current level, and grade year.' },
          { title: 'Visit or meet', text: 'Come to campus during training, or meet the staff online if travel is difficult.' },
          { title: 'Apply', text: 'Submit the application with school records, and athletic history and video.' },
          { title: 'Athletic evaluation', text: 'Coaches evaluate film and, where possible, see the athlete train or compete.' },
          { title: 'Interview', text: 'A conversation with the athlete and family, in person or by video.' },
          { title: 'Decision & enrollment', text: 'Decisions are issued as reviews complete, followed by enrollment and arrival planning.' },
        ],
      },
      {
        type: 'features',
        heading: 'What the application includes',
        items: [
          { title: 'Application form', text: 'Athlete and family information, sport, position, and target grade year.' },
          { title: 'Parent statement', text: 'A short statement from the family on goals for the athlete, academically and athletically.' },
          { title: 'Student statement', text: 'In the athlete’s own words: their sport, their goals, and why JMC.' },
          { title: 'Transcript request', text: 'Academic records sent directly from the athlete’s current school.' },
          { title: 'Teacher comment', text: 'A brief comment from a current teacher or counselor.' },
          { title: 'Athletic history & video', text: 'Competition record, current team or club, and recent film — coaches will advise what to send.' },
        ],
      },
      {
        type: 'faq',
        heading: 'Common questions',
        items: [
          {
            q: 'Do you require the ISEE or SSAT?',
            a: 'No. Unlike most independent schools, JMC does not require standardized admission testing. Academic review is based on transcripts, teacher comments, and the interview.',
          },
          {
            q: 'When should we apply?',
            a: 'Any time. Because admission is rolling, the practical deadline is when a program fills for the year.',
          },
          {
            q: 'Do you accept post-graduate athletes?',
            a: 'Yes, where a post-graduate year serves the athlete’s development and recruiting timeline.',
          },
          {
            q: 'Is video required?',
            a: 'Recent competition or training video helps significantly, and coaches will tell you what to send.',
          },
          {
            q: 'Can athletes join mid-year?',
            a: 'Sometimes. It depends on space in the program and how the academic term aligns.',
          },
        ],
      },
      {
        type: 'cta',
        heading: 'Have a question first?',
        text: `Email us at ${site.email} and a member of the admission team will get back to you, or submit an inquiry to start your application.`,
        links: [
          { label: 'Submit an Inquiry', to: '/contact' },
          { label: 'Schedule a Visit', to: '/admission/visit' },
        ],
      },
    ],
  },

  'admission/visit': {
    intro: 'Come on a training day and see the standard for yourself.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'The best visits happen when training is running. Families see a real session, meet the coaches who would work with their athlete, and eat what the athletes eat.',
        ],
      },
      {
        type: 'features',
        heading: 'What a visit includes',
        items: [
          { title: 'Campus tour', text: 'Residence, dining, classrooms, and the performance center.' },
          { title: 'Watch training', text: 'Observe a live session in the athlete’s sport.' },
          { title: 'Meet the coaches', text: 'Talk with the coaching staff for that program.' },
          { title: 'Academic conversation', text: 'Review course placement and academic support.' },
          { title: 'Recruiting discussion', text: 'Walk through the 5-to-1 model with a recruiting staff member.' },
          { title: 'Family meeting', text: 'Time for the questions that matter most to parents.' },
        ],
      },
      {
        type: 'prose',
        heading: 'Visiting from far away',
        paragraphs: [
          'For families who cannot travel easily, we run video meetings that cover the same ground, including a live walk through campus and time with coaches.',
        ],
      },
      {
        type: 'cta',
        heading: 'Arrange a visit',
        text: 'Tell us the athlete’s sport and when you can travel, and we will schedule around a training day.',
        links: [{ label: 'Contact Admission', to: '/contact' }],
      },
    ],
  },

  'admission/international-athletes': {
    intro: 'Athletes from around the world, supported from arrival to graduation.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'A residential academy makes international enrollment straightforward: athletes live on campus, eat with the team, and follow the same daily schedule as everyone else from the first week.',
          'Our staff supports families through the practical parts, from documentation to airport pickup to communication across time zones.',
        ],
      },
      {
        type: 'features',
        heading: 'Support for international families',
        items: [
          { title: 'Student visa guidance', text: 'Help with documentation and the application process.' },
          { title: 'English language support', text: 'Additional academic support for non-native speakers.' },
          { title: 'Airport transport', text: 'Arrival and departure transport at the start and end of terms.' },
          { title: 'Holiday planning', text: 'Support for athletes staying in the area during short breaks.' },
          { title: 'Family communication', text: 'Regular updates scheduled across time zones.' },
          { title: 'Local guardianship', text: 'Guidance on guardianship requirements where needed.' },
        ],
      },
      visitCta,
    ],
  },

  'admission/tuition-and-fees': {
    intro: 'What enrollment costs, and what it covers.',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Tuition covers the full residential program: training, coaching, performance support, academics, room, board, and recruiting guidance. We publish the fee schedule openly so families can compare us honestly against club programs, prep schools, and private coaching bought separately.',
        ],
      },
      {
        type: 'table',
        heading: 'Fee schedule',
        columns: ['Item', 'Amount'],
        rows: [
          ['Residential tuition (per year)', 'To be confirmed'],
          ['Application fee', 'To be confirmed'],
          ['Enrollment deposit', 'To be confirmed'],
          ['Team travel & competition', 'To be confirmed'],
          ['Equipment & team apparel', 'To be confirmed'],
          ['International student services', 'To be confirmed'],
        ],
        note: 'Final amounts for the coming year will be published here. Request the current schedule from the admission office.',
      },
      {
        type: 'features',
        heading: 'Tuition includes',
        items: [
          { title: 'Coaching & training', text: 'All sport sessions with the full coaching staff.' },
          { title: 'Performance program', text: 'Strength, conditioning, testing, and recovery support.' },
          { title: 'Academics', text: 'Classes, study hall, tutoring, and academic advising.' },
          { title: 'Room & board', text: 'Residence and the athlete nutrition program.' },
          { title: 'Recruiting support', text: 'The full 5-to-1 team, film, and coach outreach.' },
          { title: 'Campus activities', text: 'Weekend activities and service programming.' },
        ],
      },
      {
        type: 'faq',
        heading: 'Common questions',
        items: [
          {
            q: 'Are payment plans available?',
            a: 'Payment plan options will be published with the final fee schedule.',
          },
          {
            q: 'Is financial aid or an athletic scholarship available?',
            a: 'Aid policy is being finalized. Ask the admission office about current options before applying.',
          },
          {
            q: 'What is not included?',
            a: 'Personal travel home, personal equipment beyond team apparel, and optional private coaching outside the program.',
          },
        ],
      },
      {
        type: 'cta',
        heading: 'Questions about cost?',
        text: 'The admission office can walk through the full schedule and what a year actually looks like.',
        links: [{ label: 'Contact Admission', to: '/contact' }],
      },
    ],
  },
}
