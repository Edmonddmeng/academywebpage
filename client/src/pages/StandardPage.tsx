import PageBanner from '../components/PageBanner'
import Reveal from '../components/Reveal'
import SectionSidebar from '../components/page/SectionSidebar'
import { PageBlock } from '../components/page/blocks'
import { type NavLink, type NavSection } from '../content/navigation'
import { bannerFor } from '../content/banners'
import type { PageContent } from '../content/pages'

export default function StandardPage({
  section,
  page,
  content,
}: {
  section: NavSection
  page: NavLink
  content: PageContent
}) {
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
