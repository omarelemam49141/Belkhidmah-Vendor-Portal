'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type {
  AppState,
  FieldKey,
  Offering,
  PackagePermissions,
  Provider,
  PublishChoice,
  PullChoice,
  UserAccount
} from './types'
import { createSeed, STORAGE_KEY } from './seed'
import { translate } from './i18n'
import { cloneRules, summaryPrice } from './price'
import {
  allowedPublishModes,
  applyPreset,
  hydrateOfferings,
  hydrateWebsite,
  logActivity,
  newId,
  runBelkhidmahJob,
  runPull,
  snapshotFromOffering,
  treatScheduledReached
} from './logic'

type StoreValue = {
  state: AppState
  ready: boolean
  currentUser: UserAccount | null
  currentProvider: Provider | null
  actor: string
  t: (key: string, vars?: Record<string, string | number>) => string
  setLocale: (locale: 'en' | 'ar') => void
  login: (email: string, password: string) => 'ok' | 'empty-email' | 'empty-password' | 'bad' | 'inactive'
  logout: () => void
  restoreDemo: () => void
  saveProvider: (provider: Provider, isNew: boolean) => string[]
  setPermissions: (
    providerId: string,
    selectedIds: string[],
    patch: Partial<PackagePermissions> | 'view' | 'price' | 'price-details' | 'full'
  ) => void
  pull: (providerIds: string[], choice: PullChoice, fail?: boolean) => void
  resolveConflicts: (packageId: string, decisions: Record<string, 'mine' | 'website'>) => void
  saveOffering: (offering: Offering, markDirty: FieldKey[]) => void
  hideOffering: (id: string) => void
  unhideOffering: (id: string) => void
  setDontSync: (id: string, value: boolean) => void
  publish: (id: string, choice: PublishChoice, scheduledAt?: string) => string | null
  runJob: () => void
  reachSchedule: () => void
  setPlatform: (patch: Partial<AppState['platform']>) => void
  updateWebsite: (crmId: string, providerId: string, patch: Partial<AppState['website'][number]>) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider ({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(createSeed)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AppState
        setState({
          ...parsed,
          offerings: hydrateOfferings(parsed.offerings ?? []),
          website: hydrateWebsite(parsed.website ?? [])
        })
      } catch {
        setState(createSeed())
      }
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, ready])

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.session?.userId) ?? null,
    [state]
  )
  const currentProvider = useMemo(
    () => state.providers.find((p) => p.id === currentUser?.providerId) ?? null,
    [state, currentUser]
  )
  const actor = currentUser?.role === 'admin' ? 'Admin' : currentUser?.name ?? 'User'

  const value: StoreValue = {
    state,
    ready,
    currentUser,
    currentProvider,
    actor,
    t: (key, vars) => translate(state.locale, key, vars),
    setLocale: (locale) => setState((s) => ({ ...s, locale })),
    login: (email, password) => {
      if (!email.trim()) return 'empty-email'
      if (!password) return 'empty-password'
      const user = state.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      if (!user || user.password !== password) return 'bad'
      if (user.role === 'provider') {
        const p = state.providers.find((x) => x.id === user.providerId)
        if (p && !p.active) return 'inactive'
      }
      setState((s) => ({ ...s, session: { userId: user.id } }))
      return 'ok'
    },
    logout: () => setState((s) => ({ ...s, session: null })),
    restoreDemo: () => setState((s) => ({ ...createSeed(), session: s.session, locale: s.locale })),
    saveProvider: (provider, isNew) => {
      const errors: string[] = []
      if (!provider.nameEn.trim()) errors.push('enterEnglishName')
      if (!provider.nameAr.trim()) errors.push('enterArabicName')
      if (!provider.email.trim()) errors.push('enterAnEmail')
      if (!provider.crmUrl.trim()) errors.push('enterCrmUrl')
      if (isNew && !provider.password.trim()) errors.push('enterAPassword')
      if (errors.length) return errors
      setState((s) => {
        const id = isNew ? provider.id || newId('prv') : provider.id
        const saved = { ...provider, id }
        const providers = isNew ? [...s.providers, saved] : s.providers.map((p) => (p.id === id ? saved : p))
        const existing = s.users.find((u) => u.providerId === id)
        const account: UserAccount = {
          id: existing?.id ?? `u-${id}`,
          email: saved.email,
          password: saved.password || existing?.password || 'Demo1234',
          role: 'provider',
          providerId: id,
          name: saved.contact || saved.nameEn
        }
        const users = existing
          ? s.users.map((u) => (u.id === existing.id ? account : u))
          : [...s.users, account]
        return { ...s, providers, users }
      })
      return []
    },
    setPermissions: (providerId, selectedIds, patch) => {
      setState((s) => ({
        ...s,
        offerings: s.offerings.map((o) => {
          if (o.providerId !== providerId) return o
          if (!selectedIds.includes(o.id)) return o
          const nextPerm = typeof patch === 'string' ? applyPreset([], patch) : { ...o.permissions, ...patch }
          return { ...o, permissions: nextPerm }
        })
      }))
    },
    pull: (providerIds, choice, fail) => setState((s) => runPull(s, providerIds, choice, actor, fail)),
    resolveConflicts: (packageId, decisions) => {
      setState((s) => {
        const o = s.offerings.find((x) => x.id === packageId)
        if (!o) return s
        const site = s.website.find((w) => w.providerId === o.providerId && w.crmId === o.crmId)
        const next: Offering = {
          ...o,
          photos: [...o.photos],
          priceRules: cloneRules(o.priceRules),
          conflicts: [],
          dirtyFields: [...o.dirtyFields]
        }
        for (const c of o.conflicts) {
          if ((decisions[c.field] ?? 'mine') !== 'website' || !site) continue
          if (c.field === 'price') {
            next.price = site.price
            next.priceMode = site.priceMode
            next.priceRules = cloneRules(site.priceRules)
          }
          if (c.field === 'title') {
            next.titleEn = site.titleEn
            next.titleAr = site.titleAr
          }
          if (c.field === 'details') {
            next.descriptionEn = site.descriptionEn
            next.descriptionAr = site.descriptionAr
          }
          if (c.field === 'photos') next.photos = [...site.photos]
          if (c.field === 'city') next.city = site.city
          if (c.field === 'duration') {
            next.durationEn = site.durationEn
            next.durationAr = site.durationAr
          }
          next.dirtyFields = next.dirtyFields.filter((f) => f !== c.field)
        }
        const providerName = s.providers.find((p) => p.id === o.providerId)?.nameEn ?? ''
        return logActivity(
          { ...s, offerings: s.offerings.map((x) => (x.id === packageId ? next : x)) },
          actor,
          providerName,
          o.titleEn,
          'Conflict resolution'
        )
      })
    },
    saveOffering: (offering, markDirty) => {
      setState((s) => {
        const prev = s.offerings.find((x) => x.id === offering.id)
        const next = {
          ...offering,
          photos: [...offering.photos],
          priceRules: cloneRules(offering.priceRules),
          price: summaryPrice(offering.priceMode, offering.price, offering.priceRules),
          dirtyFields: [...new Set([...(prev?.dirtyFields ?? []), ...markDirty])]
        }
        const providerName = s.providers.find((p) => p.id === offering.providerId)?.nameEn ?? ''
        return logActivity(
          { ...s, offerings: s.offerings.map((x) => (x.id === offering.id ? next : x)) },
          actor,
          providerName,
          offering.titleEn,
          'Edit'
        )
      })
    },
    hideOffering: (id) => {
      setState((s) => {
        const o = s.offerings.find((x) => x.id === id)
        if (!o) return s
        const providerName = s.providers.find((p) => p.id === o.providerId)?.nameEn ?? ''
        return logActivity(
          { ...s, offerings: s.offerings.map((x) => (x.id === id ? { ...x, hidden: true } : x)) },
          actor,
          providerName,
          o.titleEn,
          'Hide'
        )
      })
    },
    unhideOffering: (id) =>
      setState((s) => ({
        ...s,
        offerings: s.offerings.map((x) => (x.id === id ? { ...x, hidden: false } : x))
      })),
    setDontSync: (id, value) => {
      setState((s) => {
        const o = s.offerings.find((x) => x.id === id)
        if (!o) return s
        const providerName = s.providers.find((p) => p.id === o.providerId)?.nameEn ?? ''
        return logActivity(
          {
            ...s,
            offerings: s.offerings.map((x) =>
              x.id === id ? { ...x, dontSyncYet: value, publishChoice: value ? null : x.publishChoice } : x
            )
          },
          actor,
          providerName,
          o.titleEn,
          "Don't sync yet"
        )
      })
    },
    publish: (id, choice, scheduledAt) => {
      const offering = state.offerings.find((x) => x.id === id)
      if (!offering) return 'missingPackage'
      const modes = allowedPublishModes(state, offering)
      if (!modes.length || !modes.includes(choice)) return 'publishingOff'
      if (choice === 'date' && !scheduledAt) return 'enterFutureDate'
      setState((s) => {
        const o = s.offerings.find((x) => x.id === id)!
        const updated: Offering = {
          ...o,
          hidden: false,
          dontSyncYet: false,
          publishChoice: choice,
          scheduledAt: choice === 'date' ? scheduledAt ?? null : null,
          belkhidmahPresence: choice === 'now' ? 'live' : o.belkhidmahPresence,
          belkhidmahSnapshot: choice === 'now' ? snapshotFromOffering(o) : o.belkhidmahSnapshot
        }
        const providerName = s.providers.find((p) => p.id === o.providerId)?.nameEn ?? ''
        return logActivity(
          { ...s, offerings: s.offerings.map((x) => (x.id === id ? updated : x)) },
          actor,
          providerName,
          o.titleEn,
          'Publish'
        )
      })
      return null
    },
    runJob: () => setState((s) => runBelkhidmahJob(s, actor)),
    reachSchedule: () => setState((s) => treatScheduledReached(s, actor)),
    setPlatform: (patch) => setState((s) => ({ ...s, platform: { ...s.platform, ...patch } })),
    updateWebsite: (crmId, providerId, patch) => {
      setState((s) => ({
        ...s,
        website: s.website.map((w) =>
          w.crmId === crmId && w.providerId === providerId ? { ...w, ...patch } : w
        )
      }))
    }
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore () {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore outside provider')
  return ctx
}
