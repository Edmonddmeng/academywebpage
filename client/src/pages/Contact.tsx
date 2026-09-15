import { useState, type FormEvent } from 'react'
import PageBanner from '../components/PageBanner'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      if (!res.ok) throw new Error()
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'mt-2 w-full border border-sand bg-white px-4 py-3 focus:border-brass focus:outline-none'

  return (
    <>
      <PageBanner
        eyebrow="Admission"
        title="Inquire"
        intro="Tell us about your student and we’ll be in touch about admission, visits, and athletics."
      />
      <section className="mx-auto max-w-2xl px-6 py-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-sm font-semibold">Name</span>
            <input name="name" required className={inputClass} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input name="email" type="email" required className={inputClass} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Message</span>
            <textarea name="message" rows={6} required className={inputClass} />
          </label>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-ink px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-brass disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send inquiry'}
          </button>
          {status === 'sent' && <p className="text-green-800">Thank you. We’ll be in touch soon.</p>}
          {status === 'error' && <p className="text-red-800">Something went wrong. Please try again.</p>}
        </form>
      </section>
    </>
  )
}
