'use client'

import Link from 'next/link'
import { cardState, offeringTitle, providerName } from '@/lib/logic'
import { cardStateLabel, cityLabel, formatPriceSummary, localizedDuration } from '@/lib/i18n'
import type { ComingSoonCard, Offering } from '@/lib/types'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function statusClass (status: ReturnType<typeof cardState>) {
  if (status === 'Live') return 'bg-brand-blush text-brand-magenta'
  if (status === 'Conflict') return 'bg-brand-pink/15 text-brand-magenta'
  return 'bg-neutral-100 text-neutral-700'
}

export function PackageCard ({
  offering,
  href,
  onOpen,
  selected,
  readOnly,
  matchStatus,
  diffCount,
  onCompare
}: {
  offering: Offering
  href?: string
  onOpen?: () => void
  selected?: boolean
  readOnly?: boolean
  matchStatus?: 'same' | 'different'
  diffCount?: number
  onCompare?: () => void
}) {
  const { state, t } = useStore()
  const locale = state.locale
  const status = cardState(offering)
  const open = () => onOpen?.()
  return (
    <article
      className={cn(
        'list-panel flex flex-col p-4 transition-colors duration-150',
        selected ? 'border-brand-blush bg-brand-blush' : 'hover:border-brand-magenta',
        onOpen ? 'cursor-pointer' : ''
      )}
      onClick={onOpen ? open : undefined}
      onKeyDown={
        onOpen
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                open()
              }
            }
          : undefined
      }
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-lilac">
          {offering.type === 'hourly' ? t('hourly') : t('stayIn')}
        </p>
        <span className={cn('rounded-full px-2 py-0.5 text-xs', statusClass(status))}>
          {cardStateLabel(status, locale)}
        </span>
      </div>
      <h2 className="font-heading text-lg font-extrabold text-neutral-900">{offeringTitle(offering, locale)}</h2>
      <p className="text-sm text-neutral-500">{localizedDuration(offering, locale)}</p>
      <p className="mt-3 text-2xl font-extrabold text-brand-magenta">
        <span className="text-sm font-medium">{t('sar')} </span>
        {formatPriceSummary(offering, locale)}
      </p>
      <div className="mt-2 flex justify-between text-xs text-neutral-500">
        <span>{cityLabel(offering.city, locale)}</span>
        <span>{offering.priceMode === 'dynamic' ? t('dynamic') : t('fixed')}</span>
      </div>
      <p className="mt-3 text-sm">{providerName(state, offering.providerId, locale)}</p>
      {offering.hidden && offering.belkhidmahPresence === 'live' ? (
        <p className="mt-1 text-xs text-neutral-500">{t('onBelkhidmahUntilSync')}</p>
      ) : null}
      {matchStatus === 'same' ? (
        <p className="mt-2 w-fit rounded-full bg-brand-blush px-2 py-0.5 text-xs text-brand-magenta">{t('matchesBelkhidmah')}</p>
      ) : null}
      {matchStatus === 'different' ? (
        <p className="mt-2 w-fit rounded-full bg-brand-pink/15 px-2 py-0.5 text-xs text-brand-magenta">
          {t('differsBelkhidmah', { count: diffCount ?? 0 })}
        </p>
      ) : null}
      {offering.scheduledAt ? <p className="text-xs text-neutral-500">{offering.scheduledAt}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {onCompare ? (
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onCompare()
            }}
          >
            {t('comparePackage')}
          </Button>
        ) : null}
        {readOnly ? (
          href ? (
            <Button asChild variant="outline">
              <Link href={href}>{t('openInProject')}</Link>
            </Button>
          ) : null
        ) : onOpen ? (
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              open()
            }}
          >
            {t('manageOffering')}
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href={href ?? '#'}>{t('manageOffering')}</Link>
          </Button>
        )}
      </div>
    </article>
  )
}

export function ComingSoonCardView ({ card }: { card: ComingSoonCard }) {
  const { state, t } = useStore()
  return (
    <article className="list-panel flex flex-col border-dashed p-4">
      <span className="w-fit rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">{t('comingSoon')}</span>
      <h2 className="mt-2 font-heading text-lg font-extrabold text-neutral-900">{state.locale === 'ar' ? card.titleAr : card.titleEn}</h2>
      <p className="text-sm text-neutral-500">{t('onRoadmap')}</p>
      <Button disabled className="mt-4" variant="outline">
        {t('notYetAvailable')}
      </Button>
    </article>
  )
}
