import { ButtonLink, ImagePlaceholder } from '../ui'
import { EvenGrid } from '../EvenGrid'
import type { Block } from '../../content/pages'
import { useLocale } from '../../content/locale'

function Heading({ children }: { children: string }) {
  return <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{children}</h2>
}

const copy = {
  en: { nothingYet: 'Nothing to list yet.', department: 'Department', tbc: 'To be confirmed' },
  zh: { nothingYet: '暂无内容。', department: '学科', tbc: '待确认' },
}

// "Jonathan Reyes" -> "JR", for the person-card avatar circle.
const nameInitials = (name: string) =>
  name
    .split(' ')
    .filter((word) => /^[A-Za-z]/.test(word))
    .map((word) => word[0])
    .join('')
    .slice(0, 3)

export function PageBlock({ block }: { block: Block }) {
  const t = copy[useLocale()]
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
          {block.text && (
            <p className={`max-w-3xl text-lg leading-relaxed text-ink/75 ${block.heading ? 'mt-4' : ''}`}>
              {block.text}
            </p>
          )}
          <ol className={`border-t border-ink/15 ${block.heading || block.text ? 'mt-8' : ''}`}>
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
          {block.text && (
            <p className={`max-w-3xl text-lg leading-relaxed text-ink/75 ${block.heading ? 'mt-4' : ''}`}>
              {block.text}
            </p>
          )}
          <div className={block.heading || block.text ? 'mt-8' : ''}>
            <EvenGrid items={block.items} maxCols={3}>
              {(item) => (
                <li key={item.title} className="border border-dotted border-ink/45 p-6">
                  <h3 className="font-serif text-2xl">{item.title}</h3>
                  {item.text && <p className="mt-2 leading-relaxed text-ink/70">{item.text}</p>}
                </li>
              )}
            </EvenGrid>
          </div>
        </section>
      )

    case 'stats':
      return (
        <section>
          <EvenGrid items={block.items} maxCols={4}>
            {(item) => (
              <li
                key={item.label}
                className="border border-dotted border-ink/45 px-6 py-10 text-center"
              >
                <p className="font-serif text-5xl leading-none text-ink">{item.value}</p>
                <p className="mt-3 font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase">
                  {item.label}
                </p>
              </li>
            )}
          </EvenGrid>
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
                {t.nothingYet}
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
                    {t.department}
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
          <div className={block.heading ? 'mt-8' : ''}>
            <EvenGrid items={block.items} maxCols={3} gap="gap-8">
              {(item) => (
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
              )}
            </EvenGrid>
          </div>
        </section>
      )

    case 'logos':
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          {block.text && (
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/75">{block.text}</p>
          )}
          <div className="mt-8">
            <EvenGrid items={block.items} maxCols={5}>
              {(item) => (
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
              )}
            </EvenGrid>
          </div>
        </section>
      )

    case 'collage':
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          {block.text && (
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/75">{block.text}</p>
          )}
          <div className="mt-8">
            <EvenGrid items={block.items} maxCols={4}>
              {(item) => (
                <li
                  key={item.src}
                  className="flex aspect-[4/3] items-center justify-center border border-dotted border-ink/45 bg-white p-8"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </li>
              )}
            </EvenGrid>
          </div>
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

    case 'statement':
      return (
        <section className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-3xl leading-snug text-ink sm:text-4xl">{block.text}</p>
          <span aria-hidden="true" className="mx-auto mt-6 block h-px w-16 bg-brass" />
          {block.attribution && (
            <p className="mt-4 font-condensed text-[13px] font-semibold tracking-[0.18em] text-brass uppercase">
              {block.attribution}
            </p>
          )}
        </section>
      )

    case 'split':
      return (
        <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className={`aspect-[4/3] ${block.reverse ? 'lg:order-2' : ''}`}>
            {'src' in block.image ? (
              <img
                src={block.image.src}
                alt={block.image.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlaceholder label={block.image.placeholder} className="h-full w-full" />
            )}
          </div>
          <div>
            <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
              {block.heading}
            </h2>
            <div className="mt-5 space-y-4">
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-relaxed text-ink/75">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )

    case 'people':
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          {block.text && (
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/75">{block.text}</p>
          )}
          <div className={block.heading || block.text ? 'mt-8' : ''}>
            <EvenGrid items={block.items} maxCols={3}>
              {(person) => (
                <li key={person.name} className="border border-dotted border-ink/45 p-6">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-ink font-condensed text-lg font-semibold tracking-wide text-white">
                    {nameInitials(person.name)}
                  </span>
                  <p className="mt-4 font-serif text-2xl leading-tight">{person.name}</p>
                  <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-brass uppercase">
                    {person.role}
                  </p>
                  {person.bio && (
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">{person.bio}</p>
                  )}
                </li>
              )}
            </EvenGrid>
          </div>
        </section>
      )

    case 'calendar':
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <div className={block.heading ? 'mt-8' : ''}>
            <EvenGrid items={block.items} maxCols={4} as="ol">
              {(item, i) => (
                <li key={item.period} className="border border-dotted border-ink/45 p-6">
                  <span className="font-serif text-2xl text-brass">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-3 font-condensed text-[15px] font-semibold tracking-wide text-ink uppercase">
                    {item.period}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.focus}</p>
                </li>
              )}
            </EvenGrid>
          </div>
        </section>
      )

    case 'signature':
      return (
        <div className="max-w-md border-t border-ink/15 pt-6">
          <p className="font-serif text-2xl text-ink">{block.name}</p>
          <p className="mt-1 text-sm font-semibold tracking-[0.1em] text-brass uppercase">
            {block.role}
          </p>
          {block.extra && <p className="mt-1 text-sm text-ink/60">{block.extra}</p>}
        </div>
      )

    case 'note':
      return (
        <aside className="flex max-w-3xl gap-4 border border-dotted border-brass/70 bg-white p-6">
          <span className="font-condensed text-[13px] font-semibold tracking-wide text-brass uppercase">
            {t.tbc}
          </span>
          <p className="flex-1 leading-relaxed text-ink/70">{block.text}</p>
        </aside>
      )
  }
}
