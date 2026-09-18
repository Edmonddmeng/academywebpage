import { useParams } from 'react-router-dom'
import PlaceholderPage from './PlaceholderPage'
import SportPage from './SportPage'
import StandardPage from './StandardPage'
import { navSections } from '../content/navigation'
import { sports } from '../content/sports'
import { pageContent } from '../content/pages'

// Chooses a dedicated template for pages that have one, otherwise the generic placeholder.
export default function ContentPage() {
  const { section: sectionSlug, page: pageSlug } = useParams()

  const sport = sectionSlug === 'athletic' ? sports.find((s) => s.slug === pageSlug) : undefined
  if (sport) return <SportPage key={sport.slug} sport={sport} />

  const section = navSections.find((s) => s.slug === sectionSlug)
  const page = section?.links.find((l) => l.slug === pageSlug)
  const content = pageContent[`${sectionSlug}/${pageSlug}`]
  if (section && page && content) {
    return <StandardPage key={page.slug} section={section} page={page} content={content} />
  }

  return <PlaceholderPage />
}
