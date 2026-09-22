import { isVisible, pick, type Data, type Field } from './types'

const isObject = (v: unknown): v is Data => typeof v === 'object' && v !== null && !Array.isArray(v)

function show(field: Field, v: unknown): string {
  if (field.type === 'yesno') return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : ''
  if (field.type === 'checkbox') return v === true ? 'Yes' : ''
  if (field.type === 'select') return field.options?.find((o) => o.value === v)?.label.en ?? String(v ?? '')
  if (field.type === 'checkboxes' && Array.isArray(v)) {
    return v.map((x) => field.options?.find((o) => o.value === x)?.label.en ?? String(x)).join(', ')
  }
  return v === undefined || v === null ? '' : String(v)
}

// A plain read-only rendering of an application's answers, driven by the same form definition
// the family filled in — so staff always see the question wording next to each answer.
export default function ReadOnly({ fields, value }: { fields: Field[]; value: Data }) {
  return (
    <dl className="space-y-3">
      {fields
        .filter((f) => f.type !== 'note' && isVisible(f, value))
        .map((f) => {
          const v = value[f.id]
          if (f.type === 'group') {
            return isObject(v) ? (
              <div key={f.id} className="border-l-2 border-sand pl-4">
                <dt className="font-semibold">{pick(f.label, 'en')}</dt>
                <dd className="mt-2"><ReadOnly fields={f.fields ?? []} value={v} /></dd>
              </div>
            ) : null
          }
          if (f.type === 'repeat') {
            return Array.isArray(v) && v.length ? (
              <div key={f.id}>
                <dt className="font-semibold">{pick(f.label, 'en')}</dt>
                {v.map((item, i) => (
                  <dd key={i} className="mt-2 border-l-2 border-sand pl-4">
                    <p className="text-sm text-ink/60">#{i + 1}</p>
                    <ReadOnly fields={f.fields ?? []} value={isObject(item) ? item : {}} />
                  </dd>
                ))}
              </div>
            ) : null
          }
          const text = show(f, v)
          return text ? (
            <div key={f.id}>
              <dt className="text-sm text-ink/60">{pick(f.label, 'en')}</dt>
              <dd className="whitespace-pre-wrap">{text}</dd>
            </div>
          ) : null
        })}
    </dl>
  )
}
