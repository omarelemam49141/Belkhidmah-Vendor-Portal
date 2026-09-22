'use client'

import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { CatalogView } from '@/components/catalog-view'
import { FadeIn } from '@/components/motion/fade-in'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'

export default function MyPackagesPage () {
  const { currentProvider, state, t } = useStore()
  if (!currentProvider) return null
  const offerings = state.offerings.filter((o) => o.providerId === currentProvider.id)
  return (
    <AppShell role="provider" title={t('myPackages')}>
      <FadeIn>
        {currentProvider.canRefreshCrm ? (
          <Button asChild variant="outline" className="mb-5">
            <Link href="/provider/refresh">{t('refreshMyCrm')}</Link>
          </Button>
        ) : null}
        <CatalogView
          offerings={offerings}
          baseHref="/provider/packages"
          showComingSoon
          showAdminFilters={false}
        />
      </FadeIn>
    </AppShell>
  )
}
