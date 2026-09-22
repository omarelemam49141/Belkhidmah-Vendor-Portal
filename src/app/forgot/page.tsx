'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'
import { useStore } from '@/lib/store'

export default function ForgotPage () {
  const { t } = useStore()
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  return (
    <AuthShell title={t('forgot')}>
      {!sent ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            setEmailError('')
            if (!email.trim()) {
              setEmailError(t('enterEmail'))
              return
            }
            setSent(true)
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
          <button type="submit" className="btn-brand">
            {t('sendReset')}
          </button>
          <Link
            className="block text-sm font-medium text-brand-blush underline-offset-4 hover:text-white hover:underline"
            href="/"
          >
            {t('backToLogin')}
          </Link>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-white/80">{t('resetReady')}</p>
          <Link className="btn-brand" href="/reset">
            {t('setNewPassword')}
          </Link>
          <Link
            className="block text-sm font-medium text-brand-blush underline-offset-4 hover:text-white hover:underline"
            href="/"
          >
            {t('backToLogin')}
          </Link>
        </div>
      )}
    </AuthShell>
  )
}
