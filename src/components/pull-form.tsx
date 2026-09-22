'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { offeringTitle, providerName } from '@/lib/logic'
import { holdReasonLabel, kindLabel } from '@/lib/i18n'
import type { PullChoice } from '@/lib/types'

export function PullForm ({
  lockedProviderId
}: {
  lockedProviderId?: string
}) {
  const { state, pull, t } = useStore()
  const locale = state.locale
  const [scope, setScope] = useState<'one' | 'several' | 'all'>('one')
  const [ids, setIds] = useState<string[]>(lockedProviderId ? [lockedProviderId] : [])
  const [choice, setChoice] = useState<PullChoice>('import-only')
  const result = state.lastPullResult

  useEffect(() => {
    if (lockedProviderId) {
      setIds([lockedProviderId])
      return
    }
    const preset = new URLSearchParams(window.location.search).get('provider')
    if (preset && state.providers.some((p) => p.id === preset)) {
      setScope('one')
      setIds([preset])
    }
  }, [lockedProviderId, state.providers])

  const selected = lockedProviderId
    ? [lockedProviderId]
    : scope === 'all'
      ? state.providers.map((p) => p.id)
      : ids

  return (
    <div className="space-y-4">
      <div className="list-panel space-y-4 p-4">
        {!lockedProviderId ? (
          <div className="flex flex-wrap gap-2">
            {(['one', 'several', 'all'] as const).map((s) => (
              <Button
                key={s}
                type="button"
                size="sm"
                variant={scope === s ? 'selected' : 'outline'}
                onClick={() => setScope(s)}
              >
                {t(s)}
              </Button>
            ))}
          </div>
        ) : null}
        {!lockedProviderId && scope !== 'all' ? (
          <div className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200">
            {state.providers.map((p) => (
              <label key={p.id} className="list-row flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-brand-magenta"
                  checked={ids.includes(p.id)}
                  onChange={(e) =>
                    setIds((cur) => {
                      if (scope === 'one') return e.target.checked ? [p.id] : []
                      return e.target.checked ? [...cur, p.id] : cur.filter((x) => x !== p.id)
                    })
                  }
                />
                {providerName(state, p.id, locale)}
              </label>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={choice === 'import-only' ? 'selected' : 'outline'}
            onClick={() => setChoice('import-only')}
          >
            {t('importOnly')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={choice === 'queue-succeeded' ? 'selected' : 'outline'}
            onClick={() => setChoice('queue-succeeded')}
          >
            {t('importAndQueue')}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => pull(selected, choice)}>{t('sync')}</Button>
          {!lockedProviderId ? (
            <Button type="button" variant="outline" onClick={() => pull(selected, choice, true)}>
              {t('simulateFail')}
            </Button>
          ) : null}
        </div>
      </div>
      {result?.error ? (
        <p className="app-error">
          {t(result.error === 'Could not read this website. Nothing was changed.' ? 'pullFailed' : result.error)}
        </p>
      ) : null}
      {result && !result.error ? (
        <div className="list-panel p-4 text-sm">
          <p className="font-semibold text-neutral-900">{t('queuedCount', { count: result.queuedCount })}</p>
          <ul className="mt-2 space-y-1 text-neutral-700">
            {result.rows.map((r) => {
              const offering = state.offerings.find((o) => o.id === r.packageId)
              const title = offering ? offeringTitle(offering, locale) : r.title
              const provider = offering
                ? providerName(state, offering.providerId, locale)
                : r.providerName
              const status = r.queued
                ? t('queued')
                : r.holdReason
                  ? `${t('held')} · ${holdReasonLabel(r.holdReason, locale)}`
                  : kindLabel(r.kind, locale)
              return (
                <li key={r.packageId}>
                  {title} · {provider} · {status}
                </li>
              )
            })}
          </ul>
          <Link className="mt-3 inline-block font-semibold text-brand-magenta underline" href={lockedProviderId ? '/provider/conflicts' : '/admin/conflicts'}>
            {t('conflicts')}
          </Link>
        </div>
      ) : null}
    </div>
  )
}
