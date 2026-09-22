import type { Metadata } from 'next'
import { cairo, tajawal } from '@/lib/fonts'
import { LocaleRoot, Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Belkhidmah MITM',
  description: 'Provider and admin mock for packages between CRM websites and Belkhidmah App.'
}

export default function RootLayout ({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cairo.variable} ${tajawal.variable}`}>
      <body className="font-sans">
        <Providers>
          <LocaleRoot>{children}</LocaleRoot>
        </Providers>
      </body>
    </html>
  )
}
