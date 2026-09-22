'use client'

import { useParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { FadeIn } from '@/components/motion/fade-in'
import { PermissionsMatrix } from '@/components/permissions-matrix'
import { useStore } from '@/lib/store'
import { providerName } from '@/lib/logic'

export default function PermissionsPage () {
  const { id } = useParams<{ id: string }>()
  const { state, t } = useStore()
  const provider = state.providers.find((p) => p.id === id)
  const title = provider
    ? `${t('permissions')} · ${providerName(state, provider.id, state.locale)}`
    : t('permissions')
  return (
    <AppShell role="admin" title={title}>
      <FadeIn>
        {provider ? <PermissionsMatrix providerId={provider.id} /> : <p className="text-sm text-neutral-600">{t('notFound')}</p>}
      </FadeIn>
    </AppShell>
  )
}
