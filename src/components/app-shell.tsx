'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BrandMark } from '@/components/brand/BrandMark'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function LanguageSwitch ({ className }: { className?: string }) {
  const { state, setLocale, t } = useStore()
  return (
    <Button
      variant="ghost"
      type="button"
      className={className}
      onClick={() => setLocale(state.locale === 'en' ? 'ar' : 'en')}
    >
      {t('lang')}
    </Button>
  )
}

function navActive (path: string, href: string) {
  if (path === href) return true
  if (href === '/admin' || href === '/provider') return false
  return path.startsWith(`${href}/`)
}

export function AppShell ({
  role,
  title,
  children
}: {
  role: 'admin' | 'provider'
  title: string
  children: React.ReactNode
}) {
  const { ready, currentUser, currentProvider, t, logout, state } = useStore()
  const router = useRouter()
  const path = usePathname()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (!currentUser) {
      router.replace('/')
      return
    }
    if (role === 'admin' && currentUser.role !== 'admin') router.replace('/provider')
    if (role === 'provider' && currentUser.role !== 'provider') router.replace('/admin')
  }, [ready, currentUser, role, router])

  useEffect(() => {
    setNavOpen(false)
  }, [path])

  if (!ready || !currentUser) return null
  if (role === 'admin' && currentUser.role !== 'admin') return null
  if (role === 'provider' && currentUser.role !== 'provider') return null

  const adminNav = [
    { href: '/admin', label: t('home') },
    { href: '/admin/providers', label: t('providers') },
    { href: '/admin/pull', label: t('pullCrm') },
    { href: '/admin/catalog', label: t('catalog') },
    { href: '/admin/mock-crm', label: t('mockCrm') },
    { href: '/admin/platform', label: t('platform') },
    { href: '/admin/activity', label: t('activity') }
  ]
  const providerNav = [
    { href: '/provider', label: t('home') },
    { href: '/provider/packages', label: t('myPackages') },
    { href: '/provider/on-belkhidmah', label: t('onBelkhidmah') }
  ]
  const nav = role === 'admin' ? adminNav : providerNav
  const kicker = currentUser.role === 'admin'
    ? t('admin')
    : state.locale === 'ar'
      ? currentProvider?.nameAr
      : currentProvider?.nameEn

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {navOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-overlay-ink/45 lg:hidden"
          aria-label={t('openMenu')}
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-40 w-60 border-e border-neutral-200 bg-white p-4 transition-transform duration-200',
          navOpen ? 'translate-x-0' : '-translate-x-[105%] rtl:translate-x-[105%] lg:translate-x-0 rtl:lg:translate-x-0'
        )}
      >
        <div className="mb-6 flex items-center gap-3">
          <BrandMark size={36} />
          <div>
            <p className="text-[0.7rem] font-extrabold tracking-[0.14em] text-brand-magenta uppercase">بالخدمة</p>
            <p className="text-sm text-neutral-500">{t('mitmMock')}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm transition-colors duration-150',
                navActive(path, item.href)
                  ? 'bg-brand-blush font-semibold text-brand-magenta'
                  : 'text-neutral-700 hover:bg-neutral-100'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:ps-60">
        <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            className="flex size-10 flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-neutral-100 lg:hidden"
            aria-label={t('openMenu')}
            onClick={() => setNavOpen((open) => !open)}
          >
            <span className="block h-0.5 w-5 rounded-full bg-neutral-800" />
            <span className="block h-0.5 w-5 rounded-full bg-neutral-800" />
            <span className="block h-0.5 w-5 rounded-full bg-neutral-800" />
          </button>
          <div>
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">{kicker}</p>
            <h1 className="font-heading text-xl font-extrabold text-neutral-900">{title}</h1>
          </div>
          <div className="ms-auto flex items-center gap-2">
            <LanguageSwitch />
            <span className="hidden text-sm text-neutral-600 sm:inline">
              {currentUser.role === 'admin' ? t('admin') : currentUser.name}
            </span>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                logout()
                router.push('/')
              }}
            >
              {t('logOut')}
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
