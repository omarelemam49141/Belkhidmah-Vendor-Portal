import { Cairo, Tajawal } from 'next/font/google'

export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
})

export const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
  weight: ['400', '500', '700', '800'],
  display: 'swap'
})
