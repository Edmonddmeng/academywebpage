import type { CSSProperties, ReactNode } from 'react'

// Lays out `items` as a grid that is never left with a lone, narrow item
// orphaned in an otherwise-empty trailing row. Unlike `auto-fit`, which
// shares one set of column tracks across every row (so a single leftover
// item still only fills one narrow track), this splits the items into a
// "full rows" group and a "leftover row" group, and gives the leftover
// row its own column count equal to its own item count — so it always
// stretches edge to edge instead of sitting in a corner.
//
// `children` must return the complete item element (e.g. a keyed `<li>`),
// the same as a normal `.map()` callback.
export function EvenGrid<T>({
  items,
  maxCols,
  gap = 'gap-1.5',
  rowGap,
  as = 'ul',
  className = '',
  children,
}: {
  items: T[]
  maxCols: number
  gap?: string
  rowGap?: string
  as?: 'ul' | 'ol'
  className?: string
  children: (item: T, index: number) => ReactNode
}) {
  if (items.length === 0) return null

  const cols = Math.max(1, Math.min(maxCols, items.length))
  const remCount = items.length % cols
  const fullCount = items.length - remCount
  const rows: { slice: T[]; cols: number; offset: number }[] = []
  if (fullCount > 0) rows.push({ slice: items.slice(0, fullCount), cols, offset: 0 })
  if (remCount > 0) rows.push({ slice: items.slice(fullCount), cols: remCount, offset: fullCount })

  const As = as
  const rowClass = `grid grid-cols-1 ${gap} sm:[grid-template-columns:var(--even-grid-cols)] ${className}`
  const rowStyle = (n: number) => ({ '--even-grid-cols': `repeat(${n}, minmax(0, 1fr))` }) as CSSProperties

  if (rows.length === 1) {
    const row = rows[0]
    return (
      <As className={rowClass} style={rowStyle(row.cols)}>
        {row.slice.map((item, i) => children(item, row.offset + i))}
      </As>
    )
  }

  return (
    <div className={rowGap ?? gap.replace('gap-', 'space-y-')}>
      {rows.map((row, ri) => (
        <As key={ri} className={rowClass} style={rowStyle(row.cols)}>
          {row.slice.map((item, i) => children(item, row.offset + i))}
        </As>
      ))}
    </div>
  )
}
