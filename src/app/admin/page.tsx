'use client'

import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { ClientPreview } from '@/components/client-preview'
import { FadeIn } from '@/components/motion/fade-in'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { counts } from '@/lib/logic'

export default function AdminHomePage () {
  const { state, restoreDemo, t } = useStore()
  const c = counts(state.offerings, state.comingSoon)
  const stats: Array<[string, number]> = [
    ['providers', state.providers.length],
    ['ready', c.ready],
    ['live', c.live],
    ['hidden', c.hidden],
    ['conflict', c.conflict],
    ['missing', c.missing]
  ]

  return (
    <AppShell role="admin" title={t('home')}>
      <FadeIn>
        <p className="mb-5 text-neutral-600">{t('homeLead')}</p>
        <div className="mb-5 flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={restoreDemo}>{t('restore')}</Button>
          <Button asChild variant="outline"><Link href="/admin/pull">{t('pullCrm')}</Link></Button>
          <Button asChild variant="outline"><Link href="/admin/providers">{t('providers')}</Link></Button>
          <Button asChild variant="outline"><Link href="/admin/catalog">{t('catalog')}</Link></Button>
          <Button asChild variant="outline"><Link href="/admin/mock-crm">{t('mockCrm')}</Link></Button>
        </div>
        <div className="mb-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(([key, n]) => (
            <article key={key} className="stat-card">
              <p className="stat-card-label">{t(key)}</p>
              <p className="stat-card-value">{n}</p>
            </article>
          ))}
        </div>
        <p className="mb-5 text-sm text-neutral-600">{t('lastPullJob', { pull: state.lastPullAt ?? '—', job: state.lastJobAt ?? '—' })}</p>
        <ClientPreview />
      </FadeIn>
    </AppShell>
  )
}
