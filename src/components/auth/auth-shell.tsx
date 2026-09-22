'use client'

import { BrandMark } from '@/components/brand/BrandMark'
import { FadeIn } from '@/components/motion/fade-in'
import { LanguageSwitch } from '@/components/app-shell'
import { useStore } from '@/lib/store'

export function AuthShell ({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  const { t } = useStore()

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-brand-pink selection:text-white">
      <div className="absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2400&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-overlay-ink/90 via-overlay-mid/78 to-overlay-ink/94" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(75,109,148,0.28)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <FadeIn className="order-2 text-center lg:order-1 lg:text-start">
          <BrandMark
            size={72}
            className="mx-auto mb-6 drop-shadow-[0_6px_18px_rgba(0,0,0,0.75)] lg:mx-0"
          />
          <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-brand-blush uppercase">
            {t('visualKicker')}
          </p>
          <h1 className="mb-4 max-w-xl text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('visualTitle')}
          </h1>
          <p className="mx-auto max-w-xl text-base font-normal leading-relaxed text-white/90 sm:text-xl lg:mx-0">
            {t('visualBody')}
          </p>
        </FadeIn>

        <FadeIn delay={0.12} className="order-1 lg:order-2">
          <div className="mb-4 flex justify-end">
            <LanguageSwitch className="text-white/80 hover:bg-white/10 hover:text-white" />
          </div>
          <section className="glass-card-dark mx-auto w-full max-w-md rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(11,19,36,0.55)] sm:p-8">
            <h2 className={`text-2xl font-extrabold text-white ${description ? 'mb-1' : 'mb-6'}`}>{title}</h2>
            {description ? (
              <p className="mb-6 text-sm leading-relaxed text-white/70">{description}</p>
            ) : null}
            {children}
          </section>
        </FadeIn>
      </div>
    </div>
  )
}
