'use client'

import { AppShell } from '@/components/app-shell'
import { FadeIn } from '@/components/motion/fade-in'
import { PullForm } from '@/components/pull-form'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RefreshPage () {
  const { currentProvider, ready, t } = useStore()
  const router = useRouter()
  useEffect(() => {
    if (ready && currentProvider && !currentProvider.canRefreshCrm) router.replace('/provider/packages')
  }, [ready, currentProvider, router])
  if (!currentProvider?.canRefreshCrm) return null
  return (
    <AppShell role="provider" title={t('refreshMyCrm')}>
      <FadeIn>
        <PullForm lockedProviderId={currentProvider.id} />
      </FadeIn>
    </AppShell>
  )
}
