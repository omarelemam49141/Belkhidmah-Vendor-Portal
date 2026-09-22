import type {
  AppState,
  BelkhidmahSnapshot,
  CardState,
  ComingSoonCard,
  FieldKey,
  HoldReason,
  Offering,
  PackagePermissions,
  PermKey,
  Provider,
  PublishChoice,
  PullChoice,
  PullResult,
  PullRow,
  WebsitePackage
} from './types'
import { PERM_KEYS } from './types'
import { cloneRules, hydratePriced, serializePriceField, summaryPrice } from './price'

export function nowStamp (): string {
  const d = new Date()
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(d)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`
}

export function newId (prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function providerName (state: AppState, id: string, locale: 'en' | 'ar'): string {
  const p = state.providers.find((x) => x.id === id)
  if (!p) return id
  return locale === 'ar' ? p.nameAr : p.nameEn
}

export function offeringTitle (o: Offering, locale: 'en' | 'ar'): string {
  return locale === 'ar' ? o.titleAr : o.titleEn
}

export function cardState (o: Offering): CardState {
  if (o.crmPresence === 'missing') return 'Missing from website'
  if (o.conflicts.length > 0) return 'Conflict'
  if (o.hidden) return 'Hidden'
  if (o.dontSyncYet) return "Don't sync yet"
  if (o.publishChoice === 'date' && o.scheduledAt) return 'Scheduled'
  if (o.belkhidmahPresence === 'live' && !o.hidden) return 'Live'
  if (o.publishChoice === 'next') return 'Ready for next sync'
  return 'Not queued'
}

export function allowedPublishModes (
  state: AppState,
  offering: Offering
): PublishChoice[] {
  const provider = state.providers.find((p) => p.id === offering.providerId)
  if (!provider) return []
  const out: PublishChoice[] = []
  if (state.platform.now && provider.publish.now && offering.permissions.now) out.push('now')
  if (state.platform.date && provider.publish.date && offering.permissions.date) out.push('date')
  if (state.platform.next && provider.publish.next && offering.permissions.next) out.push('next')
  return out
}

export function fieldValue (o: Offering, field: FieldKey): string {
  switch (field) {
    case 'price':
      return serializePriceField(o.priceMode, o.price, o.priceRules)
    case 'title':
      return o.titleEn
    case 'details':
      return o.descriptionEn
    case 'photos':
      return o.photos.join(', ')
    case 'city':
      return o.city
    case 'duration':
      return o.durationEn
  }
}

export function websiteField (w: WebsitePackage, field: FieldKey): string {
  switch (field) {
    case 'price':
      return serializePriceField(w.priceMode, w.price, w.priceRules)
    case 'title':
      return w.titleEn
    case 'details':
      return w.descriptionEn
    case 'photos':
      return w.photos.join(', ')
    case 'city':
      return w.city
    case 'duration':
      return w.durationEn
  }
}

function applyWebsiteField (o: Offering, w: WebsitePackage, field: FieldKey): Offering {
  const next = { ...o, photos: [...o.photos], priceRules: cloneRules(o.priceRules) }
  switch (field) {
    case 'price':
      next.price = w.price
      next.priceMode = w.priceMode
      next.priceRules = cloneRules(w.priceRules)
      break
    case 'title':
      next.titleEn = w.titleEn
      next.titleAr = w.titleAr
      break
    case 'details':
      next.descriptionEn = w.descriptionEn
      next.descriptionAr = w.descriptionAr
      break
    case 'photos':
      next.photos = [...w.photos]
      break
    case 'city':
      next.city = w.city
      break
    case 'duration':
      next.durationEn = w.durationEn
      next.durationAr = w.durationAr
      break
  }
  return next
}

const TRACKED: FieldKey[] = ['price', 'title', 'details', 'photos', 'city', 'duration']

export function holdReason (o: Offering): HoldReason | null {
  if (o.crmPresence === 'missing') return 'Missing from website'
  if (o.conflicts.length > 0) return 'Conflict'
  if (o.hidden) return 'Hidden'
  if (o.dontSyncYet) return "Don't sync yet"
  return null
}

export function isSucceeded (o: Offering): boolean {
  return holdReason(o) === null && o.crmPresence === 'present'
}

function upsertFromSite (
  existing: Offering | undefined,
  w: WebsitePackage,
  providerId: string,
  stamp: string
): Offering {
  if (!existing) {
    return {
      id: `${providerId}-${w.crmId}`,
      crmId: w.crmId,
      providerId,
      type: w.type,
      titleEn: w.titleEn,
      titleAr: w.titleAr,
      durationEn: w.durationEn,
      durationAr: w.durationAr,
      descriptionEn: w.descriptionEn,
      descriptionAr: w.descriptionAr,
      photos: [...w.photos],
      price: w.price,
      priceMode: w.priceMode,
      priceRules: cloneRules(w.priceRules),
      city: w.city,
      dirtyFields: [],
      conflicts: [],
      crmPresence: 'present',
      hidden: false,
      dontSyncYet: false,
      publishChoice: null,
      scheduledAt: null,
      belkhidmahPresence: 'not_on_app',
      belkhidmahSnapshot: null,
      permissions: {
        price: true,
        title: true,
        details: true,
        photos: true,
        city: true,
        hide: true,
        skipSync: true,
        now: true,
        date: true,
        next: true
      },
      lastPullAt: stamp,
      lastJobAt: null
    }
  }

  let next: Offering = {
    ...existing,
    photos: [...existing.photos],
    priceRules: cloneRules(existing.priceRules),
    dirtyFields: [...existing.dirtyFields],
    conflicts: [],
    crmPresence: 'present',
    lastPullAt: stamp,
    hidden: existing.hidden,
    dontSyncYet: existing.dontSyncYet,
    scheduledAt: existing.scheduledAt,
    publishChoice: existing.publishChoice,
    belkhidmahPresence: existing.belkhidmahPresence,
    belkhidmahSnapshot: existing.belkhidmahSnapshot ?? null
  }

  for (const field of TRACKED) {
    const mine = fieldValue(existing, field)
    const theirs = websiteField(w, field)
    const dirty = existing.dirtyFields.includes(field)
    if (!dirty) {
      next = applyWebsiteField(next, w, field)
    } else if (mine !== theirs) {
      next.conflicts.push({ field, mine, website: theirs })
    }
  }

  return next
}

export function runPull (
  state: AppState,
  providerIds: string[],
  choice: PullChoice,
  actor: string,
  fail?: boolean
): AppState {
  const stamp = nowStamp()
  if (fail) {
    return {
      ...state,
      lastPullResult: {
        at: stamp,
        choice,
        queuedCount: 0,
        rows: [],
        error: 'pullFailed'
      }
    }
  }

  const rows: PullRow[] = []
  let offerings = [...state.offerings]
  const providers = state.providers.map((p) =>
    providerIds.includes(p.id) ? { ...p, lastPullAt: stamp } : p
  )

  for (const providerId of providerIds) {
    const sites = state.website.filter((w) => w.providerId === providerId)
    const liveIds = new Set(sites.filter((w) => !w.dropped).map((w) => w.crmId))

    for (const w of sites) {
      if (w.dropped) continue
      const idx = offerings.findIndex((o) => o.providerId === providerId && o.crmId === w.crmId)
      const before = idx >= 0 ? offerings[idx] : undefined
      const after = upsertFromSite(before, w, providerId, stamp)
      const kind: PullRow['kind'] = !before
        ? 'new'
        : fieldValue(before, 'title') === after.titleEn &&
            fieldValue(before, 'price') === fieldValue(after, 'price') &&
            before.conflicts.length === after.conflicts.length
          ? 'unchanged'
          : 'updated'
      if (idx >= 0) offerings[idx] = after
      else offerings.push(after)
      const providerNameEn = providers.find((p) => p.id === providerId)?.nameEn ?? providerId
      rows.push({
        packageId: after.id,
        title: after.titleEn,
        providerName: providerNameEn,
        kind: before ? kind : 'new',
        queued: false,
        holdReason: null
      })
    }

    offerings = offerings.map((o) => {
      if (o.providerId !== providerId) return o
      if (liveIds.has(o.crmId)) return o
      return { ...o, crmPresence: 'missing', lastPullAt: stamp }
    })

    for (const o of offerings.filter((x) => x.providerId === providerId && x.crmPresence === 'missing')) {
      if (rows.some((r) => r.packageId === o.id)) continue
      rows.push({
        packageId: o.id,
        title: o.titleEn,
        providerName: providers.find((p) => p.id === providerId)?.nameEn ?? providerId,
        kind: 'unchanged',
        queued: false,
        holdReason: 'Missing from website'
      })
    }
  }

  let queuedCount = 0
  offerings = offerings.map((o) => {
    const row = rows.find((r) => r.packageId === o.id)
    if (!row) return o
    const hold = holdReason(o)
    row.holdReason = hold
    const succeeded = isSucceeded(o)
    if (choice === 'queue-succeeded' && succeeded) {
      queuedCount += 1
      row.queued = true
      return { ...o, publishChoice: 'next' as const, dontSyncYet: false }
    }
    row.queued = false
    return o
  })

  const activity = [
    {
      id: newId('act'),
      at: stamp,
      actor,
      providerName: providerIds
        .map((id) => providers.find((p) => p.id === id)?.nameEn ?? id)
        .join(', '),
      packageName: '—',
      action: 'Pull'
    },
    {
      id: newId('act'),
      at: stamp,
      actor,
      providerName: providerIds
        .map((id) => providers.find((p) => p.id === id)?.nameEn ?? id)
        .join(', '),
      packageName: '—',
      action: choice === 'queue-succeeded' ? 'Import and queue succeeded packages' : 'Import only'
    },
    ...state.activity
  ]

  const result: PullResult = {
    at: stamp,
    choice,
    queuedCount,
    rows,
    error: null
  }

  return {
    ...state,
    providers,
    offerings,
    activity,
    lastPullAt: stamp,
    lastPullResult: result
  }
}

export function runBelkhidmahJob (state: AppState, actor: string): AppState {
  const stamp = nowStamp()
  const offerings = state.offerings.map((o) => {
    if (o.hidden && o.belkhidmahPresence === 'live') {
      return { ...o, belkhidmahPresence: 'not_on_app' as const, lastJobAt: stamp }
    }
    if (o.dontSyncYet) return o
    if (o.publishChoice === 'next' && !o.hidden && o.conflicts.length === 0 && o.crmPresence === 'present') {
      return markLiveOnBelkhidmah(o, stamp)
    }
    return o
  })
  return {
    ...state,
    offerings,
    lastJobAt: stamp,
    activity: [
      {
        id: newId('act'),
        at: stamp,
        actor,
        providerName: 'All',
        packageName: '—',
        action: 'Run Belkhidmah sync now'
      },
      ...state.activity
    ]
  }
}

export function treatScheduledReached (state: AppState, actor: string): AppState {
  const stamp = nowStamp()
  const offerings = state.offerings.map((o) => {
    if (o.publishChoice === 'date' && o.scheduledAt) {
      return {
        ...markLiveOnBelkhidmah(o, stamp),
        publishChoice: 'now' as const,
        scheduledAt: null
      }
    }
    return o
  })
  return {
    ...state,
    offerings,
    activity: [
      {
        id: newId('act'),
        at: stamp,
        actor,
        providerName: 'All',
        packageName: '—',
        action: 'Treat scheduled time as reached'
      },
      ...state.activity
    ]
  }
}

export function applyPreset (_keys: PermKey[], preset: 'view' | 'price' | 'price-details' | 'full'): PackagePermissions {
  const allOff: PackagePermissions = {
    price: false,
    title: false,
    details: false,
    photos: false,
    city: false,
    hide: false,
    skipSync: false,
    now: false,
    date: false,
    next: false
  }
  if (preset === 'view') return allOff
  if (preset === 'full') {
    return {
      price: true,
      title: true,
      details: true,
      photos: true,
      city: true,
      hide: true,
      skipSync: true,
      now: true,
      date: true,
      next: true
    }
  }
  if (preset === 'price') return { ...allOff, price: true }
  return { ...allOff, price: true, title: true, details: true, city: true }
}

export function logActivity (
  state: AppState,
  actor: string,
  providerName: string,
  packageName: string,
  action: string
): AppState {
  return {
    ...state,
    activity: [
      {
        id: newId('act'),
        at: nowStamp(),
        actor,
        providerName,
        packageName,
        action
      },
      ...state.activity
    ]
  }
}

export function counts (offerings: Offering[], comingSoon: ComingSoonCard[], providerId?: string) {
  const scoped = providerId ? offerings.filter((o) => o.providerId === providerId) : offerings
  const soon = providerId ? comingSoon.filter((c) => c.providerId === providerId) : comingSoon
  return {
    providers: 0,
    ready: scoped.filter((o) => cardState(o) === 'Ready for next sync').length,
    live: scoped.filter((o) => o.belkhidmahPresence === 'live' && !o.hidden).length,
    hidden: scoped.filter((o) => o.hidden).length,
    conflict: scoped.filter((o) => o.conflicts.length > 0).length,
    missing: scoped.filter((o) => o.crmPresence === 'missing').length,
    comingSoon: soon.length
  }
}

export function snapshotFromFields (o: {
  titleEn: string
  titleAr: string
  durationEn: string
  durationAr: string
  descriptionEn: string
  descriptionAr: string
  photos: string[]
  price: number
  priceMode: Offering['priceMode']
  priceRules: Offering['priceRules']
  city: string
}): BelkhidmahSnapshot {
  return {
    titleEn: o.titleEn,
    titleAr: o.titleAr,
    durationEn: o.durationEn,
    durationAr: o.durationAr,
    descriptionEn: o.descriptionEn,
    descriptionAr: o.descriptionAr,
    photos: [...o.photos],
    price: summaryPrice(o.priceMode, o.price, o.priceRules),
    priceMode: o.priceMode,
    priceRules: cloneRules(o.priceRules),
    city: o.city
  }
}

export function snapshotFromOffering (o: Offering): BelkhidmahSnapshot {
  return snapshotFromFields(o)
}

export function markLiveOnBelkhidmah (o: Offering, stamp: string): Offering {
  return {
    ...o,
    belkhidmahPresence: 'live',
    publishChoice: 'now',
    lastJobAt: stamp,
    belkhidmahSnapshot: snapshotFromOffering(o)
  }
}

export function belkhidmahDiffFields (o: Offering): FieldKey[] {
  const s = o.belkhidmahSnapshot
  if (!s) return []
  const diffs: FieldKey[] = []
  if (
    o.price !== s.price ||
    o.priceMode !== s.priceMode ||
    serializePriceField(o.priceMode, o.price, o.priceRules) !==
      serializePriceField(s.priceMode, s.price, s.priceRules)
  ) {
    diffs.push('price')
  }
  if (o.titleEn !== s.titleEn || o.titleAr !== s.titleAr) diffs.push('title')
  if (o.descriptionEn !== s.descriptionEn || o.descriptionAr !== s.descriptionAr) diffs.push('details')
  if (o.photos.join('\0') !== s.photos.join('\0')) diffs.push('photos')
  if (o.city !== s.city) diffs.push('city')
  if (o.durationEn !== s.durationEn || o.durationAr !== s.durationAr) diffs.push('duration')
  return diffs
}

export function differsFromBelkhidmah (o: Offering): boolean {
  return o.belkhidmahPresence === 'live' && belkhidmahDiffFields(o).length > 0
}

export function matchesBelkhidmah (o: Offering): boolean {
  return o.belkhidmahPresence === 'live' && !!o.belkhidmahSnapshot && belkhidmahDiffFields(o).length === 0
}

export function hydrateOfferings (offerings: Offering[]): Offering[] {
  return offerings.map((o) => {
    const withPrice = hydratePriced(o)
    if (o.belkhidmahSnapshot !== undefined) {
      const snap = o.belkhidmahSnapshot
      return {
        ...withPrice,
        belkhidmahSnapshot: snap ? hydratePriced(snap) : null
      }
    }
    return {
      ...withPrice,
      belkhidmahSnapshot: o.belkhidmahPresence === 'live' ? snapshotFromOffering(withPrice) : null
    }
  })
}

export function hydrateWebsite (website: WebsitePackage[]): WebsitePackage[] {
  return website.map((w) => hydratePriced(w))
}

export function liveOnBelkhidmah (offerings: Offering[], providerId?: string): Offering[] {
  return offerings.filter(
    (o) => o.belkhidmahPresence === 'live' && (!providerId || o.providerId === providerId)
  )
}

export function isOnBelkhidmahNow (o: Offering): boolean {
  return o.belkhidmahPresence === 'live'
}

export function providerOnAppCounts (offerings: Offering[], providerId: string) {
  const on = offerings.filter((o) => o.providerId === providerId && o.belkhidmahPresence === 'live')
  return {
    onPlatform: on.length,
    live: on.filter((o) => !o.hidden).length,
    leaving: on.filter((o) => o.hidden).length
  }
}

export type PublishModeChip = {
  mode: PublishChoice
  label: string
  on: boolean
  offReason: string | null
}

export function publishModeChips (state: AppState, offering: Offering): PublishModeChip[] {
  const provider = state.providers.find((p) => p.id === offering.providerId)
  const rows: { mode: PublishChoice; label: string; platform: boolean; account: boolean; perm: boolean }[] = [
    { mode: 'now', label: 'Now', platform: state.platform.now, account: !!provider?.publish.now, perm: offering.permissions.now },
    { mode: 'date', label: 'On a date', platform: state.platform.date, account: !!provider?.publish.date, perm: offering.permissions.date },
    { mode: 'next', label: 'Next sync', platform: state.platform.next, account: !!provider?.publish.next, perm: offering.permissions.next }
  ]
  return rows.map((r) => {
    if (!r.platform) return { mode: r.mode, label: r.label, on: false, offReason: `Platform ${r.label} off` }
    if (!r.account) return { mode: r.mode, label: r.label, on: false, offReason: `Provider ${r.label} off` }
    if (!r.perm) return { mode: r.mode, label: r.label, on: false, offReason: 'Permission locked' }
    return { mode: r.mode, label: r.label, on: true, offReason: null }
  })
}

export function belkhidmahJobImpact (offerings: Offering[]) {
  let movedToLive = 0
  let removedFromPreview = 0
  let unchanged = 0
  for (const o of offerings) {
    if (o.hidden && o.belkhidmahPresence === 'live') {
      removedFromPreview += 1
      continue
    }
    if (o.dontSyncYet) {
      unchanged += 1
      continue
    }
    if (o.publishChoice === 'next' && !o.hidden && o.conflicts.length === 0 && o.crmPresence === 'present') {
      movedToLive += 1
      continue
    }
    unchanged += 1
  }
  return { movedToLive, removedFromPreview, unchanged }
}

export function publishIntentLabel (o: Offering): string {
  if (o.publishChoice === 'now') return 'Now'
  if (o.publishChoice === 'date') return o.scheduledAt ? `Scheduled ${o.scheduledAt} UTC+3` : 'Scheduled'
  if (o.publishChoice === 'next') return 'Next sync'
  return 'None'
}

export function emptyPermissions (): PackagePermissions {
  return applyPreset(PERM_KEYS, 'full')
}

export type { Provider }
