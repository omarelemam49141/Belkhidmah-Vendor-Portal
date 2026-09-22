'use client'

import { AppShell } from '@/components/app-shell'
import { FadeIn } from '@/components/motion/fade-in'
import { ProviderForm } from '@/components/provider-form'
import { useStore } from '@/lib/store'

export default function NewProviderPage () {
  const { t } = useStore()
  return (
    <AppShell role="admin" title={t('addProvider')}>
      <FadeIn>
        <ProviderForm />
      </FadeIn>
    </AppShell>
  )
}
