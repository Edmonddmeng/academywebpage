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
    blurb: 'Who we are, what we believe, and the people who lead our community.',
    links: [
      { label: 'School Overview', slug: 'school-overview' },
      { label: 'Mission & Vision', slug: 'mission-and-vision' },
      { label: 'School Philosophy', slug: 'school-philosophy' },
      { label: 'Head of School', slug: 'head-of-school' },
      { label: 'Leadership', slug: 'leadership' },
      { label: 'Campus', slug: 'campus' },
      { label: 'Why Our School', slug: 'why-our-school' },
    ],
  },
  {
    label: 'Academics',
    slug: 'academics',
    blurb: 'A New England–style curriculum built on discussion, writing, and critical thinking.',
    links: [
      { label: 'Curriculum', slug: 'curriculum' },
      { label: 'Departments', slug: 'departments' },
      { label: 'Harkness Learning', slug: 'harkness-learning' },
      { label: 'Academic Support', slug: 'academic-support' },
      { label: 'Advanced Study', slug: 'advanced-study' },
    ],
  },
  {
    label: 'Admission',
    slug: 'admission',
    blurb: 'Rolling admission for boarding and day students from around the country and the world.',
    links: [
      { label: 'Apply', slug: 'apply' },
      { label: 'Visit', slug: 'visit' },
      { label: 'Boarding', slug: 'boarding' },
      { label: 'Day', slug: 'day' },
      { label: 'Domestic', slug: 'domestic' },
      { label: 'International', slug: 'international' },
      { label: 'Athlete Admission', slug: 'athlete-admission' },
      { label: 'Tuition & Fees', slug: 'tuition-and-fees' },
    ],
  },
  {
    label: 'Athletics',
    slug: 'athletics',
    blurb: 'All-year athletic development led by professional coaches and performance staff.',
    links: [
      { label: 'Boys Golf', slug: 'boys-golf' },
      { label: 'Girls Golf', slug: 'girls-golf' },
      { label: 'Boys Ice Hockey', slug: 'boys-ice-hockey' },
      { label: 'Girls Ice Hockey', slug: 'girls-ice-hockey' },
      { label: 'Boys Lacrosse', slug: 'boys-lacrosse' },
      { label: 'Girls Lacrosse', slug: 'girls-lacrosse' },
      { label: 'Coaches', slug: 'coaches' },
      { label: 'Strength & Conditioning', slug: 'strength-and-conditioning' },
      { label: 'Athletic Facilities', slug: 'athletic-facilities' },
      { label: 'College Recruiting', slug: 'college-recruiting' },
    ],
  },
  {
    label: 'Student Life',
    slug: 'student-life',
    blurb: 'Boarding life, athlete nutrition, service, and experiences beyond the classroom.',
    links: [
      { label: 'Boarding Life', slug: 'boarding-life' },
      { label: 'Dining', slug: 'dining' },
      { label: 'Weekend Activities', slug: 'weekend-activities' },
      { label: 'Clubs', slug: 'clubs' },
      { label: 'Community Service', slug: 'community-service' },
      { label: 'Field Trips', slug: 'field-trips' },
      { label: 'College Visits', slug: 'college-visits' },
      { label: 'Competitions', slug: 'competitions' },
    ],
  },
  {
    label: 'College Counseling',
    slug: 'college-counseling',
    blurb: 'Five professionals dedicated to every student’s path to college.',
    links: [
      { label: 'College Planning', slug: 'college-planning' },
      { label: '5-to-1 Counseling Model', slug: '5-to-1-counseling-model' },
      { label: 'Athlete Recruiting', slug: 'athlete-recruiting' },
      { label: 'College Application', slug: 'college-application' },
      { label: 'Matriculation', slug: 'matriculation' },
    ],
  },
  {
    label: 'Parents',
    slug: 'parents',
    blurb: 'Resources that keep families connected to academics, athletics, and residential life.',
    links: [
      { label: 'Parent Resources', slug: 'parent-resources' },
      { label: 'Parent Portal', slug: 'parent-portal' },
      { label: 'School Calendar', slug: 'school-calendar' },
      { label: 'Transportation', slug: 'transportation' },
      { label: 'Forms', slug: 'forms' },
    ],
  },
  {
    label: 'Alumni',
    slug: 'alumni',
    blurb: 'A lifelong community that begins on campus and lasts well beyond graduation.',
    links: [
      { label: 'Alumni Network', slug: 'alumni-network' },
      { label: 'Alumni Events', slug: 'alumni-events' },
      { label: 'Alumni Mentorship', slug: 'alumni-mentorship' },
      { label: 'Support the School', slug: 'support-the-school' },
    ],
  },
]

export const utilityLinks = [
  { label: 'Inquire', to: '/contact' },
  { label: 'Visit', to: '/admission/visit' },
  { label: 'Apply', to: '/admission/apply' },
  { label: 'Give', to: '/alumni/support-the-school' },
]

export const quickLinks = [
  { label: 'Schedule a Visit', to: '/admission/visit' },
  { label: 'Tuition & Fees', to: '/admission/tuition-and-fees' },
  { label: 'Athletic Programs', to: '/athletics' },
  { label: 'School Calendar', to: '/parents/school-calendar' },
  { label: 'Parent Portal', to: '/parents/parent-portal' },
  { label: 'Dining', to: '/student-life/dining' },
]

export const sectionPath = (section: NavSection) => `/${section.slug}`

export const linkPath = (section: NavSection, link: NavLink) =>
  `/${section.slug}/${link.slug}`
