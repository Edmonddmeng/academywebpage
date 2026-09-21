import { useLocale, type Locale } from './locale'

const siteBase = {
  name: 'JMC Sports Academy',
  shortName: 'JMC',
  // PLACEHOLDER: street address still needed before launch.
  phone: '(949) 678-1320',
  email: 'admission@jmcsports.org',
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'YouTube', href: '#' },
  ],
}

const localized: Record<Locale, {
  tagline: string
  description: string
  identity: string
  campuses: {
    name: string
    city: string
    region: string
    image: string
    imageAlt: string
    partner: string
    partnerImage: string
    focus: string
    points: string[]
  }[]
  footerLinks: { label: string; to: string }[]
}> = {
  en: {
    tagline:
      'Season-long training, school, and college recruiting for serious student-athletes in Southern California.',
    description:
      'JMC Sports Academy develops student-athletes in ice hockey, golf, tennis, fencing, and lacrosse across two Southern California campuses, combining elite training, college-preparatory academics, and a dedicated recruiting team.',
    identity: 'A College-Preparatory Boarding Sports Academy for Grades 6–12 in Southern California',
    campuses: [
      {
        name: 'Irvine Campus',
        city: 'Irvine, California',
        region: 'Orange County',
        image: '/images/campus-irvine.jpg',
        imageAlt: 'JMC Irvine campus, Orange County',
        partner: 'Capistrano Valley Christian School',
        partnerImage: '/images/capistrano-valley-christian.jpg',
        focus: 'Ice hockey, golf, lacrosse, tennis, and fencing',
        points: [
          'Season-long ice and turf training',
          'Day-school academics at Capistrano Valley Christian School',
          'Minutes from the Orange County coast',
        ],
      },
      {
        name: 'San Diego Campus',
        city: 'San Diego, California',
        region: 'San Diego County',
        image: '/images/campus-san-diego.jpg',
        imageAlt: 'JMC San Diego campus',
        partner: 'Maranatha Christian School',
        partnerImage: '/images/maranatha-christian.jpg',
        focus: 'Golf, tennis, and lacrosse',
        points: [
          'Championship coastal course access',
          'Day-school academics at Maranatha Christian School',
          'Mild coastal weather supports outdoor training',
        ],
      },
    ],
    footerLinks: [
      { label: 'Our Campuses', to: '/about/campuses' },
      { label: 'Athletic Programs', to: '/athletic' },
      { label: 'Tuition & Fees', to: '/admission/tuition-and-fees' },
      { label: 'Apply to JMC', to: '/admission/overview' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  zh: {
    tagline: '为南加州认真投入的学生运动员提供整季训练、学业与大学体育特招服务。',
    description:
      'JMC 体育学院在南加州两个校区培养冰球、高尔夫、网球、击剑与长曲棍球学生运动员，将顶尖训练、大学预备学业与专属招募团队融为一体。',
    identity: '南加州一所面向 6 至 12 年级的大学预备寄宿体育学院',
    campuses: [
      {
        name: '尔湾校区',
        city: '加州尔湾',
        region: '橙县',
        image: '/images/campus-irvine.jpg',
        imageAlt: 'JMC 尔湾校区，位于橙县',
        partner: 'Capistrano Valley Christian School（卡皮斯特拉诺谷基督学校）',
        partnerImage: '/images/capistrano-valley-christian.jpg',
        focus: '冰球、高尔夫、长曲棍球、网球与击剑',
        points: [
          '整季冰上与草坪训练',
          '在 Capistrano Valley Christian School 走读完成学业',
          '距橙县海岸仅数分钟车程',
        ],
      },
      {
        name: '圣地亚哥校区',
        city: '加州圣地亚哥',
        region: '圣地亚哥县',
        image: '/images/campus-san-diego.jpg',
        imageAlt: 'JMC 圣地亚哥校区',
        partner: 'Maranatha Christian School（马拉纳沙基督学校）',
        partnerImage: '/images/maranatha-christian.jpg',
        focus: '高尔夫、网球与长曲棍球',
        points: [
          '可使用高水准海岸球场',
          '在 Maranatha Christian School 走读完成学业',
          '温和的沿海气候适合户外训练',
        ],
      },
    ],
    footerLinks: [
      { label: '我们的校区', to: '/about/campuses' },
      { label: '体育项目', to: '/athletic' },
      { label: '学费与费用', to: '/admission/tuition-and-fees' },
      { label: '申请 JMC', to: '/admission/overview' },
      { label: '联系我们', to: '/contact' },
    ],
  },
}

export function useSite() {
  const locale = useLocale()
  return { ...siteBase, ...localized[locale] }
}

// Locale-invariant facts, for places that need them without a hook (e.g. plain modules).
export const site = { ...siteBase, ...localized.en }
