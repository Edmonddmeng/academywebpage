import { useParams } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import { ButtonLink } from '../components/ui'
import SectionSidebar from '../components/page/SectionSidebar'
import { useNavSections } from '../content/navigation'
import { bannerFor } from '../content/banners'
import { useLocale } from '../content/locale'

const copy = {
  en: {
    notFoundTitle: 'Page not found',
    notFoundIntro: 'The page you’re looking for doesn’t exist yet.',
    backHome: 'Back to home',
    comingSoon: 'This page is coming soon.',
    preparing: (label: string) => `Content for ${label} is being prepared.`,
  },
  zh: {
    notFoundTitle: '页面未找到',
    notFoundIntro: '您要查找的页面尚不存在。',
    backHome: '返回首页',
    comingSoon: '本页面内容即将上线。',
    preparing: (label: string) => `“${label}”的内容正在准备中。`,
  },
}

export default function PlaceholderPage() {
  const params = useParams()
  const locale = useLocale()
  const t = copy[locale]
  const navSections = useNavSections()
  const section = navSections.find((s) => s.slug === params.section)
  const page = section?.links.find((l) => l.slug === params.page)

  if (!section || !page) {
    return (
      <>
        <PageBanner title={t.notFoundTitle} intro={t.notFoundIntro} />
        <div className="px-6 py-20 text-center">
          <ButtonLink to="/" variant="outline">
            {t.backHome}
          </ButtonLink>
        </div>
      </>
    )
  }

  return (
    <>
      <PageBanner eyebrow={section.label} title={page.label} image={bannerFor(section.slug)} />
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[260px_1fr] lg:px-14">
        <SectionSidebar section={section} />
        <div>
          <p className="font-serif text-3xl text-ink/80">{t.comingSoon}</p>
          <p className="mt-4 max-w-xl text-ink/60">{t.preparing(page.label)}</p>
        </div>
      </section>
    </>
  )
}
