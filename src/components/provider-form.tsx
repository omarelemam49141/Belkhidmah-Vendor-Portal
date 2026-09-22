'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import type { Provider } from '@/lib/types'
import { newId } from '@/lib/logic'

export function ProviderForm ({ existing }: { existing?: Provider }) {
  const { saveProvider, t } = useStore()
  const router = useRouter()
  const [errors, setErrors] = useState<string[]>([])
  const [form, setForm] = useState<Provider>(
    existing ?? {
      id: newId('prv'),
      nameEn: '',
      nameAr: '',
      contact: '',
      email: '',
      password: '',
      crmUrl: '',
      active: true,
      canRefreshCrm: false,
      publish: { now: true, date: true, next: true },
      lastPullAt: null
    }
  )

  return (
    <form
      className="list-panel max-w-xl space-y-4 p-4"
      onSubmit={(e) => {
        e.preventDefault()
        const next = saveProvider(form, !existing)
        setErrors(next)
        if (!next.length) router.push('/admin/providers')
      }}
    >
      {errors.map((err) => (
        <p key={err} className="app-error">{t(err)}</p>
      ))}
      <label className="app-label">{t('englishName')}
        <input className="app-field mt-1 w-full" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
      </label>
      <label className="app-label">{t('arabicName')}
        <input className="app-field mt-1 w-full" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
      </label>
      <label className="app-label">{t('contact')}
        <input className="app-field mt-1 w-full" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
      </label>
      <label className="app-label">{t('email')}
        <input className="app-field mt-1 w-full" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label className="app-label">{t('crmWebsiteUrl')}
        <input className="app-field mt-1 w-full" value={form.crmUrl} onChange={(e) => setForm({ ...form, crmUrl: e.target.value })} />
      </label>
      <label className="app-label">{t('password')}
        <input className="app-field mt-1 w-full" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </label>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" className="accent-brand-magenta" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
        {t('active')}
      </label>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" className="accent-brand-magenta" checked={form.canRefreshCrm} onChange={(e) => setForm({ ...form, canRefreshCrm: e.target.checked })} />
        {t('canRefreshCrm')}
      </label>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" className="accent-brand-magenta" checked={form.publish.now} onChange={(e) => setForm({ ...form, publish: { ...form.publish, now: e.target.checked } })} />
        {t('now')}
      </label>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" className="accent-brand-magenta" checked={form.publish.date} onChange={(e) => setForm({ ...form, publish: { ...form.publish, date: e.target.checked } })} />
        {t('onADate')}
      </label>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" className="accent-brand-magenta" checked={form.publish.next} onChange={(e) => setForm({ ...form, publish: { ...form.publish, next: e.target.checked } })} />
        {t('nextSync')}
      </label>
      <div className="flex flex-wrap gap-2 pt-2">
        <Button type="submit">{t('save')}</Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/providers')}>{t('cancel')}</Button>
      </div>
    </form>
  )
}
