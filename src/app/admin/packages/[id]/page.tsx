'use client'

import { useParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { FadeIn } from '@/components/motion/fade-in'
import { PackageEditor } from '@/components/package-editor'
import { useStore } from '@/lib/store'

export default function AdminPackagePage () {
  const { id } = useParams<{ id: string }>()
  const { t } = useStore()
  return (
    <AppShell role="admin" title={t('package')}>
      <FadeIn>
        <PackageEditor offeringId={id} locked={false} />
      </FadeIn>
    </AppShell>
  )
}
