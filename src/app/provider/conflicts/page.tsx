'use client'

import { AppShell } from '@/components/app-shell'
import { ConflictsView } from '@/components/conflicts-view'
import { FadeIn } from '@/components/motion/fade-in'
import { useStore } from '@/lib/store'

export default function ProviderConflictsPage () {
  const { currentProvider, t } = useStore()
  if (!currentProvider) return null
  return (
    <AppShell role="provider" title={t('conflicts')}>
      <FadeIn>
        <ConflictsView providerId={currentProvider.id} />
      </FadeIn>
    </AppShell>
  )
}
