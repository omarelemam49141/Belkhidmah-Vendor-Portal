'use client'

import { useStore } from '@/lib/store'
import { liveOnBelkhidmah, offeringTitle } from '@/lib/logic'
import { formatPriceSummary } from '@/lib/i18n'

export function ClientPreview ({
  providerId,
  highlightId
}: {
  providerId?: string
  highlightId?: string | null
}) {
  const { state, t } = useStore()
  const items = liveOnBelkhidmah(state.offerings, providerId)
  return (
    <section className="list-panel p-4">
      <h2 className="mb-3 text-lg font-extrabold text-neutral-900">{t('onBelkhidmahNow')}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">{t('nothingLiveClient')}</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {items.map((o) => (
            <li
              key={o.id}
              className={
                highlightId === o.id
                  ? 'rounded-lg bg-brand-blush px-2 py-1 font-semibold text-brand-magenta'
                  : ''
              }
            >
              {offeringTitle(o, state.locale)} · {formatPriceSummary(o, state.locale)} {t('sar')} · {o.hidden ? t('liveUntilSync') : t('live')}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
