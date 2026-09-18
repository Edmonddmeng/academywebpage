import { Link } from 'react-router-dom'
import { ButtonLink } from '../ui'
import type { Block } from '../../content/pages'

function Heading({ children }: { children: string }) {
  return <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{children}</h2>
}

export function PageBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'prose':
      return (
        <section className="max-w-3xl">
          {block.heading && <Heading>{block.heading}</Heading>}
          <div className={block.heading ? 'mt-6 space-y-5' : 'space-y-5'}>
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-ink/75">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )

    case 'numbered':
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <ol className={`border-t border-ink/15 ${block.heading ? 'mt-8' : ''}`}>
            {block.items.map((item, i) => (
              <li
                key={item.title}
                className="grid gap-x-6 gap-y-2 border-b border-ink/15 py-6 sm:grid-cols-[3rem_18rem_1fr]"
              >
                <span className="font-serif text-3xl text-brass">{i + 1}</span>
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <p className="leading-relaxed text-ink/70">{item.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )

    case 'features':
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <ul className={`grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3 ${block.heading ? 'mt-8' : ''}`}>
            {block.items.map((item) => (
              <li key={item.title} className="border border-dotted border-ink/45 p-6">
                <h3 className="font-serif text-2xl">{item.title}</h3>
                {item.text && <p className="mt-2 leading-relaxed text-ink/70">{item.text}</p>}
              </li>
            ))}
          </ul>
        </section>
      )

    case 'stats':
      return (
        <section className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item) => (
            <div
              key={item.label}
              className="border border-dotted border-ink/45 px-6 py-10 text-center"
            >
              <p className="font-serif text-5xl leading-none text-ink">{item.value}</p>
              <p className="mt-3 font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </section>
      )

    case 'table':
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <div className={block.heading ? 'mt-8' : ''}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead>
                  <tr className="border-b-2 border-ink">
                    {block.columns.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="py-3 pr-6 font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr key={row.join('|')} className="border-b border-ink/10">
                      {row.map((cell, i) => (
                        <td
                          key={cell + i}
                          className={`py-4 pr-6 ${i === 0 ? 'font-semibold text-ink' : 'text-ink/75'}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {block.rows.length === 0 && (
              <p className="border-b border-ink/10 px-4 py-12 text-center text-ink/60">
                Nothing to list yet.
              </p>
            )}
            {block.note && <p className="mt-4 text-sm text-ink/55">{block.note}</p>}
          </div>
        </section>
      )

    case 'matrix':
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <div className={`overflow-x-auto ${block.heading ? 'mt-8' : ''}`}>
            <table className="w-full min-w-[1080px] text-left align-top">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th scope="col" className="w-36 py-3 pr-4 font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase">
                    Department
                  </th>
                  {block.columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="py-3 pr-4 font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.label} className="border-b border-ink/10 align-top">
                    <th
                      scope="row"
                      className="py-4 pr-4 font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase"
                    >
                      {row.label}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td key={i} className="py-4 pr-4 text-sm leading-relaxed text-ink/75">
                        <ul className="space-y-1">
                          {cell.map((course) => (
                            <li key={course}>{course}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && <p className="mt-4 max-w-3xl text-sm text-ink/55">{block.note}</p>}
        </section>
      )

    case 'faq':
      return (
        <section className="max-w-3xl">
          {block.heading && <Heading>{block.heading}</Heading>}
          <div className={`border-t border-ink/15 ${block.heading ? 'mt-8' : ''}`}>
            {block.items.map((item) => (
              <details key={item.q} className="group border-b border-ink/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-xl">
                  {item.q}
                  <span className="text-2xl leading-none text-brass transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-6 leading-relaxed text-ink/70">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )

    case 'cta':
      return (
        <section className="bg-ink px-6 py-14 text-center text-white sm:px-10">
          <h2 className="font-serif text-3xl sm:text-4xl">{block.heading}</h2>
          {block.text && <p className="mx-auto mt-4 max-w-2xl text-white/75">{block.text}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {block.links.map((link) => (
              <ButtonLink key={link.to} to={link.to} variant="outline-light">
                {link.label}
              </ButtonLink>
            ))}
          </div>
        </section>
      )

    case 'gallery':
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <ul className={`grid gap-8 md:grid-cols-2 ${block.heading ? 'mt-8' : ''}`}>
            {block.items.map((item) => (
              <li key={item.src}>
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                {item.caption && (
                  <p className="mt-3 font-condensed text-[15px] font-semibold tracking-wide text-ink/70 uppercase">
                    {item.caption}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )

    case 'logos':
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          {block.text && (
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/75">{block.text}</p>
          )}
          <ul className="mt-8 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
            {block.items.map((item) => (
              <li key={item.label} className="flex h-24 items-center justify-center px-4">
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.alt ?? item.label}
                    loading="lazy"
                    className="max-h-16 w-auto max-w-full object-contain"
                  />
                ) : (
                  <span className="font-serif text-3xl tracking-wide text-ink">{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )

    case 'image':
      return (
        <figure>
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            className="aspect-[21/9] w-full object-cover"
          />
          {block.caption && (
            <figcaption className="mt-4 font-condensed text-[15px] font-semibold tracking-wide text-ink/70 uppercase">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'note':
      return (
        <aside className="flex max-w-3xl gap-4 border border-dotted border-brass/70 bg-white p-6">
          <span className="font-condensed text-[13px] font-semibold tracking-wide text-brass uppercase">
            To be confirmed
          </span>
          <p className="flex-1 leading-relaxed text-ink/70">{block.text}</p>
        </aside>
      )
  }
}

export function SectionFooterNav({
  label,
  links,
}: {
  label: string
  links: { label: string; to: string }[]
}) {
  return (
    <section className="border-t border-ink/15 pt-10">
      <p className="text-xs font-semibold tracking-[0.28em] text-brass uppercase">More in {label}</p>
      <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="font-serif text-2xl transition-colors hover:text-brass">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
