'use client'

import { AppShell } from '@/components/app-shell'
import { ConflictsView } from '@/components/conflicts-view'
import { FadeIn } from '@/components/motion/fade-in'
import { useStore } from '@/lib/store'

export default function AdminConflictsPage () {
  const { t } = useStore()
  return (
    <AppShell role="admin" title={t('conflicts')}>
      <FadeIn>
        <ConflictsView />
      </FadeIn>
    </AppShell>
  )
}
