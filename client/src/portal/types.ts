// Mirrors the server's form definition and API shapes (server/src/form/schema.ts, applications.ts).

export type Data = Record<string, unknown>
export type Localized = { en: string; zh?: string }

export type Field = {
  id: string
  type:
    | 'text' | 'textarea' | 'email' | 'tel' | 'date' | 'number'
    | 'select' | 'yesno' | 'checkboxes' | 'checkbox' | 'group' | 'repeat' | 'note'
  label: Localized
  help?: Localized
  required?: boolean
  options?: { value: string; label: Localized }[]
  fields?: Field[]
  showIf?: { field: string; equals?: string; in?: string[] }
  max?: number
  half?: boolean
}

export type Step = { id: string; title: Localized; intro?: Localized; fields: Field[] }
export type FormSchema = { steps: Step[]; schoolYears: string[]; grades: string[] }

export type AppSummary = {
  id: string
  status: string
  schoolYear: string
  grade: string
  firstName: string | null
  lastName: string | null
  submittedAt: string | null
  stepsComplete: number
  stepsTotal: number
  itemsLeft: number
}

export type AppDetail = {
  application: {
    id: string
    status: string
    schoolYear: string
    grade: string
    firstName: string | null
    lastName: string | null
    submittedAt: string | null
  }
  sections: Record<string, { data: Data; isComplete: boolean }>
  checklist: { kind: string; status: string; completedAt: string | null }[]
  documents: { id: string; kind: string; name: string; size: number; createdAt: string }[]
  recommendations: {
    kind: string; name: string; email: string; requestedAt: string; expiresAt: string
    submittedAt: string | null; sendCount: number
  }[]
  interviews: { id: string; kind: string; status: string; startsAt: string; endsAt: string; location: string }[]
}

export const pick = (l: Localized, locale: 'en' | 'zh') => (locale === 'zh' && l.zh) || l.en

/** Mirrors the server's showIf rule so hidden questions stay hidden here too. */
export function isVisible(field: Field, scope: Data): boolean {
  const c = field.showIf
  if (!c) return true
  const v = scope[c.field]
  const flat = Array.isArray(v) ? v : [v]
  if (c.equals !== undefined) return flat.includes(c.equals)
  if (c.in) return flat.some((x) => typeof x === 'string' && c.in!.includes(x))
  return true
}
