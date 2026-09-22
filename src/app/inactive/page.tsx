'use client'

import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'
import { useStore } from '@/lib/store'

export default function InactivePage () {
  const { t } = useStore()

  return (
    <AuthShell title={t('inactiveAccount')}>
      <div className="space-y-4">
        <Link className="btn-brand" href="/">
          {t('backToLogin')}
        </Link>
      </div>
    </AuthShell>
  )
}
