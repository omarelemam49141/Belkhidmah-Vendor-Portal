'use client'

import { AppShell } from '@/components/app-shell'
import { FadeIn } from '@/components/motion/fade-in'
import { PullForm } from '@/components/pull-form'
import { useStore } from '@/lib/store'

export default function PullPage () {
  const { t } = useStore()
  return (
    <AppShell role="admin" title={t('pullCrm')}>
      <FadeIn>
        <PullForm />
      </FadeIn>
    </AppShell>
  )
}
