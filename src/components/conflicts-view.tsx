'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { offeringTitle } from '@/lib/logic'
import { conflictSides, fieldLabel } from '@/lib/i18n'
import type { FieldKey } from '@/lib/types'

const EMPTY: Record<FieldKey, 'mine' | 'website'> = {
  price: 'mine',
  title: 'mine',
  details: 'mine',
  photos: 'mine',
  city: 'mine',
  duration: 'mine'
}

export function ConflictsView ({ providerId }: { providerId?: string }) {
  const { state, resolveConflicts, t } = useStore()
  const locale = state.locale
  const [packageId, setPackageId] = useState<string | null>(null)
  useEffect(() => {
    setPackageId(new URLSearchParams(window.location.search).get('package'))
  }, [])
  const list = state.offerings.filter(
    (o) =>
      o.conflicts.length > 0 &&
      (!providerId || o.providerId === providerId) &&
      (!packageId || o.id === packageId)
  )
  const [picks, setPicks] = useState<Record<string, 'mine' | 'website'>>({})

  if (list.length === 0) return <p className="text-sm text-neutral-600">{t('noConflicts')}</p>

  return (
    <div className="list-panel space-y-6 p-4 sm:p-6">
      {list.map((o) => {
        const decisions = { ...EMPTY }
        for (const c of o.conflicts) {
          decisions[c.field] = picks[`${o.id}:${c.field}`] ?? 'mine'
        }
        const site = state.website.find((w) => w.providerId === o.providerId && w.crmId === o.crmId)
        return (
          <section key={o.id}>
            <h2 className="font-heading text-lg font-extrabold text-neutral-900">{offeringTitle(o, locale)}</h2>
            {o.conflicts.map((c) => {
              const sides = conflictSides(o, site, c.field, locale, c)
              const picked = picks[`${o.id}:${c.field}`] ?? 'mine'
              return (
                <div key={c.field} className="my-2 grid gap-2 border-b border-neutral-200 py-3 sm:grid-cols-3">
                  <p className="capitalize text-neutral-700">{fieldLabel(c.field, locale)}</p>
                  <p>{t('mine')}: {sides.mine}</p>
                  <p>{t('website')}: {sides.website}</p>
                  <div className="flex flex-wrap gap-2 sm:col-span-3">
                    <Button
                      type="button"
                      variant={picked === 'mine' ? 'selected' : 'outline'}
                      onClick={() => setPicks((p) => ({ ...p, [`${o.id}:${c.field}`]: 'mine' }))}
                    >
                      {t('keepMine')}
                    </Button>
                    <Button
                      type="button"
                      variant={picked === 'website' ? 'selected' : 'outline'}
                      onClick={() => setPicks((p) => ({ ...p, [`${o.id}:${c.field}`]: 'website' }))}
                    >
                      {t('takeWebsite')}
                    </Button>
                  </div>
                </div>
              )
            })}
            <Button type="button" onClick={() => resolveConflicts(o.id, decisions)}>{t('saveResolution')}</Button>
          </section>
        )
      })}
    </div>
  )
}
