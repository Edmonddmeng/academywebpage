import { useLocale } from '../content/locale'
import { isVisible, pick, type Data, type Field } from './types'

const copy = {
  en: { required: 'This field is required.', invalid: 'Please enter a valid value.', yes: 'Yes', no: 'No', choose: 'Select…', add: 'Add', remove: 'Remove' },
  zh: { required: '此项为必填。', invalid: '请输入有效内容。', yes: '是', no: '否', choose: '请选择……', add: '添加', remove: '删除' },
}

const inputClass =
  'mt-2 w-full border border-sand bg-white px-4 py-3 focus:border-brass focus:outline-none aria-[invalid=true]:border-red-700'

type Props = {
  fields: Field[]
  value: Data
  onChange: (next: Data) => void
  /** Field errors keyed by dotted path (e.g. "parent1.email", "siblings.0.name"). */
  errors: Record<string, string>
  prefix?: string
}

// Renders whatever fields the server describes, so adding or changing a question needs no client work.
export default function FormEngine({ fields, value, onChange, errors, prefix = '' }: Props) {
  const locale = useLocale()
  const t = copy[locale]

  const set = (id: string, v: unknown) => {
    const next = { ...value }
    if (v === undefined || v === '') delete next[id]
    else next[id] = v
    onChange(next)
  }

  return (
    <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
      {fields
        .filter((f) => isVisible(f, value))
        .map((f) => {
          const path = prefix + f.id
          const err = errors[path]
          const label = pick(f.label, locale)
          const help = f.help && pick(f.help, locale)
          const cur = value[f.id]
          const span = f.half ? '' : 'sm:col-span-2'
          const title = (
            <span className="text-sm font-semibold">
              {label}
              {f.required && <span className="text-red-800"> *</span>}
            </span>
          )
          const hint = help && <span className="mt-1 block text-sm text-ink/60">{help}</span>
          const message = err && (
            <span role="alert" className="mt-1 block text-sm text-red-800">
              {err === 'invalid' ? t.invalid : t.required}
            </span>
          )
          const wrap = (children: React.ReactNode) => (
            <div key={f.id} className={span} data-invalid={err ? 'true' : undefined}>
              {children}
            </div>
          )

          switch (f.type) {
            case 'note':
              return wrap(
                <div className="border-l-2 border-brass bg-ivory p-5">
                  <p className="font-serif text-lg">{label}</p>
                  {help && <p className="mt-2 text-ink/80">{help}</p>}
                </div>,
              )

            case 'group':
              return wrap(
                <fieldset className="border-t border-sand pt-6">
                  <legend className="pr-4 font-serif text-xl">{label}</legend>
                  <div className="mt-4">
                    <FormEngine
                      fields={f.fields ?? []}
                      value={(cur as Data) ?? {}}
                      onChange={(v) => set(f.id, v)}
                      errors={errors}
                      prefix={`${path}.`}
                    />
                  </div>
                </fieldset>,
              )

            case 'repeat': {
              const items = Array.isArray(cur) ? (cur as Data[]) : []
              const max = f.max ?? 6
              return wrap(
                <fieldset className="border-t border-sand pt-6">
                  <legend className="pr-4 font-serif text-xl">
                    {label}
                    {f.required && <span className="text-red-800"> *</span>}
                  </legend>
                  {help && <p className="mt-2 text-sm text-ink/60">{help}</p>}
                  {message}
                  <div className="mt-4 space-y-4">
                    {items.map((item, i) => (
                      <div key={i} className="border border-sand bg-ivory/50 p-5">
                        <FormEngine
                          fields={f.fields ?? []}
                          value={item}
                          onChange={(v) => set(f.id, items.map((x, j) => (j === i ? v : x)))}
                          errors={errors}
                          prefix={`${path}.${i}.`}
                        />
                        <button
                          type="button"
                          onClick={() => set(f.id, items.filter((_, j) => j !== i))}
                          className="mt-4 text-sm text-ink underline underline-offset-4 hover:text-brass"
                        >
                          {t.remove}
                        </button>
                      </div>
                    ))}
                  </div>
                  {items.length < max && (
                    <button
                      type="button"
                      onClick={() => set(f.id, [...items, {}])}
                      className="mt-4 border border-ink px-5 py-2 text-sm font-semibold tracking-[0.12em] uppercase transition-colors hover:bg-ink hover:text-white"
                    >
                      + {t.add}
                    </button>
                  )}
                </fieldset>,
              )
            }

            case 'yesno':
              return wrap(
                <fieldset>
                  <legend>{title}</legend>
                  {hint}
                  <div className="mt-2 flex gap-8">
                    {(['yes', 'no'] as const).map((v) => (
                      <label key={v} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={path}
                          checked={cur === v}
                          onChange={() => set(f.id, v)}
                          className="h-4 w-4 accent-ink"
                        />
                        {t[v]}
                      </label>
                    ))}
                  </div>
                  {message}
                </fieldset>,
              )

            case 'checkboxes': {
              const picked = Array.isArray(cur) ? (cur as string[]) : []
              return wrap(
                <fieldset>
                  <legend>{title}</legend>
                  {hint}
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {f.options?.map((o) => (
                      <label key={o.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={picked.includes(o.value)}
                          onChange={(e) =>
                            set(f.id, e.target.checked ? [...picked, o.value] : picked.filter((x) => x !== o.value))
                          }
                          className="h-4 w-4 accent-ink"
                        />
                        {pick(o.label, locale)}
                      </label>
                    ))}
                  </div>
                  {message}
                </fieldset>,
              )
            }

            case 'checkbox':
              return wrap(
                <div>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={cur === true}
                      onChange={(e) => set(f.id, e.target.checked ? true : undefined)}
                      className="mt-1 h-4 w-4 accent-ink"
                    />
                    {title}
                  </label>
                  {message}
                </div>,
              )

            case 'select':
              return wrap(
                <label className="block">
                  {title}
                  <select
                    value={typeof cur === 'string' ? cur : ''}
                    onChange={(e) => set(f.id, e.target.value)}
                    aria-invalid={!!err}
                    className={inputClass}
                  >
                    <option value="">{t.choose}</option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {pick(o.label, locale)}
                      </option>
                    ))}
                  </select>
                  {hint}
                  {message}
                </label>,
              )

            case 'textarea':
              return wrap(
                <label className="block">
                  {title}
                  <textarea
                    rows={6}
                    maxLength={f.max ?? 4000}
                    value={typeof cur === 'string' ? cur : ''}
                    onChange={(e) => set(f.id, e.target.value)}
                    aria-invalid={!!err}
                    className={inputClass}
                  />
                  {hint}
                  {message}
                </label>,
              )

            default: {
              // text, email, tel, date, number
              const type = f.type === 'number' ? 'text' : f.type
              return wrap(
                <label className="block">
                  {title}
                  <input
                    type={type}
                    inputMode={f.type === 'number' ? 'numeric' : undefined}
                    maxLength={f.type === 'date' ? undefined : (f.max ?? 200)}
                    max={f.id === 'dob' ? new Date().toISOString().slice(0, 10) : undefined}
                    value={cur === undefined || cur === null ? '' : String(cur)}
                    onChange={(e) => set(f.id, e.target.value)}
                    aria-invalid={!!err}
                    autoComplete="off"
                    className={inputClass}
                  />
                  {hint}
                  {message}
                </label>,
              )
            }
          }
        })}
    </div>
  )
}
