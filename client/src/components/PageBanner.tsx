import { Eyebrow } from './ui'

type Props = {
  eyebrow?: string
  title: string
  intro?: string
}

// Dark top banner for inner pages so the transparent header stays legible.
export default function PageBanner({ eyebrow, title, intro }: Props) {
  return (
    <section className="bg-ink px-6 pt-40 pb-20 text-white sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight sm:text-7xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg text-white/75">{intro}</p>}
      </div>
    </section>
  )
}
