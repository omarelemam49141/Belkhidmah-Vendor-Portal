'use client'

import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { PackageCard } from '@/components/package-card'
import { PlatformDrawer } from '@/components/platform-drawer'
import { FadeIn } from '@/components/motion/fade-in'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import {
  belkhidmahJobImpact,
  liveOnBelkhidmah,
  providerName,
  providerOnAppCounts
} from '@/lib/logic'
import { cityLabel } from '@/lib/i18n'
import type { Offering } from '@/lib/types'
import { cn } from '@/lib/utils'

const TABS = ['All', 'Hourly', 'Stay-in'] as const
const TAB_KEY = { All: 'tabAll', Hourly: 'tabHourly', 'Stay-in': 'tabStayIn' } as const
type PresenceFilter = 'all' | 'live' | 'leaving'

export default function PlatformPage () {
  const { state, setPlatform, runJob, reachSchedule, t } = useStore()
  const locale = state.locale
  const [jobNote, setJobNote] = useState<string | null>(null)
  const [tab, setTab] = useState<(typeof TABS)[number]>('All')
  const [search, setSearch] = useState('')
  const [providerId, setProviderId] = useState('all')
  const [city, setCity] = useState('all')
  const [presence, setPresence] = useState<PresenceFilter>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const onApp = useMemo(() => liveOnBelkhidmah(state.offerings), [state.offerings])
  const cities = [...new Set(onApp.map((o) => o.city))]

  useEffect(() => {
    if (!openId) return
    const stillOn = onApp.some((o) => o.id === openId)
    if (!stillOn) setOpenId(null)
  }, [onApp, openId])

  const filtered = useMemo(() => {
    return onApp.filter((o) => {
      if (tab === 'Hourly' && o.type !== 'hourly') return false
      if (tab === 'Stay-in' && o.type !== 'stay-in') return false
      if (providerId !== 'all' && o.providerId !== providerId) return false
      if (city !== 'all' && o.city !== city) return false
      if (presence === 'live' && o.hidden) return false
      if (presence === 'leaving' && !o.hidden) return false
      const q = search.trim().toLowerCase()
      if (q && !o.titleEn.toLowerCase().includes(q) && !o.titleAr.includes(q)) return false
      return true
    })
  }, [onApp, tab, search, providerId, city, presence])

  const grouped = useMemo(() => {
    const ids = providerId === 'all' ? state.providers.map((p) => p.id) : [providerId]
    return ids
      .map((id) => ({
        id,
        packages: filtered.filter((o) => o.providerId === id)
      }))
      .filter((g) => g.packages.length > 0)
  }, [filtered, providerId, state.providers])

  const emptySearch = filtered.length === 0 && search.trim().length > 0

  function runSync () {
    const impact = belkhidmahJobImpact(state.offerings)
    runJob()
    setJobNote(
      t('jobNote', {
        added: impact.movedToLive,
        removed: impact.removedFromPreview,
        unchanged: impact.unchanged
      })
    )
  }

  return (
    <AppShell role="admin" title={t('platform')}>
      <FadeIn>
        <p className="mb-4 max-w-2xl text-sm text-neutral-600">
          {t('platformHint')}
        </p>

        <section className="list-panel mb-6 space-y-3 p-4">
          <h2 className="font-extrabold text-neutral-900">{t('globalPublish')}</h2>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" className="accent-brand-magenta" checked={state.platform.now} onChange={(e) => setPlatform({ now: e.target.checked })} />
            {t('now')}
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" className="accent-brand-magenta" checked={state.platform.date} onChange={(e) => setPlatform({ date: e.target.checked })} />
            {t('onADate')}
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" className="accent-brand-magenta" checked={state.platform.next} onChange={(e) => setPlatform({ next: e.target.checked })} />
            {t('nextSync')}
          </label>
        </section>

        <section className="list-panel mb-6 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={runSync}>{t('runSync')}</Button>
            <Button type="button" variant="outline" onClick={reachSchedule}>{t('treatScheduled')}</Button>
            <p className="text-sm text-neutral-600">{t('lastJob', { job: state.lastJobAt ?? '—' })}</p>
          </div>
          {jobNote ? <p className="mt-3 text-sm text-brand-magenta">{jobNote}</p> : null}
        </section>

        <section className="mb-6 grid gap-3 md:grid-cols-2">
          {state.providers.map((p) => {
            const c = providerOnAppCounts(state.offerings, p.id)
            const selected = providerId === p.id
            return (
              <article
                key={p.id}
                className={cn(
                  'list-panel cursor-pointer p-4 transition-colors duration-150',
                  selected ? 'border-brand-blush bg-brand-blush' : 'hover:border-brand-magenta'
                )}
                onClick={() => setProviderId((cur) => (cur === p.id ? 'all' : p.id))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setProviderId((cur) => (cur === p.id ? 'all' : p.id))
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-neutral-900">{locale === 'ar' ? p.nameAr : p.nameEn}</h3>
                    <p className="text-xs text-neutral-500">{locale === 'ar' ? p.nameEn : p.nameAr}</p>
                  </div>
                  <span className={cn('rounded-full px-2 py-0.5 text-xs', p.active ? 'bg-brand-blush text-brand-magenta' : 'bg-neutral-100 text-neutral-700')}>
                    {p.active ? t('active') : t('inactive')}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  {([
                    ['onPlatform', c.onPlatform],
                    ['live', c.live],
                    ['leavingNext', c.leaving]
                  ] as const).map(([key, n]) => (
                    <div key={key} className="rounded-lg bg-neutral-50 p-2">
                      <p className="text-neutral-500">{t(key)}</p>
                      <p className="text-lg font-extrabold text-brand-magenta">{n}</p>
                    </div>
                  ))}
                </dl>
              </article>
            )
          })}
        </section>

        <section className="mb-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tabId) => (
              <Button
                key={tabId}
                type="button"
                size="sm"
                variant={tab === tabId ? 'selected' : 'outline'}
                onClick={() => setTab(tabId)}
              >
                {t(TAB_KEY[tabId])}
              </Button>
            ))}
          </div>
          <input
            className="filter-control w-full"
            placeholder={t('findPackage')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('findPackage')}
          />
          <div className="flex flex-wrap gap-2">
            <select
              className="filter-control"
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              aria-label={t('providers')}
            >
              <option value="all">{t('allProviders')}</option>
              {state.providers.map((p) => (
                <option key={p.id} value={p.id}>{providerName(state, p.id, locale)}</option>
              ))}
            </select>
            <select className="filter-control" value={city} onChange={(e) => setCity(e.target.value)} aria-label={t('city')}>
              <option value="all">{t('allCities')}</option>
              {cities.map((c) => (
                <option key={c} value={c}>{cityLabel(c, locale)}</option>
              ))}
            </select>
            <select
              className="filter-control"
              value={presence}
              onChange={(e) => setPresence(e.target.value as PresenceFilter)}
              aria-label={t('onPlatform')}
            >
              <option value="all">{t('allOnPlatform')}</option>
              <option value="live">{t('live')}</option>
              <option value="leaving">{t('leavingNext')}</option>
            </select>
          </div>
        </section>

        {emptySearch ? (
          <p className="text-sm text-neutral-600">{t('noPackagesMatch')}</p>
        ) : grouped.length === 0 ? (
          <p className="text-sm text-neutral-500">{t('noPackagesOnBelkhidmah')}</p>
        ) : (
          <div className="space-y-8">
            {grouped.map((g) => (
              <section key={g.id}>
                {providerId === 'all' ? (
                  <h3 className="mb-3 font-extrabold text-neutral-900">{providerName(state, g.id, locale)}</h3>
                ) : null}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {g.packages.map((o: Offering) => (
                    <PackageCard
                      key={o.id}
                      offering={o}
                      onOpen={() => setOpenId(o.id)}
                      selected={openId === o.id}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {openId ? <PlatformDrawer offeringId={openId} onClose={() => setOpenId(null)} /> : null}
      </FadeIn>
    </AppShell>
  )
}
