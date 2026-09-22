'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { FadeIn } from '@/components/motion/fade-in'
import { ProviderForm } from '@/components/provider-form'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { providerName } from '@/lib/logic'

export default function EditProviderPage () {
  const { id } = useParams<{ id: string }>()
  const { state, t } = useStore()
  const provider = state.providers.find((p) => p.id === id)
  if (!provider) {
    return (
      <AppShell role="admin" title={t('providers')}>
        <p className="text-sm text-neutral-600">{t('notFound')}</p>
      </AppShell>
    )
  }
  return (
    <AppShell role="admin" title={providerName(state, provider.id, state.locale)}>
      <FadeIn>
        <div className="mb-4">
          <Button asChild variant="outline">
            <Link href={`/admin/providers/${provider.id}/permissions`}>{t('permissions')}</Link>
          </Button>
        </div>
        <ProviderForm existing={provider} />
      </FadeIn>
    </AppShell>
  )
}
