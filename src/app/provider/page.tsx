'use client'

import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { ClientPreview } from '@/components/client-preview'
import { FadeIn } from '@/components/motion/fade-in'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { counts } from '@/lib/logic'

export default function ProviderHomePage () {
  const { currentProvider, state, t } = useStore()
  if (!currentProvider) return null
  const c = counts(state.offerings, state.comingSoon, currentProvider.id)
  const stats: Array<[string, number]> = [
    ['ready', c.ready],
    ['live', c.live],
    ['hidden', c.hidden],
    ['conflict', c.conflict]
  ]

  return (
    <AppShell role="provider" title={t('home')}>
      <FadeIn>
        <p className="mb-5 text-neutral-600">{t('homeLead')}</p>
        {currentProvider.canRefreshCrm ? (
          <div className="mb-5 flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/provider/refresh">{t('refreshMyCrm')}</Link>
            </Button>
          </div>
        ) : null}
        <div className="mb-5 grid gap-3 sm:grid-cols-4">
          {stats.map(([key, n]) => (
            <article key={key} className="stat-card">
              <p className="stat-card-label">{t(key)}</p>
              <p className="stat-card-value">{n}</p>
            </article>
          ))}
        </div>
        <p className="mb-5 text-sm text-neutral-600">{t('lastPullJob', { pull: currentProvider.lastPullAt ?? '—', job: state.lastJobAt ?? '—' })}</p>
        <ClientPreview providerId={currentProvider.id} />
      </FadeIn>
    </AppShell>
  )
}
