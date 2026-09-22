import { useState, type FormEvent } from 'react'
import PageBanner from '../components/PageBanner'
import { bannerFor } from '../content/banners'
import { useLocale } from '../content/locale'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const copy = {
  en: {
    eyebrow: 'Admission',
    title: 'Inquire',
    intro: 'Tell us about your athlete and we’ll be in touch about admission, visits, and training.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    sending: 'Sending…',
    send: 'Send inquiry',
    sent: 'Thank you. We’ll be in touch soon.',
    error: 'Something went wrong. Please try again.',
  },
  zh: {
    eyebrow: '招生',
    title: '咨询',
    intro: '告诉我们您孩子的情况，我们会就招生、参观与训练与您联系。',
    name: '姓名',
    email: '邮箱',
    message: '留言',
    sending: '发送中……',
    send: '发送咨询',
    sent: '感谢您的咨询，我们会尽快与您联系。',
    error: '出现问题，请重试。',
  },
}

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const t = copy[useLocale()]

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
      <PageBanner eyebrow={t.eyebrow} title={t.title} intro={t.intro} image={bannerFor('admission')} />
      <section className="mx-auto max-w-2xl px-6 py-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-sm font-semibold">{t.name}</span>
            <input name="name" required className={inputClass} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{t.email}</span>
            <input name="email" type="email" required className={inputClass} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{t.message}</span>
            <textarea name="message" rows={6} required className={inputClass} />
          </label>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-ink px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-brass disabled:opacity-60"
          >
            {status === 'sending' ? t.sending : t.send}
          </button>
          {status === 'sent' && <p className="text-green-800">{t.sent}</p>}
          {status === 'error' && <p className="text-red-800">{t.error}</p>}
        </form>
      </section>
    </>
  )
}
