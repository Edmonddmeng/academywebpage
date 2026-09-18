// Panoramic image shown behind each section's page titles.
export const sectionBanners: Record<string, string> = {
  about: '/images/orange-county-coast.jpg',
  admission: '/images/location-regional.jpg',
  academic: '/images/hero.avif',
  athletic: '/images/lacrosse-field.jpg',
  'student-life': '/images/coast-beach.jpg',
  counseling: '/images/golf-ncaa-green.jpg',
  'parent-support': '/images/golf-course-aerial.jpg',
}

export const defaultBanner = '/images/hero.avif'

export const bannerFor = (sectionSlug?: string) =>
  (sectionSlug && sectionBanners[sectionSlug]) || defaultBanner
