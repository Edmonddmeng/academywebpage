export const site = {
  name: 'JMC Sports Academy',
  shortName: 'JMC',
  tagline:
    'Year-round training, school, and college recruiting for serious student-athletes in Southern California.',
  description:
    'JMC Sports Academy develops student-athletes in ice hockey, golf, tennis, and lacrosse across two Southern California campuses, combining elite training, college-preparatory academics, and a dedicated recruiting team.',
  // PLACEHOLDER contact details — replace with real numbers and addresses before launch.
  phone: '(000) 000-0000',
  email: 'admission@jmcsportsacademy.com',
  campuses: [
    {
      name: 'Irvine Campus',
      city: 'Irvine, California',
      region: 'Orange County',
      partner: 'Capistrano Valley Christian School',
      image: '/images/hockey-sticks.jpg',
      imageAlt: 'Sticks resting against the boards at the rink',
      focus: 'Ice hockey, lacrosse, and tennis',
      points: [
        'Year-round ice and turf training',
        'Academics with our Orange County partner school',
        'Minutes from the Orange County coast',
      ],
    },
    {
      name: 'San Diego Campus',
      city: 'San Diego, California',
      region: 'San Diego County',
      partner: 'Maranatha Christian School',
      image: '/images/golf-course-aerial.jpg',
      imageAlt: 'Aerial view of a coastal golf course along the Pacific',
      focus: 'Golf, tennis, and lacrosse',
      points: [
        'Championship coastal course access',
        'Academics with our San Diego partner school',
        'Twelve months of outdoor training weather',
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
