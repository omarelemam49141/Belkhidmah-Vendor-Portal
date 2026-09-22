'use client'

import { AppShell } from '@/components/app-shell'
import { FadeIn } from '@/components/motion/fade-in'
import { useStore } from '@/lib/store'
import { cityLabel, localizedTitle } from '@/lib/i18n'
import { providerName } from '@/lib/logic'

export default function MockCrmPage () {
  const { state, updateWebsite, t } = useStore()
  const locale = state.locale
  return (
    <AppShell role="admin" title={t('mockCrm')}>
      <FadeIn>
        <p className="mb-4 text-sm text-neutral-600">{t('mockCrmHint')}</p>
        <div className="space-y-4">
          {state.website.map((w) => (
            <div key={`${w.providerId}-${w.crmId}`} className="list-panel p-4">
              <p className="font-semibold text-neutral-900">
                {localizedTitle(w, locale)} · {providerName(state, w.providerId, locale)} · {w.crmId}
              </p>
              <label className="app-label mt-3">{t('websiteTitleEn')}
                <input
                  className="app-field mt-1 w-full"
                  value={w.titleEn}
                  onChange={(e) => updateWebsite(w.crmId, w.providerId, { titleEn: e.target.value })}
                />
              </label>
              <label className="app-label mt-3">{t('websiteTitleAr')}
                <input
                  className="app-field mt-1 w-full"
                  value={w.titleAr}
                  onChange={(e) => updateWebsite(w.crmId, w.providerId, { titleAr: e.target.value })}
                />
              </label>
              <label className="app-label mt-3">{t('websiteDetailsEn')}
                <input
                  className="app-field mt-1 w-full"
                  value={w.descriptionEn}
                  onChange={(e) => updateWebsite(w.crmId, w.providerId, { descriptionEn: e.target.value })}
                />
              </label>
              <label className="app-label mt-3">{t('websiteDetailsAr')}
                <input
                  className="app-field mt-1 w-full"
                  value={w.descriptionAr}
                  onChange={(e) => updateWebsite(w.crmId, w.providerId, { descriptionAr: e.target.value })}
                />
              </label>
              <label className="app-label mt-3">{t('websiteDurationEn')}
                <input
                  className="app-field mt-1 w-full"
                  value={w.durationEn}
                  onChange={(e) => updateWebsite(w.crmId, w.providerId, { durationEn: e.target.value })}
                />
              </label>
              <label className="app-label mt-3">{t('websiteDurationAr')}
                <input
                  className="app-field mt-1 w-full"
                  value={w.durationAr}
                  onChange={(e) => updateWebsite(w.crmId, w.providerId, { durationAr: e.target.value })}
                />
              </label>
              <label className="app-label mt-3">{t('websitePrice')}
                <input
                  className="app-field mt-1 w-full"
                  value={w.price}
                  onChange={(e) => updateWebsite(w.crmId, w.providerId, { price: Number(e.target.value) || 0 })}
                />
              </label>
              <p className="mt-2 text-sm text-neutral-500">{t('city')}: {cityLabel(w.city, locale)}</p>
              <label className="mt-2 flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  className="accent-brand-magenta"
                  checked={w.dropped}
                  onChange={(e) => updateWebsite(w.crmId, w.providerId, { dropped: e.target.checked })}
                />
                {t('droppedFromWebsite')}
              </label>
            </div>
          ))}
        </div>
      </FadeIn>
    </AppShell>
  )
}
