'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { FadeIn } from '@/components/motion/fade-in'
import { useStore } from '@/lib/store'
import { offeringTitle, providerName } from '@/lib/logic'
import { actionLabel } from '@/lib/i18n'

export default function ActivityPage () {
  const { state, t } = useStore()
  const locale = state.locale
  const [provider, setProvider] = useState('all')
  const selected = state.providers.find((p) => p.id === provider)
  const lines = state.activity.filter((l) => provider === 'all' || (selected && l.providerName.includes(selected.nameEn)))
  return (
    <AppShell role="admin" title={t('activity')}>
      <FadeIn>
        <select
          className="filter-control mb-5"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          aria-label={t('providers')}
        >
          <option value="all">{t('allProviders')}</option>
          {state.providers.map((p) => (
            <option key={p.id} value={p.id}>{providerName(state, p.id, locale)}</option>
          ))}
        </select>
        <ul className="list-panel divide-y divide-neutral-200 overflow-hidden">
          {lines.map((l) => {
            const offering = state.offerings.find((o) => o.titleEn === l.packageName)
            const names = l.providerName.split(', ').map((part) => {
              const match = state.providers.find((p) => p.nameEn === part)
              return match ? providerName(state, match.id, locale) : part
            })
            return (
              <li key={l.id} className="list-row">
                <span>{l.at}</span>
                {' · '}
                <span>{l.actor === 'Admin' ? t('admin') : l.actor}</span>
                {' · '}
                <span>{names.join(locale === 'ar' ? '، ' : ', ')}</span>
                {' · '}
                <span>{offering ? offeringTitle(offering, locale) : l.packageName}</span>
                {' · '}
                <span>{actionLabel(l.action, locale)}</span>
              </li>
            )
          })}
        </ul>
      </FadeIn>
    </AppShell>
  )
}
