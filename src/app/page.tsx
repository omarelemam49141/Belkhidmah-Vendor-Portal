'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'
import { useStore } from '@/lib/store'

export default function LoginPage () {
  const { login, t, currentUser, ready } = useStore()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [formError, setFormError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (ready && currentUser) {
      router.replace(currentUser.role === 'admin' ? '/admin' : '/provider')
    }
  }, [ready, currentUser, router])

  return (
    <AuthShell title={t('brandTitle')} description={t('demoHint')}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          setFormError('')
          setEmailError('')
          setPasswordError('')
          if (!email.trim()) setEmailError(t('enterEmail'))
          if (!password) setPasswordError(t('enterPassword'))
          if (!email.trim() || !password) return
          const result = login(email, password)
          if (result === 'bad') setFormError(t('badLogin'))
          if (result === 'inactive') router.push('/inactive')
          if (result === 'ok') router.push(email.toLowerCase().includes('admin') ? '/admin' : '/provider')
        }}
      >
        <label className="block">
          <span className="field-label">{t('email')}</span>
          <input
            className="field-input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={emailError ? true : undefined}
          />
          {emailError ? <p className="mt-1 text-sm text-rose-300">{emailError}</p> : null}
        </label>
        <label className="block">
          <span className="field-label">{t('password')}</span>
          <input
            className="field-input"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={passwordError ? true : undefined}
          />
          {passwordError ? <p className="mt-1 text-sm text-rose-300">{passwordError}</p> : null}
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            className="size-4 accent-brand-pink"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
          />
          {t('showPassword')}
        </label>
        {formError ? (
          <p className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-sm text-rose-200" role="alert">
            {formError}
          </p>
        ) : null}
        <button type="submit" className="btn-brand">
          {t('signIn')}
        </button>
        <Link
          className="block text-sm font-medium text-brand-blush underline-offset-4 hover:text-white hover:underline"
          href="/forgot"
        >
          {t('forgot')}
        </Link>
      </form>
    </AuthShell>
  )
}
