import type {
  AppState,
  Offering,
  PackagePermissions,
  Provider,
  UserAccount,
  WebsitePackage
} from './types'
import { snapshotFromFields } from './logic'
import { cloneRules } from './price'

export const STORAGE_KEY = 'belkhidmah-mitm-state'

const FULL: PackagePermissions = {
  price: true,
  title: true,
  details: true,
  photos: true,
  city: true,
  hide: true,
  skipSync: true,
  now: true,
  date: true,
  next: true
}

const HOUSEMAID: PackagePermissions = {
  ...FULL,
  title: false,
  photos: false
}

function offering (
  rest: Omit<Offering, 'dirtyFields' | 'conflicts' | 'lastPullAt' | 'lastJobAt' | 'permissions' | 'belkhidmahSnapshot'> & {
    dirtyFields?: Offering['dirtyFields']
    conflicts?: Offering['conflicts']
    permissions?: PackagePermissions
    belkhidmahSnapshot?: Offering['belkhidmahSnapshot']
  }
): Offering {
  return {
    dirtyFields: [],
    conflicts: [],
    belkhidmahSnapshot: null,
    lastPullAt: '2026-09-20 12:00',
    lastJobAt: '2026-09-20 12:00',
    permissions: FULL,
    ...rest
  }
}

function fromSite (site: WebsitePackage, extra: Partial<Offering> = {}): Offering {
  return offering({
    id: `${site.providerId}-${site.crmId}`,
    crmId: site.crmId,
    providerId: site.providerId,
    type: site.type,
    titleEn: site.titleEn,
    titleAr: site.titleAr,
    durationEn: site.durationEn,
    durationAr: site.durationAr,
    descriptionEn: site.descriptionEn,
    descriptionAr: site.descriptionAr,
    photos: [...site.photos],
    price: site.price,
    priceMode: site.priceMode,
    priceRules: cloneRules(site.priceRules),
    city: site.city,
    crmPresence: 'present',
    hidden: false,
    dontSyncYet: false,
    publishChoice: null,
    scheduledAt: null,
    belkhidmahPresence: 'not_on_app',
    ...extra
  })
}

export function createSeed (): AppState {
  const users: UserAccount[] = [
    {
      id: 'u-admin',
      email: 'admin@belkhidmah.test',
      password: 'Demo1234',
      role: 'admin',
      providerId: null,
      name: 'Admin'
    }
  ]

  const providers: Provider[] = [
    {
      id: 'manzil',
      nameEn: 'Al Manzil Home Services',
      nameAr: 'المنزل للخدمات المنزلية',
      contact: 'Khalid Al-Otaibi',
      email: 'manzil@belkhidmah.test',
      password: 'Demo1234',
      crmUrl: 'https://almanzil.example/services',
      active: true,
      canRefreshCrm: true,
      publish: { now: true, date: true, next: true },
      lastPullAt: '2026-09-20 12:00'
    },
    {
      id: 'bayt',
      nameEn: 'Bayt Al Noor',
      nameAr: 'بيت النور',
      contact: 'Noura A.',
      email: 'bayt@belkhidmah.test',
      password: 'Demo1234',
      crmUrl: 'https://baytalnoor.example/packages',
      active: true,
      canRefreshCrm: false,
      publish: { now: true, date: false, next: true },
      lastPullAt: '2026-09-20 12:00'
    }
  ]

  for (const p of providers) {
    users.push({
      id: `u-${p.id}`,
      email: p.email,
      password: p.password,
      role: 'provider',
      providerId: p.id,
      name: p.contact
    })
  }

  const website: WebsitePackage[] = [
    {
      crmId: 'home',
      providerId: 'manzil',
      type: 'hourly',
      titleEn: 'Home cleaning',
      titleAr: 'تنظيف المنزل',
      durationEn: '4-hour visit',
      durationAr: 'زيارة 4 ساعات',
      descriptionEn: 'Home cleaning visit.',
      descriptionAr: 'زيارة تنظيف منزل.',
      photos: ['Living room'],
      price: 300,
      priceMode: 'dynamic',
      priceRules: [
        {
          id: 'home-riyadh-soon',
          priority: 1,
          price: 300,
          conditions: [
            { id: 'home-riyadh', join: 'and', kind: 'city', city: 'Riyadh', fromDay: 0, toDay: null, effectOn: false, effectOp: 'addAmount', effectValue: 0 },
            { id: 'home-soon', join: 'and', kind: 'daysAfterBooking', city: '', fromDay: 0, toDay: 3, effectOn: false, effectOp: 'addAmount', effectValue: 0 }
          ]
        },
        {
          id: 'home-soon',
          priority: 2,
          price: 320,
          conditions: [
            { id: 'home-soon-days', join: 'and', kind: 'daysAfterBooking', city: '', fromDay: 0, toDay: 3, effectOn: false, effectOp: 'addAmount', effectValue: 0 }
          ]
        },
        {
          id: 'home-mid',
          priority: 3,
          price: 450,
          conditions: [
            { id: 'home-mid-days', join: 'and', kind: 'daysAfterBooking', city: '', fromDay: 4, toDay: 7, effectOn: false, effectOp: 'addAmount', effectValue: 0 }
          ]
        },
        {
          id: 'home-late',
          priority: 4,
          price: 500,
          conditions: [
            { id: 'home-late-days', join: 'and', kind: 'daysAfterBooking', city: '', fromDay: 8, toDay: null, effectOn: false, effectOp: 'addAmount', effectValue: 0 }
          ]
        }
      ],
      city: 'Riyadh',
      dropped: false
    },
    {
      crmId: 'monthly',
      providerId: 'manzil',
      type: 'hourly',
      titleEn: 'Monthly cleaning package',
      titleAr: 'باقة التنظيف الشهرية',
      durationEn: '8 visits × 4 hours',
      durationAr: '8 زيارات × 4 ساعات',
      descriptionEn: 'Monthly package.',
      descriptionAr: 'باقة شهرية.',
      photos: ['Calendar'],
      price: 1120,
      priceMode: 'fixed',
      priceRules: [],
      city: 'Riyadh',
      dropped: false
    },
    {
      crmId: 'laundry',
      providerId: 'manzil',
      type: 'hourly',
      titleEn: 'Laundry and ironing',
      titleAr: 'غسيل وكي',
      durationEn: '3-hour visit',
      durationAr: 'زيارة 3 ساعات',
      descriptionEn: 'Laundry visit.',
      descriptionAr: 'زيارة غسيل.',
      photos: ['Iron'],
      price: 135,
      priceMode: 'fixed',
      priceRules: [],
      city: 'Jeddah',
      dropped: false
    },
    {
      crmId: 'housemaid',
      providerId: 'manzil',
      type: 'stay-in',
      titleEn: 'Stay-in housemaid',
      titleAr: 'عاملة منزلية مقيمة',
      durationEn: '30 days',
      durationAr: '30 يوماً',
      descriptionEn: 'Stay-in housemaid.',
      descriptionAr: 'عاملة مقيمة.',
      photos: ['Uniform photo'],
      price: 3600,
      priceMode: 'fixed',
      priceRules: [],
      city: 'Riyadh',
      dropped: false
    },
    {
      crmId: 'cook',
      providerId: 'manzil',
      type: 'stay-in',
      titleEn: 'Family cook',
      titleAr: 'طباخ عائلي',
      durationEn: '30 days',
      durationAr: '30 يوماً',
      descriptionEn: 'Family cook.',
      descriptionAr: 'طباخ عائلي.',
      photos: ['Kitchen'],
      price: 4500,
      priceMode: 'fixed',
      priceRules: [],
      city: 'Riyadh',
      dropped: false
    },
    {
      crmId: 'driver',
      providerId: 'manzil',
      type: 'stay-in',
      titleEn: 'Private driver',
      titleAr: 'سائق خاص',
      durationEn: '30 days',
      durationAr: '30 يوماً',
      descriptionEn: 'Private driver.',
      descriptionAr: 'سائق خاص.',
      photos: ['Car'],
      price: 3200,
      priceMode: 'fixed',
      priceRules: [],
      city: 'Riyadh',
      dropped: false
    },
    {
      crmId: 'nanny',
      providerId: 'manzil',
      type: 'stay-in',
      titleEn: 'Nanny',
      titleAr: 'مربية',
      durationEn: '30 days',
      durationAr: '30 يوماً',
      descriptionEn: 'Nanny.',
      descriptionAr: 'مربية.',
      photos: ['Playroom'],
      price: 3900,
      priceMode: 'fixed',
      priceRules: [],
      city: 'Riyadh',
      dropped: false
    },
    {
      crmId: 'home',
      providerId: 'bayt',
      type: 'hourly',
      titleEn: 'Home cleaning',
      titleAr: 'تنظيف المنزل',
      durationEn: '4-hour visit',
      durationAr: 'زيارة 4 ساعات',
      descriptionEn: 'Home cleaning visit.',
      descriptionAr: 'زيارة تنظيف منزل.',
      photos: ['Hall'],
      price: 180,
      priceMode: 'fixed',
      priceRules: [],
      city: 'Jeddah',
      dropped: false
    }
  ]

  const byCrm = (providerId: string, crmId: string) =>
    website.find((w) => w.providerId === providerId && w.crmId === crmId)!

  const offerings: Offering[] = [
    fromSite(byCrm('manzil', 'home'), {
      belkhidmahPresence: 'live',
      publishChoice: 'now',
      belkhidmahSnapshot: snapshotFromFields(byCrm('manzil', 'home'))
    }),
    fromSite(byCrm('manzil', 'monthly'), {
      publishChoice: 'next'
    }),
    fromSite(byCrm('manzil', 'laundry'), {
      hidden: true,
      belkhidmahPresence: 'live',
      belkhidmahSnapshot: snapshotFromFields(byCrm('manzil', 'laundry'))
    }),
    fromSite(byCrm('manzil', 'housemaid'), {
      belkhidmahPresence: 'live',
      publishChoice: 'now',
      permissions: HOUSEMAID,
      price: 3800,
      belkhidmahSnapshot: snapshotFromFields(byCrm('manzil', 'housemaid'))
    }),
    fromSite(byCrm('manzil', 'cook'), {
      price: 4200,
      dirtyFields: ['price'],
      conflicts: [{ field: 'price', mine: '4200', website: '4500' }]
    }),
    fromSite(byCrm('manzil', 'driver'), {
      dontSyncYet: true
    }),
    fromSite(byCrm('manzil', 'nanny'), {
      publishChoice: 'date',
      scheduledAt: '2026-09-25 09:00'
    }),
    fromSite(byCrm('bayt', 'home'), {
      publishChoice: 'next'
    })
  ]

  return {
    users,
    providers,
    website,
    offerings,
    comingSoon: [
      {
        providerId: 'manzil',
        titleEn: 'Isteqdam and mediation',
        titleAr: 'الاستقدام والوساطة'
      }
    ],
    platform: { now: true, date: true, next: true },
    activity: [],
    session: null,
    locale: 'en',
    lastPullAt: '2026-09-20 12:00',
    lastJobAt: '2026-09-20 12:00',
    lastPullResult: null
  }
}
