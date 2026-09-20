import { useParams } from 'react-router-dom'
import PlaceholderPage from './PlaceholderPage'
import SportPage from './SportPage'
import StandardPage from './StandardPage'
import { useNavSections } from '../content/navigation'
import { useSports } from '../content/sports'
import { pageContent } from '../content/pages'
import { pageContentZh } from '../content/pages.zh'
import { useLocale } from '../content/locale'

// Chooses a dedicated template for pages that have one, otherwise the generic placeholder.
export default function ContentPage() {
  const { section: sectionSlug, page: pageSlug } = useParams()
  const locale = useLocale()
  const navSections = useNavSections()
  const sports = useSports()

  const sport = sectionSlug === 'athletic' ? sports.find((s) => s.slug === pageSlug) : undefined
  if (sport) return <SportPage key={sport.slug} sport={sport} />

  const section = navSections.find((s) => s.slug === sectionSlug)
  const page = section?.links.find((l) => l.slug === pageSlug)
  const key = `${sectionSlug}/${pageSlug}`
  const contentEn = pageContent[key]
  const content = locale === 'zh' ? pageContentZh[key] ?? contentEn : contentEn
  const isFallback = locale === 'zh' && !pageContentZh[key] && !!contentEn

  if (section && page && content) {
    return (
      <StandardPage key={page.slug} section={section} page={page} content={content} fallback={isFallback} />
    )
  }

  return <PlaceholderPage />
}
