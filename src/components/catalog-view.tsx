'use client'

import { useMemo, useState } from 'react'
import { ComingSoonCardView, PackageCard } from '@/components/package-card'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { cardState, providerName } from '@/lib/logic'
import { cardStateLabel, cityLabel } from '@/lib/i18n'
import type { CardState, Offering } from '@/lib/types'

const TABS = ['All', 'Hourly', 'Stay-in', 'Hidden'] as const
const TAB_KEY = {
  All: 'tabAll',
  Hourly: 'tabHourly',
  'Stay-in': 'tabStayIn',
  Hidden: 'tabHidden'
} as const

export function CatalogView ({
  offerings,
  baseHref,
  showComingSoon,
  showAdminFilters
}: {
  offerings: Offering[]
  baseHref: string
  showComingSoon: boolean
  showAdminFilters: boolean
}) {
  const { state, t } = useStore()
  const locale = state.locale
  const [tab, setTab] = useState<(typeof TABS)[number]>('All')
  const [search, setSearch] = useState('')
  const [providerId, setProviderId] = useState('all')
  const [city, setCity] = useState('all')
  const [status, setStatus] = useState('all')

  const cities = [...new Set(offerings.map((o) => o.city))]
  const filtered = useMemo(() => {
    return offerings.filter((o) => {
      if (tab === 'Hourly' && o.type !== 'hourly') return false
      if (tab === 'Stay-in' && o.type !== 'stay-in') return false
      if (tab === 'Hidden' && !o.hidden) return false
      if (providerId !== 'all' && o.providerId !== providerId) return false
      if (city !== 'all' && o.city !== city) return false
      if (status !== 'all' && cardState(o) !== status) return false
      const q = search.trim().toLowerCase()
      if (q && !o.titleEn.toLowerCase().includes(q) && !o.titleAr.includes(q)) return false
      return true
    })
  }, [offerings, tab, search, providerId, city, status])

  const soon = showComingSoon
    ? state.comingSoon.filter((c) => {
        const ids = new Set(offerings.map((o) => o.providerId))
        if (providerId !== 'all') return c.providerId === providerId
        return ids.has(c.providerId)
      })
    : []

  const states: CardState[] = [
    'Ready for next sync',
    'Not queued',
    "Don't sync yet",
    'Scheduled',
    'Live',
    'Hidden',
    'Conflict',
    'Missing from website'
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tabId) => (
          <Button
            key={tabId}
            type="button"
            variant={tab === tabId ? 'selected' : 'outline'}
            size="sm"
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
      {showAdminFilters ? (
        <div className="flex flex-wrap gap-2">
          <select className="filter-control" value={providerId} onChange={(e) => setProviderId(e.target.value)} aria-label={t('providers')}>
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
          <select className="filter-control" value={status} onChange={(e) => setStatus(e.target.value)} aria-label={t('allStates')}>
            <option value="all">{t('allStates')}</option>
            {states.map((s) => (
              <option key={s} value={s}>{cardStateLabel(s, locale)}</option>
            ))}
          </select>
        </div>
      ) : null}
      {filtered.length === 0 && search.trim() ? (
        <p className="text-sm text-neutral-600">{t('noPackagesMatch')}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((o) => (
            <PackageCard key={o.id} offering={o} href={`${baseHref}/${o.id}`} />
          ))}
          {tab === 'All' && !search.trim()
            ? soon.map((c) => (
                <ComingSoonCardView key={`${c.providerId}-soon`} card={c} />
              ))
            : null}
        </div>
      )}
    </div>
  )
}
