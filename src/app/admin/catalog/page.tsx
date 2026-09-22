'use client'

import { AppShell } from '@/components/app-shell'
import { CatalogView } from '@/components/catalog-view'
import { FadeIn } from '@/components/motion/fade-in'
import { useStore } from '@/lib/store'

export default function CatalogPage () {
  const { state, t } = useStore()
  return (
    <AppShell role="admin" title={t('catalog')}>
      <FadeIn>
        <CatalogView offerings={state.offerings} baseHref="/admin/packages" showComingSoon showAdminFilters />
      </FadeIn>
    </AppShell>
  )
}
