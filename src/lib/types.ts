export type Locale = 'en' | 'ar'
export type Role = 'admin' | 'provider'
export type PackageType = 'hourly' | 'stay-in'
export type PriceMode = 'fixed' | 'dynamic'
export type PriceJoin = 'and' | 'or'
export type PriceConditionKind = 'city' | 'daysAfterBooking'
export type PriceEffectOp = 'addAmount' | 'addPercent' | 'subtractAmount' | 'subtractPercent'

export interface PriceCondition {
  id: string
  join: PriceJoin
  kind: PriceConditionKind
  city: string
  fromDay: number
  toDay: number | null
  effectOn: boolean
  effectOp: PriceEffectOp
  effectValue: number
}

export interface PriceRule {
  id: string
  priority: number
  conditions: PriceCondition[]
  price: number
}

export type CrmPresence = 'present' | 'missing'
export type BelkhidmahPresence = 'not_on_app' | 'live'
export type PublishChoice = 'now' | 'date' | 'next'
export type PullChoice = 'import-only' | 'queue-succeeded'
export type HoldReason =
  | 'Conflict'
  | 'Hidden'
  | "Don't sync yet"
  | 'Coming soon'
  | 'Missing from website'
  | 'Error'

export type PermKey =
  | 'price'
  | 'title'
  | 'details'
  | 'photos'
  | 'city'
  | 'hide'
  | 'skipSync'
  | 'now'
  | 'date'
  | 'next'

export const PERM_KEYS: PermKey[] = [
  'price',
  'title',
  'details',
  'photos',
  'city',
  'hide',
  'skipSync',
  'now',
  'date',
  'next'
]

export const PERM_LABELS: Record<PermKey, string> = {
  price: 'Price',
  title: 'Title',
  details: 'Details',
  photos: 'Photos',
  city: 'City',
  hide: 'Hide',
  skipSync: "Don't sync yet",
  now: 'Now',
  date: 'On a date',
  next: 'Next sync'
}

export type FieldKey = 'price' | 'title' | 'details' | 'photos' | 'city' | 'duration'

export interface PackagePermissions {
  price: boolean
  title: boolean
  details: boolean
  photos: boolean
  city: boolean
  hide: boolean
  skipSync: boolean
  now: boolean
  date: boolean
  next: boolean
}

export interface PublishModes {
  now: boolean
  date: boolean
  next: boolean
}

export interface UserAccount {
  id: string
  email: string
  password: string
  role: Role
  providerId: string | null
  name: string
}

export interface Provider {
  id: string
  nameEn: string
  nameAr: string
  contact: string
  email: string
  password: string
  crmUrl: string
  active: boolean
  canRefreshCrm: boolean
  publish: PublishModes
  lastPullAt: string | null
}

export interface WebsitePackage {
  crmId: string
  providerId: string
  type: PackageType
  titleEn: string
  titleAr: string
  durationEn: string
  durationAr: string
  descriptionEn: string
  descriptionAr: string
  photos: string[]
  price: number
  priceMode: PriceMode
  priceRules: PriceRule[]
  city: string
  dropped: boolean
}

export interface FieldConflict {
  field: FieldKey
  mine: string
  website: string
}

export interface BelkhidmahSnapshot {
  titleEn: string
  titleAr: string
  durationEn: string
  durationAr: string
  descriptionEn: string
  descriptionAr: string
  photos: string[]
  price: number
  priceMode: PriceMode
  priceRules: PriceRule[]
  city: string
}

export interface Offering {
  id: string
  crmId: string
  providerId: string
  type: PackageType
  titleEn: string
  titleAr: string
  durationEn: string
  durationAr: string
  descriptionEn: string
  descriptionAr: string
  photos: string[]
  price: number
  priceMode: PriceMode
  priceRules: PriceRule[]
  city: string
  dirtyFields: FieldKey[]
  conflicts: FieldConflict[]
  crmPresence: CrmPresence
  hidden: boolean
  dontSyncYet: boolean
  publishChoice: PublishChoice | null
  scheduledAt: string | null
  belkhidmahPresence: BelkhidmahPresence
  belkhidmahSnapshot: BelkhidmahSnapshot | null
  permissions: PackagePermissions
  lastPullAt: string | null
  lastJobAt: string | null
}

export interface ComingSoonCard {
  providerId: string
  titleEn: string
  titleAr: string
}

export interface ActivityLine {
  id: string
  at: string
  actor: string
  providerName: string
  packageName: string
  action: string
}

export interface PullRow {
  packageId: string
  title: string
  providerName: string
  kind: 'new' | 'updated' | 'unchanged'
  queued: boolean
  holdReason: HoldReason | null
}

export interface PullResult {
  at: string
  choice: PullChoice
  queuedCount: number
  rows: PullRow[]
  error: string | null
}

export interface Session {
  userId: string
}

export interface AppState {
  users: UserAccount[]
  providers: Provider[]
  website: WebsitePackage[]
  offerings: Offering[]
  comingSoon: ComingSoonCard[]
  platform: PublishModes
  activity: ActivityLine[]
  session: Session | null
  locale: Locale
  lastPullAt: string | null
  lastJobAt: string | null
  lastPullResult: PullResult | null
}

export type CardState =
  | 'Ready for next sync'
  | 'Not queued'
  | "Don't sync yet"
  | 'Scheduled'
  | 'Live'
  | 'Hidden'
  | 'Conflict'
  | 'Missing from website'
  | 'Coming soon'
