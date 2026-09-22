'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { offeringTitle, providerName } from '@/lib/logic'
import { cityLabel, formatPricedLabel, localizedDuration } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function PlatformDrawer ({
  offeringId,
  onClose
}: {
  offeringId: string
  onClose: () => void
}) {
  const { state, hideOffering, unhideOffering, t } = useStore()
  const offering = state.offerings.find((o) => o.id === offeringId && o.belkhidmahPresence === 'live')
  const [hideOpen, setHideOpen] = useState(false)
  if (!offering) return null

  const locale = state.locale
  const leaving = offering.hidden

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="overlay-scrim absolute inset-0" aria-label={t('close')} onClick={onClose} />
      <aside className="overlay-drawer absolute inset-y-0 inset-e-0 flex w-full max-w-md flex-col overflow-y-auto">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-200 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-lilac">
              {offering.type === 'hourly' ? t('hourly') : t('stayIn')}
            </p>
            <h2 className="font-heading text-xl font-extrabold text-neutral-900">{offeringTitle(offering, locale)}</h2>
            <p className="text-sm text-neutral-500">{providerName(state, offering.providerId, locale)}</p>
          </div>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('close')}
          </Button>
        </div>
        <div className="space-y-4 p-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs',
                leaving ? 'bg-brand-pink/15 text-brand-magenta' : 'bg-brand-blush text-brand-magenta'
              )}
            >
              {leaving ? t('onBelkhidmahUntilSync') : t('liveOnBelkhidmah')}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
            <dt className="text-neutral-500">{t('titleEN')}</dt>
            <dd>{offering.titleEn}</dd>
            <dt className="text-neutral-500">{t('titleAR')}</dt>
            <dd>{offering.titleAr}</dd>
            <dt className="text-neutral-500">{t('city')}</dt>
            <dd>{cityLabel(offering.city, locale)}</dd>
            <dt className="text-neutral-500">{t('fieldDuration')}</dt>
            <dd>{localizedDuration(offering, locale)}</dd>
            <dt className="text-neutral-500">{t('price')}</dt>
            <dd className="col-span-2 sm:col-span-1">{formatPricedLabel(offering, locale)}</dd>
            <dt className="text-neutral-500">{t('crmId')}</dt>
            <dd>{offering.crmId}</dd>
            <dt className="text-neutral-500">{t('onBelkhidmahNow')}</dt>
            <dd>{t('yes')}</dd>
            <dt className="text-neutral-500">{t('lastJobLabel')}</dt>
            <dd>{offering.lastJobAt ?? '—'}</dd>
          </dl>
        </div>
        <div className="mt-auto space-y-2 border-t border-neutral-200 p-4">
          <div className="flex flex-wrap gap-2">
            {!leaving ? (
              <Button type="button" variant="outline" onClick={() => setHideOpen(true)}>{t('hide')}</Button>
            ) : (
              <Button type="button" variant="outline" onClick={() => unhideOffering(offering.id)}>{t('unhide')}</Button>
            )}
          </div>
          <Link className="inline-block text-sm font-semibold text-brand-magenta" href={`/admin/packages/${offering.id}`}>
            {t('openFullPackage')}
          </Link>
        </div>
      </aside>
      {hideOpen ? (
        <div className="overlay-scrim fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="overlay-panel max-w-md p-6">
            <p className="text-neutral-900">{t('hideConfirm')}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setHideOpen(false)}>{t('cancel')}</Button>
              <Button type="button" onClick={() => { hideOffering(offering.id); setHideOpen(false) }}>{t('confirmHide')}</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
