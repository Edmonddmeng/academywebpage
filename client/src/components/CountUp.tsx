import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Animates the leading digits of a value ("5:1" -> counts 0 to 5, keeps ":1") once it
// scrolls into view. Values with no leading digits ("TBD") render unchanged.
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+)(.*)$/)
  const target = match ? Number(match[1]) : null
  const suffix = match ? match[2] : ''

  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState<number | string>(() =>
    target === null || prefersReducedMotion() ? (target ?? value) : 0,
  )

  useEffect(() => {
    if (target === null || prefersReducedMotion()) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const duration = 900
        const start = performance.now()
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          const eased = 1 - (1 - p) ** 3
          setDisplay(Math.round(eased * target))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  )
}
