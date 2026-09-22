'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { offeringTitle, belkhidmahDiffFields } from '@/lib/logic'
import { belkhidmahSides, fieldLabel, formatPricedLines } from '@/lib/i18n'
import type { FieldKey, Offering } from '@/lib/types'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const FIELDS: FieldKey[] = ['title', 'price', 'details', 'duration', 'city', 'photos']

function CompareSide ({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div className="min-w-0 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <p className="text-xs font-semibold text-neutral-500">{label}</p>
      <ul className="mt-1.5 space-y-1.5">
        {lines.map((line, i) => (
          <li key={`${i}-${line.slice(0, 24)}`} className="wrap-break-word leading-relaxed text-neutral-900">
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CompareDrawer ({
  offering,
  href,
  onClose
}: {
  offering: Offering
  href: string
  onClose: () => void
}) {
  const { state, t } = useStore()
  const locale = state.locale
  const snapshot = offering.belkhidmahSnapshot
  const diffs = new Set(belkhidmahDiffFields(offering))
  const matchCount = FIELDS.length - diffs.size
  const rows = diffs.size > 0 ? FIELDS.filter((f) => diffs.has(f)) : FIELDS

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="overlay-scrim absolute inset-0" aria-label={t('close')} onClick={onClose} />
      <aside className="overlay-drawer absolute inset-y-0 inset-e-0 flex w-full max-w-lg flex-col overflow-y-auto">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-200 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-lilac">
              {offering.type === 'hourly' ? t('hourly') : t('stayIn')}
            </p>
            <h2 className="font-heading text-xl font-extrabold text-neutral-900">{offeringTitle(offering, locale)}</h2>
            <p className="mt-1 text-xs text-neutral-500">{t('compareViewOnly')}</p>
          </div>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('close')}
          </Button>
        </div>
        <div className="space-y-3 p-4 text-sm">
          {!snapshot ? (
            <p className="text-neutral-700">{t('noFieldDiffs')}</p>
          ) : diffs.size === 0 ? (
            <p className="rounded-xl bg-brand-blush px-3 py-2 text-brand-magenta">{t('noFieldDiffs')}</p>
          ) : (
            <p className="rounded-xl bg-brand-pink/15 px-3 py-2 text-brand-magenta">
              {t('differsBelkhidmah', { count: diffs.size })}
              {matchCount > 0 ? ` · ${t('fieldsMatch', { count: matchCount })}` : ''}
            </p>
          )}
          {snapshot
            ? rows.map((field) => {
                const sides = belkhidmahSides(offering, snapshot, field, locale)
                const changed = diffs.has(field)
                const stacked = field === 'price' || field === 'details'
                const platformLines = field === 'price' ? formatPricedLines(snapshot, locale) : [sides.platform]
                const projectLines = field === 'price' ? formatPricedLines(offering, locale) : [sides.project]
                return (
                  <div
                    key={field}
                    className={cn(
                      'rounded-xl border border-neutral-200 bg-white p-3',
                      changed && 'border-s-4 border-s-brand-magenta'
                    )}
                  >
                    <p className="font-heading font-semibold text-neutral-900">{fieldLabel(field, locale)}</p>
                    <div className={cn('mt-3 grid gap-3', stacked ? 'grid-cols-1' : 'sm:grid-cols-2')}>
                      <CompareSide label={t('onBelkhidmahColumn')} lines={platformLines} />
                      <CompareSide label={t('inThisProjectColumn')} lines={projectLines} />
                    </div>
                  </div>
                )
              })
            : null}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 border-t border-neutral-200 p-4">
          <Button asChild>
            <Link href={href}>{t('openInProject')}</Link>
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('close')}
          </Button>
        </div>
      </aside>
    </div>
  )
}
