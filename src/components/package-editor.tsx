'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ClientPreview } from '@/components/client-preview'
import { PriceFields } from '@/components/price-fields'
import { PublishDialog } from '@/components/publish-dialog'
import { useStore } from '@/lib/store'
import { hydrateRules, validatePriceRules } from '@/lib/price'
import type { FieldKey, Offering } from '@/lib/types'

export function PackageEditor ({
  offeringId,
  locked
}: {
  offeringId: string
  locked: boolean
}) {
  const { state, currentUser, saveOffering, hideOffering, unhideOffering, setDontSync, t } = useStore()
  const source = state.offerings.find((o) => o.id === offeringId)
  const [draft, setDraft] = useState<Offering | null>(source ?? null)
  const [dirty, setDirty] = useState<FieldKey[]>([])
  const [publishOpen, setPublishOpen] = useState(false)
  const [hideOpen, setHideOpen] = useState(false)
  const [skipOpen, setSkipOpen] = useState(false)

  useEffect(() => {
    setDraft(
      source
        ? {
            ...source,
            photos: [...source.photos],
            priceRules: hydrateRules(source.priceMode, source.price, source.priceRules)
          }
        : null
    )
  }, [source])

  if (!source || !draft) return <p className="text-sm text-neutral-600">{t('packageNotFound')}</p>
  if (currentUser?.role === 'provider' && source.providerId !== currentUser.providerId) {
    return <p className="text-sm text-neutral-600">{t('packageNotFound')}</p>
  }

  const lock = (key: keyof Offering['permissions']) => locked && !source.permissions[key]
  const mark = (field: FieldKey) => setDirty((d) => (d.includes(field) ? d : [...d, field]))
  const fieldNote = (key: keyof Offering['permissions']) =>
    lock(key) ? <p className="mt-1 text-xs text-neutral-500">{t('adminLocked')}</p> : null

  const canHide = !locked || source.permissions.hide
  const canSkip = !locked || source.permissions.skipSync

  const titleFields = (
    <>
      <label className="app-label">
        {t('titleEn')}
        <input
          className="app-field mt-1 w-full"
          value={draft.titleEn}
          disabled={lock('title')}
          onChange={(e) => {
            mark('title')
            setDraft({ ...draft, titleEn: e.target.value })
          }}
        />
        {fieldNote('title')}
      </label>
      <label className="app-label">
        {t('titleAr')}
        <input
          className="app-field mt-1 w-full"
          value={draft.titleAr}
          disabled={lock('title')}
          onChange={(e) => {
            mark('title')
            setDraft({ ...draft, titleAr: e.target.value })
          }}
        />
      </label>
    </>
  )

  const detailFields = (
    <>
      <label className="app-label">
        {t('detailsEn')}
        <textarea
          className="app-field mt-1 min-h-24 w-full"
          value={draft.descriptionEn}
          disabled={lock('details')}
          onChange={(e) => {
            mark('details')
            setDraft({ ...draft, descriptionEn: e.target.value })
          }}
        />
        {fieldNote('details')}
      </label>
      <label className="app-label">
        {t('detailsAr')}
        <textarea
          className="app-field mt-1 min-h-24 w-full"
          value={draft.descriptionAr}
          disabled={lock('details')}
          onChange={(e) => {
            mark('details')
            setDraft({ ...draft, descriptionAr: e.target.value })
          }}
        />
      </label>
    </>
  )

  const durationFields = (
    <>
      <label className="app-label">
        {t('durationEn')}
        <input
          className="app-field mt-1 w-full"
          value={draft.durationEn}
          disabled={lock('details')}
          onChange={(e) => {
            mark('duration')
            setDraft({ ...draft, durationEn: e.target.value })
          }}
        />
      </label>
      <label className="app-label">
        {t('durationAr')}
        <input
          className="app-field mt-1 w-full"
          value={draft.durationAr}
          disabled={lock('details')}
          onChange={(e) => {
            mark('duration')
            setDraft({ ...draft, durationAr: e.target.value })
          }}
        />
      </label>
    </>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <form
        className="list-panel space-y-4 p-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (draft.priceMode === 'dynamic' && validatePriceRules(draft.priceRules)) return
          saveOffering(draft, dirty)
        }}
      >
        {titleFields}
        {detailFields}
        {durationFields}
        <PriceFields
          draft={draft}
          locked={lock('price')}
          onChange={(patch) => {
            mark('price')
            setDraft({ ...draft, ...patch })
          }}
        />
        {lock('price') ? fieldNote('price') : null}
        <label className="app-label">
          {t('city')}
          <input
            className="app-field mt-1 w-full"
            value={draft.city}
            disabled={lock('city')}
            onChange={(e) => {
              mark('city')
              setDraft({ ...draft, city: e.target.value })
            }}
          />
          {fieldNote('city')}
        </label>
        <label className="app-label">
          {t('photos')}
          <input
            className="app-field mt-1 w-full"
            value={draft.photos.join(', ')}
            disabled={lock('photos')}
            onChange={(e) => {
              mark('photos')
              setDraft({ ...draft, photos: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })
            }}
          />
          {fieldNote('photos')}
        </label>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit">{t('save')}</Button>
          <Button type="button" variant="outline" onClick={() => setPublishOpen(true)}>{t('publish')}</Button>
          {canHide && !source.hidden ? (
            <Button type="button" variant="outline" onClick={() => setHideOpen(true)}>{t('hide')}</Button>
          ) : null}
          {source.hidden ? (
            <Button type="button" variant="outline" onClick={() => unhideOffering(source.id)}>{t('unhide')}</Button>
          ) : null}
          {canSkip && !source.dontSyncYet ? (
            <Button type="button" variant="outline" onClick={() => setSkipOpen(true)}>{t('dontSyncYet')}</Button>
          ) : null}
          {source.dontSyncYet ? (
            <Button type="button" variant="outline" onClick={() => setDontSync(source.id, false)}>{t('clearDontSync')}</Button>
          ) : null}
        </div>
      </form>
      <ClientPreview providerId={locked ? source.providerId : undefined} />
      {publishOpen ? <PublishDialog offeringId={source.id} onClose={() => setPublishOpen(false)} /> : null}
      {hideOpen ? (
        <div className="overlay-scrim fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="overlay-panel max-w-md p-6">
            <p className="text-neutral-900">{t('hideConfirm')}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setHideOpen(false)}>{t('cancel')}</Button>
              <Button type="button" onClick={() => { hideOffering(source.id); setHideOpen(false) }}>{t('confirmHide')}</Button>
            </div>
          </div>
        </div>
      ) : null}
      {skipOpen ? (
        <div className="overlay-scrim fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="overlay-panel max-w-md p-6">
            <p className="text-neutral-900">{t('skipConfirm')}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setSkipOpen(false)}>{t('cancel')}</Button>
              <Button type="button" onClick={() => { setDontSync(source.id, true); setSkipOpen(false) }}>{t('dontSyncYet')}</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
