import { offeringStaticParams } from '@/lib/static-params'

export function generateStaticParams () {
  return offeringStaticParams()
}

export default function Layout ({ children }: { children: React.ReactNode }) {
  return children
}
