import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** Stagger delay in ms, applied via CSS transition-delay. */
  delay?: number
  as?: ElementType
  [key: string]: unknown
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Fades and lifts content into place the first time it scrolls into view.
// Renders already-visible (no animation) for prefers-reduced-motion.
export default function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
  ...rest
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(prefersReducedMotion)

  useEffect(() => {
    if (visible) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
    // Only needs to run once on mount; `visible` flipping to true disconnects itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tag
      ref={ref}
      {...rest}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </Tag>
  )
}
