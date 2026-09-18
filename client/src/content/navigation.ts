export type NavLink = { label: string; slug: string }

export type NavSection = {
  label: string
  slug: string
  blurb: string
  links: NavLink[]
}

export const navSections: NavSection[] = [
  {
    label: 'About',
    slug: 'about',
    blurb: 'Who we are, what we believe, and the two campuses we train on.',
    links: [
      { label: 'Academy Overview', slug: 'academy-overview' },
      { label: 'Mission & Vision', slug: 'mission-and-vision' },
      { label: 'Leadership', slug: 'leadership' },
      { label: 'Campuses', slug: 'campuses' },
    ],
  },
  {
    label: 'Admission',
    slug: 'admission',
    blurb: 'Rolling admission for athletes from across the country and around the world.',
    links: [
      { label: 'How to Apply', slug: 'how-to-apply' },
      { label: 'Visit', slug: 'visit' },
      { label: 'International Athletes', slug: 'international-athletes' },
      { label: 'Tuition & Fees', slug: 'tuition-and-fees' },
    ],
  },
  {
    label: 'Academic',
    slug: 'academic',
    blurb: 'College-preparatory school with our partner schools, scheduled around training.',
    links: [
      { label: 'Middle School', slug: 'middle-school' },
      { label: 'Upper School', slug: 'upper-school' },
      { label: 'Academic Progression', slug: 'academic-progression' },
      { label: 'NCAA Eligibility', slug: 'ncaa-eligibility' },
      { label: 'Academic Support', slug: 'academic-support' },
    ],
  },
  {
    label: 'Athletic',
    slug: 'athletic',
    blurb: 'Eight year-round programs in ice hockey, golf, tennis, and lacrosse.',
    links: [
      { label: 'Boys Ice Hockey', slug: 'boys-ice-hockey' },
      { label: 'Girls Ice Hockey', slug: 'girls-ice-hockey' },
      { label: 'Boys Golf', slug: 'boys-golf' },
      { label: 'Girls Golf', slug: 'girls-golf' },
      { label: 'Boys Tennis', slug: 'boys-tennis' },
      { label: 'Girls Tennis', slug: 'girls-tennis' },
      { label: 'Boys Lacrosse', slug: 'boys-lacrosse' },
      { label: 'Girls Lacrosse', slug: 'girls-lacrosse' },
      { label: 'Coaching Staff', slug: 'coaching-staff' },
      { label: 'Training Model', slug: 'training-model' },
      { label: 'Strength & Conditioning', slug: 'strength-and-conditioning' },
      { label: 'Facilities', slug: 'facilities' },
    ],
  },
  {
    label: 'Student Life',
    slug: 'student-life',
    blurb: 'Residence, dining, recovery, travel, and life beyond training.',
    links: [
      { label: 'Residence Life', slug: 'residence-life' },
      { label: 'Dining & Nutrition', slug: 'dining-and-nutrition' },
      { label: 'Recovery & Medical', slug: 'recovery-and-medical' },
      { label: 'Competition Travel', slug: 'competition-travel' },
      { label: 'Activities & Service', slug: 'activities-and-service' },
    ],
  },
  {
    label: 'Counseling',
    slug: 'counseling',
    blurb: 'Five professionals guiding every athlete to the right college program.',
    links: [
      { label: 'College Planning', slug: 'college-planning' },
      { label: '5-to-1 Model', slug: '5-to-1-model' },
      { label: 'College Recruiting', slug: 'college-recruiting' },
      { label: 'Commitments', slug: 'commitments' },
    ],
  },
  {
    label: 'Parent Support',
    slug: 'parent-support',
    blurb: 'Resources that keep families connected to training, school, and recruiting.',
    links: [
      { label: 'Parent Resources', slug: 'parent-resources' },
      { label: 'Parent Portal', slug: 'parent-portal' },
      { label: 'Academy Calendar', slug: 'academy-calendar' },
      { label: 'Forms & Health', slug: 'forms-and-health' },
    ],
  },
]

export const utilityLinks = [
  { label: 'Inquire', to: '/contact' },
  { label: 'Visit', to: '/admission/visit' },
  { label: 'Apply', to: '/admission/how-to-apply' },
]

export const quickLinks = [
  { label: 'Apply to JMC', to: '/admission/how-to-apply' },
  { label: 'Schedule a Visit', to: '/admission/visit' },
  { label: 'Tuition & Fees', to: '/admission/tuition-and-fees' },
  { label: 'Our Campuses', to: '/about/campuses' },
  { label: 'Training Model', to: '/athletic/training-model' },
  { label: 'Parent Portal', to: '/parent-support/parent-portal' },
]

export const sectionPath = (section: NavSection) => `/${section.slug}`

export const linkPath = (section: NavSection, link: NavLink) =>
  `/${section.slug}/${link.slug}`
