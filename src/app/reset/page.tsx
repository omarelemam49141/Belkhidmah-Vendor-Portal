'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'
import { useStore } from '@/lib/store'

export default function ResetPage () {
  const router = useRouter()
  const { t } = useStore()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')

  return (
    <AuthShell title={t('setNewPassword')}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          setPasswordError('')
          setConfirmError('')
          if (!password) setPasswordError(t('enterPassword'))
          if (!confirm) setConfirmError(t('enterPassword'))
          if (!password || !confirm) return
          router.push('/')
        }}
      >
        <label className="block">
          <span className="field-label">{t('newPassword')}</span>
          <input
            className="field-input"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={passwordError ? true : undefined}
          />
          {passwordError ? <p className="mt-1 text-sm text-rose-300">{passwordError}</p> : null}
        </label>
        <label className="block">
          <span className="field-label">{t('confirmPassword')}</span>
          <input
            className="field-input"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={confirmError ? true : undefined}
          />
          {confirmError ? <p className="mt-1 text-sm text-rose-300">{confirmError}</p> : null}
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
        <button type="submit" className="btn-brand">
          {t('savePassword')}
        </button>
        <Link
          className="block text-sm font-medium text-brand-blush underline-offset-4 hover:text-white hover:underline"
          href="/"
        >
          {t('backToLogin')}
        </Link>
      </form>
    </AuthShell>
  )
}
