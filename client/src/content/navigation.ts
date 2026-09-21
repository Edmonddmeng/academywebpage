import { useLocale, type Locale, type Localized } from './locale'

export type NavLink = { label: Localized<string>; slug: string }
export type NavSection = {
  label: Localized<string>
  slug: string
  blurb: Localized<string>
  links: NavLink[]
}

export type ResolvedNavLink = { label: string; slug: string }
export type ResolvedNavSection = {
  label: string
  slug: string
  blurb: string
  links: ResolvedNavLink[]
}

export const navSections: NavSection[] = [
  {
    label: { en: 'About', zh: '关于我们' },
    slug: 'about',
    blurb: {
      en: 'Who we are, what we believe, and the two campuses we train on.',
      zh: '我们是谁,我们的理念,以及我们训练所在的两个校区。',
    },
    links: [
      { label: { en: 'Head of Academy', zh: '院长寄语' }, slug: 'head-of-academy' },
      { label: { en: 'Mission & Vision', zh: '使命与愿景' }, slug: 'mission-and-vision' },
      { label: { en: 'Academy Overview', zh: '学院概览' }, slug: 'academy-overview' },
      { label: { en: 'Campuses', zh: '校区' }, slug: 'campuses' },
    ],
  },
  {
    label: { en: 'Admission', zh: '招生' },
    slug: 'admission',
    blurb: {
      en: 'Rolling admission for athletes from across the country and around the world.',
      zh: '面向全国及全球学生运动员的滚动招生。',
    },
    links: [
      { label: { en: 'Admission Overview', zh: '招生概览' }, slug: 'overview' },
      { label: { en: 'Visit', zh: '预约参观' }, slug: 'visit' },
      { label: { en: 'International Athletes', zh: '国际学生运动员' }, slug: 'international-athletes' },
      { label: { en: 'Tuition & Fees', zh: '学费与费用' }, slug: 'tuition-and-fees' },
    ],
  },
  {
    label: { en: 'Academic', zh: '学术' },
    slug: 'academic',
    blurb: {
      en: 'Our own college-preparatory academic program, scheduled around training.',
      zh: '围绕训练安排的大学预备学术课程。',
    },
    links: [
      { label: { en: 'Middle School', zh: '初中部' }, slug: 'middle-school' },
      { label: { en: 'Upper School', zh: '高中部' }, slug: 'upper-school' },
      { label: { en: 'Academic Progression', zh: '学术进阶路径' }, slug: 'academic-progression' },
      { label: { en: 'NCAA Eligibility', zh: 'NCAA 参赛资格' }, slug: 'ncaa-eligibility' },
      { label: { en: 'Beyond the Classroom', zh: '课堂之外' }, slug: 'academic-support' },
    ],
  },
  {
    label: { en: 'Athletic', zh: '体育' },
    slug: 'athletic',
    blurb: {
      en: 'Ten season-long programs in ice hockey, golf, tennis, fencing, and lacrosse.',
      zh: '冰球、高尔夫、网球、击剑与长曲棍球,共十个整季项目。',
    },
    links: [
      { label: { en: 'Boys Ice Hockey', zh: '男子冰球' }, slug: 'boys-ice-hockey' },
      { label: { en: 'Girls Ice Hockey', zh: '女子冰球' }, slug: 'girls-ice-hockey' },
      { label: { en: 'Boys Golf', zh: '男子高尔夫' }, slug: 'boys-golf' },
      { label: { en: 'Girls Golf', zh: '女子高尔夫' }, slug: 'girls-golf' },
      { label: { en: 'Boys Tennis', zh: '男子网球' }, slug: 'boys-tennis' },
      { label: { en: 'Girls Tennis', zh: '女子网球' }, slug: 'girls-tennis' },
      { label: { en: 'Boys Fencing', zh: '男子击剑' }, slug: 'boys-fencing' },
      { label: { en: 'Girls Fencing', zh: '女子击剑' }, slug: 'girls-fencing' },
      { label: { en: 'Boys Lacrosse', zh: '男子长曲棍球' }, slug: 'boys-lacrosse' },
      { label: { en: 'Girls Lacrosse', zh: '女子长曲棍球' }, slug: 'girls-lacrosse' },
      { label: { en: 'Coaching Staff', zh: '教练团队' }, slug: 'coaching-staff' },
      { label: { en: 'Training Model', zh: '训练模式' }, slug: 'training-model' },
      { label: { en: 'Strength & Conditioning', zh: '体能训练' }, slug: 'strength-and-conditioning' },
      { label: { en: 'Facilities', zh: '训练设施' }, slug: 'facilities' },
    ],
  },
  {
    label: { en: 'Student Life', zh: '学生生活' },
    slug: 'student-life',
    blurb: {
      en: 'Residence, dining, recovery, travel, and life beyond training.',
      zh: '住宿、餐饮、恢复、赛事出行,以及训练之外的校园生活。',
    },
    links: [
      { label: { en: 'Residence Life', zh: '住宿生活' }, slug: 'residence-life' },
      { label: { en: 'Dining & Nutrition', zh: '餐饮与营养' }, slug: 'dining-and-nutrition' },
      { label: { en: 'Recovery & Medical', zh: '恢复与医疗' }, slug: 'recovery-and-medical' },
      { label: { en: 'Competition Travel', zh: '赛事出行' }, slug: 'competition-travel' },
      { label: { en: 'Activities & Service', zh: '课外活动与公益服务' }, slug: 'activities-and-service' },
    ],
  },
  {
    label: { en: 'Counseling', zh: '升学辅导' },
    slug: 'counseling',
    blurb: {
      en: 'Five professionals guiding every athlete to the right college program.',
      zh: '五位专业顾问,协助每一位运动员找到合适的大学项目。',
    },
    links: [
      { label: { en: 'College Planning', zh: '大学规划' }, slug: 'college-planning' },
      { label: { en: '5-to-1 Model', zh: '5比1辅导模式' }, slug: '5-to-1-model' },
      { label: { en: 'College Recruiting', zh: '大学招募' }, slug: 'college-recruiting' },
      { label: { en: 'Commitments', zh: '录取承诺' }, slug: 'commitments' },
    ],
  },
  {
    label: { en: 'Parent Support', zh: '家长支持' },
    slug: 'parent-support',
    blurb: {
      en: 'Resources that keep families connected to training, school, and recruiting.',
      zh: '帮助家庭随时掌握训练、学业与招募进展的资源。',
    },
    links: [
      { label: { en: 'Parent Resources', zh: '家长资源' }, slug: 'parent-resources' },
      { label: { en: 'Parent Portal', zh: '家长门户' }, slug: 'parent-portal' },
      { label: { en: 'Academy Calendar', zh: '学院日历' }, slug: 'academy-calendar' },
      { label: { en: 'Forms & Health', zh: '表格与健康' }, slug: 'forms-and-health' },
    ],
  },
]

export const utilityLinks: { label: Localized<string>; to: string }[] = [
  { label: { en: 'Inquire', zh: '咨询' }, to: '/contact' },
  { label: { en: 'Visit', zh: '预约参观' }, to: '/admission/visit' },
  { label: { en: 'Apply', zh: '申请' }, to: '/admission/overview' },
]

export const quickLinks: { label: Localized<string>; to: string }[] = [
  { label: { en: 'Apply to JMC', zh: '申请 JMC' }, to: '/admission/overview' },
  { label: { en: 'Schedule a Visit', zh: '预约参观校园' }, to: '/admission/visit' },
  { label: { en: 'Tuition & Fees', zh: '学费与费用' }, to: '/admission/tuition-and-fees' },
  { label: { en: 'Our Campuses', zh: '我们的校区' }, to: '/about/campuses' },
  { label: { en: 'Training Model', zh: '训练模式' }, to: '/athletic/training-model' },
  { label: { en: 'Parent Portal', zh: '家长门户' }, to: '/parent-support/parent-portal' },
]

const resolveLink = (link: NavLink, locale: Locale): ResolvedNavLink => ({
  label: link.label[locale],
  slug: link.slug,
})

export const resolveNavSections = (locale: Locale): ResolvedNavSection[] =>
  navSections.map((section) => ({
    label: section.label[locale],
    slug: section.slug,
    blurb: section.blurb[locale],
    links: section.links.map((link) => resolveLink(link, locale)),
  }))

export const resolveLocalizedList = <T extends { label: Localized<string> }>(
  list: T[],
  locale: Locale,
): (Omit<T, 'label'> & { label: string })[] =>
  list.map((item) => ({ ...item, label: item.label[locale] }))

export function useNavSections(): ResolvedNavSection[] {
  return resolveNavSections(useLocale())
}

export function useUtilityLinks() {
  return resolveLocalizedList(utilityLinks, useLocale())
}

export function useQuickLinks() {
  return resolveLocalizedList(quickLinks, useLocale())
}

export const sectionPath = (section: { slug: string }) => `/${section.slug}`

export const linkPath = (section: { slug: string }, link: { slug: string }) =>
  `/${section.slug}/${link.slug}`
