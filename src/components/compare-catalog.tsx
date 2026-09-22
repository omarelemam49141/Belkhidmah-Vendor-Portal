'use client'

import { useEffect, useMemo, useState } from 'react'
import { ComingSoonCardView, PackageCard } from '@/components/package-card'
import { CompareDrawer } from '@/components/compare-drawer'
import { Button } from '@/components/ui/button'
import {
  belkhidmahDiffFields,
  cardState,
  differsFromBelkhidmah,
  liveOnBelkhidmah
} from '@/lib/logic'
import { cardStateLabel, cityLabel } from '@/lib/i18n'
import type { CardState, ComingSoonCard, Offering } from '@/lib/types'
import { useStore } from '@/lib/store'

const PAGE_SIZE = 12
const TABS = ['on', 'off', 'diff'] as const
type PresenceTab = (typeof TABS)[number]
const TAB_KEY: Record<PresenceTab, 'tabOnBelkhidmah' | 'tabNotOnBelkhidmah' | 'tabDifferentBelkhidmah'> = {
  on: 'tabOnBelkhidmah',
  off: 'tabNotOnBelkhidmah',
  diff: 'tabDifferentBelkhidmah'
}
const TYPE_TABS = ['All', 'Hourly', 'Stay-in'] as const
const TYPE_KEY = {
  All: 'tabAll',
  Hourly: 'tabHourly',
  'Stay-in': 'tabStayIn'
} as const
type PresenceFilter = 'all' | 'live' | 'leaving'

const HOLD_STATES: CardState[] = [
  'Ready for next sync',
  'Not queued',
  "Don't sync yet",
  'Scheduled',
  'Hidden',
  'Conflict',
  'Missing from website'
]

function readTab (): PresenceTab {
  if (typeof window === 'undefined') return 'on'
  const value = new URLSearchParams(window.location.search).get('tab')
  return TABS.includes(value as PresenceTab) ? (value as PresenceTab) : 'on'
}

export function CompareCatalog ({
  offerings,
  comingSoon,
  packageHref
}: {
  offerings: Offering[]
  comingSoon: ComingSoonCard[]
  packageHref: (id: string) => string
}) {
  const { t, state } = useStore()
  const locale = state.locale
  const [tab, setTab] = useState<PresenceTab>('on')
  const [typeTab, setTypeTab] = useState<(typeof TYPE_TABS)[number]>('All')
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('all')
  const [presence, setPresence] = useState<PresenceFilter>('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [compareId, setCompareId] = useState<string | null>(null)

  useEffect(() => {
    setTab(readTab())
  }, [])

  function goTab (next: PresenceTab) {
    setTab(next)
    setPage(1)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', next)
    window.history.replaceState(null, '', `${url.pathname}${url.search}`)
  }

  const onApp = useMemo(() => liveOnBelkhidmah(offerings), [offerings])
  const notOn = useMemo(
    () => offerings.filter((o) => o.belkhidmahPresence !== 'live'),
    [offerings]
  )
  const different = useMemo(() => onApp.filter(differsFromBelkhidmah), [onApp])

  const source = tab === 'on' ? onApp : tab === 'off' ? notOn : different
  const cities = [...new Set(source.map((o) => o.city))]

  const filtered = useMemo(() => {
    return source.filter((o) => {
      if (typeTab === 'Hourly' && o.type !== 'hourly') return false
      if (typeTab === 'Stay-in' && o.type !== 'stay-in') return false
      if (city !== 'all' && o.city !== city) return false
      if (tab === 'on') {
        if (presence === 'live' && o.hidden) return false
        if (presence === 'leaving' && !o.hidden) return false
      }
      if (tab === 'off' && status !== 'all' && cardState(o) !== status) return false
      const q = search.trim().toLowerCase()
      if (q && !o.titleEn.toLowerCase().includes(q) && !o.titleAr.includes(q)) return false
      return true
    })
  }, [source, typeTab, city, tab, presence, status, search])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  useEffect(() => {
    if (page > pages) setPage(pages)
  }, [page, pages])

  const soon =
    tab === 'off' && !search.trim()
      ? comingSoon.filter((c) => {
          const q = search.trim().toLowerCase()
          if (!q) return true
          return c.titleEn.toLowerCase().includes(q) || c.titleAr.includes(q)
        })
      : []

  const compareOffering = compareId ? offerings.find((o) => o.id === compareId) : undefined
  const emptyFilters = source.length > 0 && filtered.length === 0
  const emptyTab =
    source.length === 0 && soon.length === 0
      ? tab === 'on'
        ? t('nothingLiveBelkhidmah')
        : tab === 'off'
          ? t('noPackagesNotOnBelkhidmah')
          : t('noDifferentPackages')
      : null

  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm text-neutral-500">{t('onBelkhidmahPageHint')}</p>

      <div className="flex flex-wrap gap-2">
        {TABS.map((id) => {
          const count = id === 'on' ? onApp.length : id === 'off' ? notOn.length : different.length
          return (
            <Button
              key={id}
              type="button"
              size="sm"
              variant={tab === id ? 'selected' : 'outline'}
              onClick={() => goTab(id)}
            >
              {t(TAB_KEY[id])} ({count})
            </Button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {TYPE_TABS.map((id) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={typeTab === id ? 'selected' : 'outline'}
            onClick={() => {
              setTypeTab(id)
              setPage(1)
            }}
          >
            {t(TYPE_KEY[id])}
          </Button>
        ))}
      </div>

      <input
        className="filter-control w-full"
        placeholder={t('findPackage')}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
        aria-label={t('findPackage')}
      />

      <div className="flex flex-wrap gap-2">
        <select
          className="filter-control"
          value={city}
          onChange={(e) => {
            setCity(e.target.value)
            setPage(1)
          }}
          aria-label={t('city')}
        >
          <option value="all">{t('allCities')}</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {cityLabel(c, locale)}
            </option>
          ))}
        </select>
        {tab === 'on' ? (
          <select
            className="filter-control"
            value={presence}
            onChange={(e) => {
              setPresence(e.target.value as PresenceFilter)
              setPage(1)
            }}
            aria-label={t('onPlatform')}
          >
            <option value="all">{t('allOnPlatform')}</option>
            <option value="live">{t('live')}</option>
            <option value="leaving">{t('leavingNext')}</option>
          </select>
        ) : null}
        {tab === 'off' ? (
          <select
            className="filter-control"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            aria-label={t('allStates')}
          >
            <option value="all">{t('allStates')}</option>
            {HOLD_STATES.map((s) => (
              <option key={s} value={s}>
                {cardStateLabel(s, locale)}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <p className="text-sm text-neutral-500">{t('packagesCount', { count: filtered.length })}</p>

      {emptyFilters ? (
        <p>{t('noPackagesMatch')}</p>
      ) : paged.length === 0 && soon.length === 0 ? (
        <p className="text-sm text-neutral-500">{emptyTab}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paged.map((o) => {
            const diffs = belkhidmahDiffFields(o)
            const canCompare = o.belkhidmahPresence === 'live' && !!o.belkhidmahSnapshot
            return (
              <PackageCard
                key={o.id}
                offering={o}
                href={packageHref(o.id)}
                selected={compareId === o.id}
                matchStatus={canCompare ? (diffs.length > 0 ? 'different' : 'same') : undefined}
                diffCount={diffs.length}
                onCompare={canCompare ? () => setCompareId(o.id) : undefined}
              />
            )
          })}
          {soon.map((c) => (
            <ComingSoonCardView key={`${c.providerId}-soon`} card={c} />
          ))}
        </div>
      )}

      {pages > 1 ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            {t('previousPage')}
          </Button>
          <p className="text-sm text-neutral-600">{t('pageOf', { page: safePage, pages })}</p>
          <Button
            type="button"
            variant="outline"
            disabled={safePage >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            {t('nextPage')}
          </Button>
        </div>
      ) : null}

      {compareOffering ? (
        <CompareDrawer
          offering={compareOffering}
          href={packageHref(compareOffering.id)}
          onClose={() => setCompareId(null)}
        />
      ) : null}
    </div>
  )
}
