import PageBanner from '../components/PageBanner'
import { PageBlock, SectionFooterNav } from '../components/page/blocks'
import { linkPath, type NavLink, type NavSection } from '../content/navigation'
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
  const siblings = section.links
    .filter((link) => link.slug !== page.slug)
    .map((link) => ({ label: link.label, to: linkPath(section, link) }))

  return (
    <>
      <PageBanner
        eyebrow={section.label}
        title={page.label}
        intro={content.intro}
        image={bannerFor(section.slug)}
      />

      <div className="bg-ivory pb-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-20 sm:px-10 sm:gap-20 lg:px-14">
          {content.blocks.map((block, i) => (
            <PageBlock key={i} block={block} />
          ))}
          <SectionFooterNav label={section.label} links={siblings} />
        </div>
      </div>
    </>
  )
}
