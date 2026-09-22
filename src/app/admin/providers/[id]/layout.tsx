import { providerStaticParams } from '@/lib/static-params'

export function generateStaticParams () {
  return providerStaticParams()
}

export default function Layout ({ children }: { children: React.ReactNode }) {
  return children
}
