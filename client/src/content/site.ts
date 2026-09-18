export const site = {
  name: 'JMC Sports Academy',
  shortName: 'JMC',
  tagline:
    'Season-long training, school, and college recruiting for serious student-athletes in Southern California.',
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
      image: '/images/hockey-sticks.jpg',
      imageAlt: 'Sticks resting against the boards at the rink',
      focus: 'Ice hockey, lacrosse, and tennis',
      points: [
        'Season-long ice and turf training',
        'Small, discussion-based academics on campus',
        'Minutes from the Orange County coast',
      ],
    },
    {
      name: 'San Diego Campus',
      city: 'San Diego, California',
      region: 'San Diego County',
      image: '/images/golf-course-aerial.jpg',
      imageAlt: 'Aerial view of a coastal golf course along the Pacific',
      focus: 'Golf, tennis, and lacrosse',
      points: [
        'Championship coastal course access',
        'Small, discussion-based academics on campus',
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
