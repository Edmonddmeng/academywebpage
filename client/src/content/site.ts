export const site = {
  name: 'JMC Sports Academy',
  shortName: 'JMC',
  tagline:
    'Season-long training, school, and college recruiting for serious student-athletes in Southern California.',
  description:
    'JMC Sports Academy develops student-athletes in ice hockey, golf, tennis, and lacrosse across two Southern California campuses, combining elite training, college-preparatory academics, and a dedicated recruiting team.',
  // Short identity line for the footer, matching how independent schools state grade range + type + region in one line.
  identity: 'A College-Preparatory Boarding Sports Academy for Grades 6–12 in Southern California',
  // PLACEHOLDER: street address still needed before launch.
  phone: '(949) 678-1320',
  email: 'admission@jmcsportsacademy.com',
  campuses: [
    {
      name: 'Irvine Campus',
      city: 'Irvine, California',
      region: 'Orange County',
      image: '/images/campus-irvine.jpg',
      imageAlt: 'JMC Irvine campus, Orange County',
      partner: 'Capistrano Valley Christian School',
      partnerImage: '/images/capistrano-valley-christian.jpg',
      focus: 'Ice hockey, lacrosse, and tennis',
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
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'YouTube', href: '#' },
  ],
  footerLinks: [
    { label: 'Our Campuses', to: '/about/campuses' },
    { label: 'Athletic Programs', to: '/athletic' },
    { label: 'Tuition & Fees', to: '/admission/tuition-and-fees' },
    { label: 'Apply to JMC', to: '/admission/overview' },
    { label: 'Contact Us', to: '/contact' },
  ],
}
