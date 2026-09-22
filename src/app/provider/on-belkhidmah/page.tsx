'use client'

import { AppShell } from '@/components/app-shell'
import { CompareCatalog } from '@/components/compare-catalog'
import { FadeIn } from '@/components/motion/fade-in'
import { useStore } from '@/lib/store'

export default function OnBelkhidmahPage () {
  const { currentProvider, state, t } = useStore()
  if (!currentProvider) return null
  const offerings = state.offerings.filter((o) => o.providerId === currentProvider.id)
  const comingSoon = state.comingSoon.filter((c) => c.providerId === currentProvider.id)
  return (
    <AppShell role="provider" title={t('onBelkhidmah')}>
      <FadeIn>
        <CompareCatalog
          offerings={offerings}
          comingSoon={comingSoon}
          packageHref={(id) => `/provider/packages/${id}`}
        />
      </FadeIn>
    </AppShell>
  )
}
