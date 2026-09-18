import { Link, useParams } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import { ArrowRight } from '../components/icons'
import { ButtonLink } from '../components/ui'
import SectionSidebar from '../components/page/SectionSidebar'
import { linkPath, navSections } from '../content/navigation'
import { bannerFor } from '../content/banners'

export default function PlaceholderPage() {
  const params = useParams()
  const section = navSections.find((s) => s.slug === params.section)
  const page = section?.links.find((l) => l.slug === params.page)

  if (!section || (params.page && !page)) {
    return (
      <>
        <PageBanner title="Page not found" intro="The page you’re looking for doesn’t exist yet." />
        <div className="px-6 py-20 text-center">
          <ButtonLink to="/" variant="outline">
            Back to home
          </ButtonLink>
        </div>
      </>
    )
  }

  if (!page) {
    return (
      <>
        <PageBanner title={section.label} intro={section.blurb} image={bannerFor(section.slug)} />
        <section className="mx-auto grid max-w-7xl gap-1.5 px-6 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-3 lg:px-14">
          {section.links.map((link) => (
            <Link
              key={link.slug}
              to={linkPath(section, link)}
              className="group flex items-center justify-between border border-dotted border-ink/45 px-8 py-10 transition-colors hover:bg-white"
            >
              <span className="font-serif text-3xl">{link.label}</span>
              <ArrowRight className="h-6 w-6 text-brass transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </section>
      </>
    )
  }

  return (
    <>
      <PageBanner eyebrow={section.label} title={page.label} image={bannerFor(section.slug)} />
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[260px_1fr] lg:px-14">
        <SectionSidebar section={section} />
        <div>
          <p className="font-serif text-3xl text-ink/80">This page is coming soon.</p>
          <p className="mt-4 max-w-xl text-ink/60">
            Content for {page.label} is being prepared.
          </p>
        </div>
      </section>
    </>
  )
}
