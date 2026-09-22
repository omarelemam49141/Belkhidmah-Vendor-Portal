'use client'

import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { FadeIn } from '@/components/motion/fade-in'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { providerName } from '@/lib/logic'

export default function ProvidersPage () {
  const { state, t } = useStore()
  const locale = state.locale
  return (
    <AppShell role="admin" title={t('providers')}>
      <FadeIn>
        <Button asChild className="mb-5"><Link href="/admin/providers/new">{t('addProvider')}</Link></Button>
        <div className="list-panel overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('crmUrl')}</th>
                <th className="text-center">{t('active')}</th>
                <th className="text-center">{t('refresh')}</th>
                <th>{t('publish')}</th>
              </tr>
            </thead>
            <tbody>
              {state.providers.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link className="font-semibold text-brand-magenta underline" href={`/admin/providers/${p.id}`}>{providerName(state, p.id, locale)}</Link>
                    <div className="text-xs text-neutral-500">{locale === 'ar' ? p.nameEn : p.nameAr}</div>
                  </td>
                  <td>{p.crmUrl}</td>
                  <td className="text-center">{p.active ? t('yes') : t('no')}</td>
                  <td className="text-center">{p.canRefreshCrm ? t('yes') : t('no')}</td>
                  <td className="text-xs">
                    {p.publish.now ? `${t('now')} ` : ''}
                    {p.publish.date ? `${t('onADate')} ` : ''}
                    {p.publish.next ? t('nextSync') : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>
    </AppShell>
  )
}
