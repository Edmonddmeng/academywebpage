import PageBanner from '../components/PageBanner'
import Reveal from '../components/Reveal'
import SectionSidebar from '../components/page/SectionSidebar'
import { PageBlock } from '../components/page/blocks'
import { type ResolvedNavLink, type ResolvedNavSection } from '../content/navigation'
import { bannerFor } from '../content/banners'
import type { PageContent } from '../content/pages'
import { useLocale } from '../content/locale'

const fallbackNotice = {
  en: 'This page is not yet translated into Chinese. Showing the English version below.',
  zh: '该页面暂无中文翻译，以下显示英文原文。',
}

export default function StandardPage({
  section,
  page,
  content,
  fallback,
}: {
  section: ResolvedNavSection
  page: ResolvedNavLink
  content: PageContent
  fallback?: boolean
}) {
  const locale = useLocale()
  return (
    <>
      <PageBanner
        eyebrow={section.label}
        title={page.label}
        intro={content.intro}
        image={bannerFor(section.slug)}
      />

      <div className="bg-ivory pb-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[260px_1fr] lg:px-14">
          <SectionSidebar section={section} />

          <div className="flex flex-col gap-16 sm:gap-20">
            {fallback && (
              <p className="border border-dotted border-ink/40 bg-sand/40 px-5 py-3 text-sm text-ink/70">
                {fallbackNotice[locale]}
              </p>
            )}
            {content.blocks.map((block, i) => (
              <Reveal key={i} delay={Math.min(i, 3) * 70}>
                <PageBlock block={block} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
