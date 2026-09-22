'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { allowedPublishModes } from '@/lib/logic'
import type { PublishChoice } from '@/lib/types'
import { useStore } from '@/lib/store'

export function PublishDialog ({
  offeringId,
  onClose
}: {
  offeringId: string
  onClose: () => void
}) {
  const { state, publish, t } = useStore()
  const offering = state.offerings.find((o) => o.id === offeringId)
  const modes = offering ? allowedPublishModes(state, offering) : []
  const [choice, setChoice] = useState<PublishChoice>(modes[0] ?? 'next')
  const [when, setWhen] = useState('2026-09-28 10:00')
  const [error, setError] = useState('')
  if (!offering) return null

  return (
    <div className="overlay-scrim fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="overlay-panel w-full max-w-md p-6">
        <h2 className="font-heading mb-4 text-lg font-extrabold text-neutral-900">{t('publish')}</h2>
        {modes.length === 0 ? (
          <p className="text-sm text-neutral-700">{t('publishingOff')}</p>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {modes.includes('now') ? (
                <Button type="button" size="sm" variant={choice === 'now' ? 'selected' : 'outline'} onClick={() => setChoice('now')}>
                  {t('now')}
                </Button>
              ) : null}
              {modes.includes('date') ? (
                <Button type="button" size="sm" variant={choice === 'date' ? 'selected' : 'outline'} onClick={() => setChoice('date')}>
                  {t('onADate')}
                </Button>
              ) : null}
              {modes.includes('next') ? (
                <Button type="button" size="sm" variant={choice === 'next' ? 'selected' : 'outline'} onClick={() => setChoice('next')}>
                  {t('nextSync')}
                </Button>
              ) : null}
            </div>
            {modes.includes('date') && choice === 'date' ? (
              <label className="block">
                <span className="app-label">{t('onADate')}</span>
                <input className="app-field w-full" value={when} onChange={(e) => setWhen(e.target.value)} />
              </label>
            ) : null}
          </div>
        )}
        {error ? <p className="app-error mt-2">{t(error)}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>{t('close')}</Button>
          {modes.length > 0 ? (
            <Button
              type="button"
              onClick={() => {
                const msg = publish(offeringId, choice, choice === 'date' ? when : undefined)
                if (msg) setError(msg)
                else onClose()
              }}
            >
              {t('publish')}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
