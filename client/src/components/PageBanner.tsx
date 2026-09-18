import { Eyebrow } from './ui'

type Props = {
  eyebrow?: string
  title: string
  intro?: string
  /** Panoramic photo behind the title; decorative, so it carries no alt text. */
  image?: string
}

// Dark top banner for inner pages so the transparent header stays legible.
export default function PageBanner({ eyebrow, title, intro, image }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-ink px-6 pt-40 pb-20 text-white sm:px-10 lg:px-14">
      {image && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink/90 via-ink/70 to-ink/40" />
        </>
      )}
      <div className="mx-auto max-w-7xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight sm:text-7xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg text-white/75">{intro}</p>}
      </div>
    </section>
  )
}
