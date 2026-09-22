import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useLocale } from '../content/locale'
import { ApiError, api } from '../auth/api'
import { useAuth } from '../auth/AuthContext'

type Mode = 'signin' | 'signup' | 'verify' | 'forgot' | 'reset'

const copy = {
  en: {
    intro: 'Sign in or create an account to start and manage your application.',
    signin: 'Sign in',
    signup: 'Create account',
    verify: 'Verify your email',
    forgot: 'Reset your password',
    reset: 'Choose a new password',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    password: 'Password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    passwordHint: 'At least 12 characters. A short phrase works well.',
    code: 'Verification code',
    verifyIntro: (email: string) => `We sent a code to ${email}. Enter it below to continue.`,
    resetIntro: (email: string) => `If ${email} has an account, we sent a code to it. Enter it with your new password.`,
    forgotIntro: 'Enter your email and we’ll send you a code to reset your password.',
    submitSignin: 'Sign in',
    submitSignup: 'Create account',
    submitVerify: 'Verify and continue',
    submitForgot: 'Send code',
    submitReset: 'Update password and sign in',
    working: 'One moment…',
    resend: 'Send a new code',
    resent: 'A new code is on its way.',
    forgotLink: 'Forgot your password?',
    toSignup: 'New here? Create an account',
    toSignin: 'Already have an account? Sign in',
    back: 'Back to sign in',
    unverified: 'Please verify your email first. We sent you a new code.',
    errors: {
      invalid_credentials: 'Incorrect email or password.',
      mismatch: 'The passwords don’t match.',
      invalid_code: 'That code is invalid or has expired.',
      weak_password: 'Please choose a stronger password (at least 12 characters, not a common one).',
      rate_limited: 'Too many attempts. Please wait a few minutes and try again.',
      validation: 'Please check your details and try again.',
      signup_failed: 'We couldn’t create that account. Please try again.',
      email_failed: 'We couldn’t send the email. Please try again in a moment.',
      error: 'Something went wrong. Please try again.',
    } as Record<string, string>,
  },
  zh: {
    intro: '登录或创建账户，开始并管理您的申请。',
    signin: '登录',
    signup: '创建账户',
    verify: '验证邮箱',
    forgot: '重置密码',
    reset: '设置新密码',
    firstName: '名',
    lastName: '姓',
    email: '邮箱',
    password: '密码',
    newPassword: '新密码',
    confirmPassword: '确认密码',
    passwordHint: '至少 12 个字符，使用一句简短的话会更容易记住。',
    code: '验证码',
    verifyIntro: (email: string) => `我们已向 ${email} 发送验证码，请在下方输入以继续。`,
    resetIntro: (email: string) => `如果 ${email} 已注册，我们已向该邮箱发送验证码。请输入验证码和新密码。`,
    forgotIntro: '请输入您的邮箱，我们会发送验证码以重置密码。',
    submitSignin: '登录',
    submitSignup: '创建账户',
    submitVerify: '验证并继续',
    submitForgot: '发送验证码',
    submitReset: '更新密码并登录',
    working: '请稍候……',
    resend: '重新发送验证码',
    resent: '新的验证码已发送。',
    forgotLink: '忘记密码？',
    toSignup: '首次使用？创建账户',
    toSignin: '已有账户？登录',
    back: '返回登录',
    unverified: '请先验证您的邮箱，我们已重新发送验证码。',
    errors: {
      invalid_credentials: '邮箱或密码不正确。',
      mismatch: '两次输入的密码不一致。',
      invalid_code: '验证码无效或已过期。',
      weak_password: '请设置更安全的密码（至少 12 个字符，且不能是常见密码）。',
      rate_limited: '尝试次数过多，请稍等几分钟后重试。',
      validation: '请检查您填写的信息后重试。',
      signup_failed: '无法创建该账户，请重试。',
      email_failed: '邮件发送失败，请稍后重试。',
      error: '出现问题，请重试。',
    } as Record<string, string>,
  },
}

const inputClass = 'mt-2 w-full border border-sand bg-white px-4 py-3 focus:border-brass focus:outline-none'
const buttonClass =
  'w-full bg-ink px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-brass disabled:opacity-60'
const linkClass = 'text-sm text-ink underline underline-offset-4 hover:text-brass'

export default function Login() {
  const locale = useLocale()
  const t = copy[locale]
  const navigate = useNavigate()
  const { user, refresh } = useAuth()

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  if (user) return <Navigate to="/portal" replace />

  function go(next: Mode) {
    setMode(next)
    setError(null)
    setNotice(null)
  }

  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await action()
    } catch (e) {
      const code = e instanceof ApiError ? e.code : 'error'
      setError(t.errors[code] ?? t.errors.error)
    } finally {
      setBusy(false)
    }
  }

  async function finishSignIn() {
    await refresh()
    navigate('/portal', { replace: true })
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const value = (name: string) => String(f.get(name) ?? '')

    if ((mode === 'signup' || mode === 'reset') && value('password') !== value('confirmPassword')) {
      setError(t.errors.mismatch)
      return
    }

    void run(async () => {
      if (mode === 'signin') {
        const submitted = value('email')
        try {
          await api('/auth/login', { email: submitted, password: value('password') })
        } catch (err) {
          if (err instanceof ApiError && err.code === 'email_not_confirmed') {
            setEmail(submitted)
            await api('/auth/resend', { email: submitted, locale })
            go('verify')
            setNotice(t.unverified)
            return
          }
          throw err
        }
        await finishSignIn()
      } else if (mode === 'signup') {
        const submitted = value('email')
        await api('/auth/signup', {
          email: submitted,
          password: value('password'),
          firstName: value('firstName'),
          lastName: value('lastName'),
          locale,
        })
        setEmail(submitted)
        go('verify')
      } else if (mode === 'verify') {
        await api('/auth/verify', { email, code: value('code') })
        await finishSignIn()
      } else if (mode === 'forgot') {
        const submitted = value('email')
        await api('/auth/forgot', { email: submitted, locale })
        setEmail(submitted)
        go('reset')
      } else {
        await api('/auth/reset-password', { email, code: value('code'), password: value('password') })
        await finishSignIn()
      }
    })
  }

  const resend = () =>
    run(async () => {
      await api('/auth/resend', { email, locale })
      setNotice(t.resent)
    })

  const codeField = (
    <label className="block">
      <span className="text-sm font-semibold">{t.code}</span>
      <input
        name="code"
        required
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6,10}"
        maxLength={10}
        className={`${inputClass} tracking-[0.4em]`}
      />
    </label>
  )

  const passwordField = (label: string, autoComplete: 'current-password' | 'new-password') => (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        name="password"
        type="password"
        required
        minLength={autoComplete === 'new-password' ? 12 : undefined}
        maxLength={128}
        autoComplete={autoComplete}
        className={inputClass}
      />
      {autoComplete === 'new-password' && <span className="mt-1 block text-sm text-ink/60">{t.passwordHint}</span>}
    </label>
  )

  const confirmField = (
    <label className="block">
      <span className="text-sm font-semibold">{t.confirmPassword}</span>
      <input
        name="confirmPassword"
        type="password"
        required
        maxLength={128}
        autoComplete="new-password"
        className={inputClass}
      />
    </label>
  )

  const emailField = (
    <label className="block">
      <span className="text-sm font-semibold">{t.email}</span>
      <input name="email" type="email" required autoComplete="email" maxLength={254} className={inputClass} />
    </label>
  )

  return (
    <div className="w-full max-w-md border border-sand bg-white p-8 shadow-[0_10px_40px_rgba(18,61,40,0.08)] sm:p-10">
      <h1 className="font-serif text-3xl">{t[mode]}</h1>
      {mode === 'signin' && <p className="mt-3 text-ink/70">{t.intro}</p>}
      {mode === 'verify' && <p className="mt-3 text-ink/70">{t.verifyIntro(email)}</p>}
      {mode === 'forgot' && <p className="mt-3 text-ink/70">{t.forgotIntro}</p>}
      {mode === 'reset' && <p className="mt-3 text-ink/70">{t.resetIntro(email)}</p>}

      <form onSubmit={onSubmit} className="mt-8 space-y-6" key={mode}>
        {mode === 'signup' && (
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">{t.firstName}</span>
              <input name="firstName" required autoComplete="given-name" maxLength={50} className={inputClass} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{t.lastName}</span>
              <input name="lastName" required autoComplete="family-name" maxLength={50} className={inputClass} />
            </label>
          </div>
        )}
        {(mode === 'signin' || mode === 'signup' || mode === 'forgot') && emailField}
        {mode === 'signin' && passwordField(t.password, 'current-password')}
        {mode === 'signup' && passwordField(t.password, 'new-password')}
        {mode === 'signup' && confirmField}
        {(mode === 'verify' || mode === 'reset') && codeField}
        {mode === 'reset' && passwordField(t.newPassword, 'new-password')}
        {mode === 'reset' && confirmField}

        <button type="submit" disabled={busy} className={buttonClass}>
          {busy
            ? t.working
            : {
                signin: t.submitSignin,
                signup: t.submitSignup,
                verify: t.submitVerify,
                forgot: t.submitForgot,
                reset: t.submitReset,
              }[mode]}
        </button>

        <div aria-live="polite">
          {error && <p className="text-red-800">{error}</p>}
          {notice && <p className="text-green-800">{notice}</p>}
        </div>
      </form>

      <div className="mt-8 flex flex-col items-start gap-3">
        {mode === 'signin' && (
          <>
            <button type="button" onClick={() => go('forgot')} className={linkClass}>
              {t.forgotLink}
            </button>
            <button type="button" onClick={() => go('signup')} className={linkClass}>
              {t.toSignup}
            </button>
          </>
        )}
        {mode === 'signup' && (
          <button type="button" onClick={() => go('signin')} className={linkClass}>
            {t.toSignin}
          </button>
        )}
        {mode === 'verify' && (
          <button type="button" onClick={resend} disabled={busy} className={linkClass}>
            {t.resend}
          </button>
        )}
        {(mode === 'verify' || mode === 'forgot' || mode === 'reset') && (
          <button type="button" onClick={() => go('signin')} className={linkClass}>
            {t.back}
          </button>
        )}
      </div>
    </div>
  )
}
