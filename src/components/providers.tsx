'use client'

import { useEffect } from 'react'
import { StoreProvider, useStore } from '@/lib/store'

export function Providers ({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>
}

export function LocaleRoot ({ children }: { children: React.ReactNode }) {
  const { state, ready, t } = useStore()

  useEffect(() => {
    document.documentElement.lang = state.locale
    document.documentElement.dir = state.locale === 'ar' ? 'rtl' : 'ltr'
  }, [state.locale])

  if (!ready) return <div className="p-8 text-sm text-neutral-500">{t('loading')}</div>
  return (
    <div lang={state.locale} dir={state.locale === 'ar' ? 'rtl' : 'ltr'} className={state.locale === 'ar' ? 'locale-ar' : ''}>
      {children}
    </div>
  )
}
