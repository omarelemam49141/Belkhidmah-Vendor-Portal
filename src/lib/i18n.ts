import type {
  CardState,
  FieldKey,
  HoldReason,
  Locale,
  Offering,
  PermKey,
  PriceMode,
  PriceCondition,
  PriceRule,
  BelkhidmahSnapshot,
  WebsitePackage
} from './types'
import { priceRange } from './price'

export const EN = {
  signIn: 'Sign in',
  forgot: 'Forgot password',
  admin: 'Admin',
  home: 'Home',
  providers: 'Providers',
  pullCrm: 'Pull CRM',
  catalog: 'Catalog',
  platform: 'Platform',
  activity: 'Activity',
  myPackages: 'My packages',
  onBelkhidmah: 'On Belkhidmah',
  logOut: 'Log out',
  restore: 'Restore demo data',
  lang: 'العربية',
  loading: 'Loading…',
  mitmMock: 'MITM mock',
  mockCrm: 'Mock CRM',
  mockCrmHint: 'Change website values before a pull. Testers use this for clean updates, conflicts, and missing packages.',
  email: 'Email',
  password: 'Password',
  showPassword: 'Show password',
  enterEmail: 'Enter your email.',
  enterPassword: 'Enter your password.',
  badLogin: 'Email or password is incorrect.',
  demoHint: 'Demo: admin@belkhidmah.test, manzil@belkhidmah.test, bayt@belkhidmah.test · Demo1234',
  brandTitle: 'Belkhidmah MITM',
  visualKicker: 'Belkhidmah',
  visualTitle: 'Packages between providers and بالخدمة',
  visualBody: 'Sign in to manage the catalog that sits between provider websites and the app.',
  homeLead: 'Packages between provider websites and بالخدمة.',
  openMenu: 'Open menu',
  addProvider: 'Add provider',
  name: 'Name',
  crmUrl: 'CRM URL',
  active: 'Active',
  inactive: 'Inactive',
  refresh: 'Refresh',
  publish: 'Publish',
  yes: 'Yes',
  no: 'No',
  permissions: 'Permissions',
  notFound: 'Not found.',
  packageNotFound: 'Package not found.',
  findPackage: 'Find a package',
  tabAll: 'All',
  tabHourly: 'Hourly',
  tabStayIn: 'Stay-in',
  tabHidden: 'Hidden',
  allProviders: 'All providers',
  allCities: 'All cities',
  allStates: 'All states',
  noPackagesMatch: 'No packages match your search.',
  manageOffering: 'Manage offering',
  openInProject: 'Open in this project',
  comingSoon: 'Coming soon',
  onRoadmap: 'On the roadmap',
  notYetAvailable: 'Not yet available',
  hourly: 'Hourly',
  stayIn: 'Stay-in',
  sar: 'SAR',
  dynamic: 'Dynamic',
  fixed: 'Fixed',
  onBelkhidmahUntilSync: 'On Belkhidmah until the next sync',
  liveUntilSync: 'Hidden (until next sync)',
  live: 'Live',
  liveOnBelkhidmah: 'Live on Belkhidmah',
  hidden: 'Hidden',
  ready: 'Ready',
  conflict: 'Conflict',
  missing: 'Missing',
  titleEn: 'Title (English)',
  titleAr: 'Title (Arabic)',
  details: 'Details',
  detailsEn: 'Details (English)',
  detailsAr: 'Details (Arabic)',
  durationEn: 'Duration (English)',
  durationAr: 'Duration (Arabic)',
  price: 'Price',
  addRule: 'Add rule',
  removeRule: 'Remove rule',
  priority: 'Priority',
  addAnd: 'Add And',
  addOr: 'Add Or',
  removeCondition: 'Remove condition',
  conditionCity: 'City',
  conditionDays: 'Days after booking',
  cityEquals: 'equals',
  fromDay: 'From (days after booking)',
  toDay: 'To (days after booking)',
  andUp: 'And later',
  joinAnd: 'And',
  joinOr: 'Or',
  rulePrice: 'Rule price',
  alonePrice: 'This condition alone',
  tryBooking: 'Try a booking',
  priceEffect: 'Price effect',
  effectAddAmount: 'Increase by amount',
  effectAddPercent: 'Increase by percent',
  effectSubtractAmount: 'Decrease by amount',
  effectSubtractPercent: 'Decrease by percent',
  priceNeedEffect: 'Each price effect needs a number greater than 0.',
  priceRulesHint: 'Fixed is one price. Dynamic is rules. Each rule has conditions, one price for the whole contract, and a priority. A smaller priority number wins. A condition can also raise or lower that price when it matches.',
  priceNeedRule: 'Add at least one rule.',
  priceNeedCondition: 'Each rule needs a condition.',
  priceNeedCity: 'Each city condition needs a city.',
  priceNeedPriority: 'Each rule needs a priority of 1 or more.',
  priceInvalidRange: 'Each “to” day must be at least the “from” day.',
  priceNeedAmount: 'Each rule needs a price greater than 0.',
  bookingPreview: 'If the client books in {city} and the contract starts {days} days after the booking date: {amount}',
  priorityWins: 'Priority {priority} wins.',
  noPriceForBooking: 'No price for this booking.',
  previewCity: 'Contract city',
  contractDays: 'Days after booking until start',
  daysRange: '{from}–{to} days after booking',
  daysAndUp: '{from}+ days after booking',
  city: 'City',
  photos: 'Photos',
  adminLocked: 'Admin locked this field.',
  save: 'Save',
  hide: 'Hide',
  unhide: 'Unhide',
  cancel: 'Cancel',
  close: 'Close',
  confirmHide: 'Confirm hide',
  dontSyncYet: "Don't sync yet",
  clearDontSync: "Clear don't-sync",
  hideConfirm: 'This stays in your catalog. The next Belkhidmah sync removes it from the client app.',
  skipConfirm: 'This stays here and will not be sent.',
  websiteTitleEn: 'Website title (English)',
  websiteTitleAr: 'Website title (Arabic)',
  websitePrice: 'Website price',
  websiteDurationEn: 'Website duration (English)',
  websiteDurationAr: 'Website duration (Arabic)',
  websiteDetailsEn: 'Website details (English)',
  websiteDetailsAr: 'Website details (Arabic)',
  droppedFromWebsite: 'Dropped from website',
  globalPublish: 'Global publish',
  now: 'Now',
  onADate: 'On a date',
  nextSync: 'Next sync',
  runSync: 'Run Belkhidmah sync now',
  treatScheduled: 'Treat scheduled time as reached',
  lastJob: 'Last job {job}',
  lastPullJob: 'Last pull {pull} · Last job {job}',
  onPlatform: 'On platform',
  leavingNext: 'Leaving next sync',
  allOnPlatform: 'All on platform',
  noPackagesOnBelkhidmah: 'No packages on Belkhidmah in this view.',
  platformHint:
    'Packages on بالخدمة now. Catalog is MITM. The real Belkhidmah job runs on an interval; these buttons stand in for it.',
  jobNote: '{added} added to Belkhidmah · {removed} removed from Belkhidmah · {unchanged} unchanged',
  viewOnly: 'View only',
  priceOnly: 'Price only',
  priceAndDetails: 'Price and details',
  full: 'Full',
  package: 'Package',
  selectAll: 'Select all packages',
  permPrice: 'Price',
  permTitle: 'Title',
  permDetails: 'Details',
  permPhotos: 'Photos',
  permCity: 'City',
  permHide: 'Hide',
  permSkip: "Don't sync yet",
  permNow: 'Now',
  permDate: 'On a date',
  permNext: 'Next sync',
  englishName: 'English name',
  arabicName: 'Arabic name',
  contact: 'Contact',
  crmWebsiteUrl: 'CRM website URL',
  canRefreshCrm: 'Can refresh own CRM',
  enterEnglishName: 'Enter the English name.',
  enterArabicName: 'Enter the Arabic name.',
  enterAnEmail: 'Enter an email.',
  enterCrmUrl: 'Enter the CRM website URL.',
  enterAPassword: 'Enter a password.',
  one: 'One',
  several: 'Several',
  all: 'All',
  importOnly: 'Import only',
  importAndQueue: 'Import and queue succeeded packages',
  sync: 'Sync',
  simulateFail: 'Simulate pull failure',
  queuedCount: 'Queued {count}',
  queued: 'queued',
  held: 'held',
  conflicts: 'Conflicts',
  keepMine: 'Keep mine',
  takeWebsite: 'Take website',
  saveResolution: 'Save resolution',
  noConflicts: 'No conflicts.',
  mine: 'Mine',
  website: 'Website',
  titleEN: 'Title EN',
  titleAR: 'Title AR',
  crmId: 'CRM id',
  lastJobLabel: 'Last job',
  openFullPackage: 'Open full package',
  inThisProject: 'In this project',
  inThisProjectHint: 'What you manage here. Clients do not see this list until a sync.',
  onBelkhidmahHint: 'What clients can see now. Hidden packages stay until the next Belkhidmah sync.',
  nothingLiveBelkhidmah: 'Nothing is live on Belkhidmah.',
  nothingLiveClient: 'Nothing is live on the client app.',
  onBelkhidmahNow: 'On Belkhidmah now',
  refreshMyCrm: 'Refresh my CRM',
  publishingOff: 'Publishing is turned off for this package.',
  missingPackage: 'Missing package.',
  enterFutureDate: 'Enter a future date and time.',
  pullFailed: 'Could not read this website. Nothing was changed.',
  sendReset: 'Send reset link',
  resetReady: 'If this email exists, a reset link is ready',
  setNewPassword: 'Set a new password',
  newPassword: 'New password',
  confirmPassword: 'Confirm password',
  savePassword: 'Save password',
  inactiveAccount: 'This account is inactive. Contact Belkhidmah.',
  backToLogin: 'Back to login',
  cardReady: 'Ready for next sync',
  cardNotQueued: 'Not queued',
  cardDontSync: "Don't sync yet",
  cardScheduled: 'Scheduled',
  cardLive: 'Live',
  cardHidden: 'Hidden',
  cardConflict: 'Conflict',
  cardMissing: 'Missing from website',
  cardComingSoon: 'Coming soon',
  kindNew: 'new',
  kindUpdated: 'updated',
  kindUnchanged: 'unchanged',
  actionEdit: 'Edit',
  actionHide: 'Hide',
  actionPublish: 'Publish',
  actionPull: 'Pull',
  actionConflict: 'Conflict resolution',
  fieldPrice: 'price',
  fieldTitle: 'title',
  fieldDetails: 'details',
  fieldPhotos: 'photos',
  fieldCity: 'city',
  fieldDuration: 'duration',
  error: 'Error',
  tabOnBelkhidmah: 'On Belkhidmah',
  tabNotOnBelkhidmah: 'Not on Belkhidmah',
  tabDifferentBelkhidmah: 'Different from Belkhidmah',
  onBelkhidmahPageHint:
    'Your packages on بالخدمة, packages still only in this project, and packages whose details no longer match what بالخدمة has.',
  matchesBelkhidmah: 'Same as Belkhidmah',
  differsBelkhidmah: '{count} fields differ',
  comparePackage: 'Compare',
  compareViewOnly: 'View only. This does not change Belkhidmah.',
  onBelkhidmahColumn: 'On Belkhidmah',
  inThisProjectColumn: 'In this project',
  fieldsMatch: '{count} fields match',
  noFieldDiffs: 'No differences.',
  noPackagesNotOnBelkhidmah: 'Every package here is already on Belkhidmah.',
  noDifferentPackages: 'No packages differ from Belkhidmah.',
  packagesCount: '{count} packages',
  previousPage: 'Previous',
  nextPage: 'Next',
  pageOf: 'Page {page} of {pages}'
} as const

export type MsgKey = keyof typeof EN

export const AR: Record<MsgKey, string> = {
  signIn: 'تسجيل الدخول',
  forgot: 'نسيت كلمة المرور',
  admin: 'مشرف',
  home: 'الرئيسية',
  providers: 'المقدمون',
  pullCrm: 'سحب من الموقع',
  catalog: 'الكتالوج',
  platform: 'المنصة',
  activity: 'السجل',
  myPackages: 'باقاتي',
  onBelkhidmah: 'على بالخدمة',
  logOut: 'تسجيل الخروج',
  restore: 'استعادة بيانات العرض',
  lang: 'English',
  loading: 'جارٍ التحميل…',
  mitmMock: 'محاكاة الوسيط',
  mockCrm: 'موقع تجريبي',
  mockCrmHint: 'غيّر قيم الموقع قبل السحب. يُستخدم للاختبار: تحديث نظيف، تعارضات، وباقات ناقصة.',
  email: 'البريد الإلكتروني',
  password: 'كلمة المرور',
  showPassword: 'إظهار كلمة المرور',
  enterEmail: 'أدخل بريدك الإلكتروني.',
  enterPassword: 'أدخل كلمة المرور.',
  badLogin: 'البريد أو كلمة المرور غير صحيحة.',
  demoHint: 'تجريبي: admin@belkhidmah.test، manzil@belkhidmah.test، bayt@belkhidmah.test · Demo1234',
  brandTitle: 'بالخدمة — الوسيط',
  visualKicker: 'بالخدمة',
  visualTitle: 'الباقات بين المزودين وبالخدمة',
  visualBody: 'سجّل الدخول لإدارة الكتالوج بين مواقع المزودين والتطبيق.',
  homeLead: 'الباقات بين مواقع المزودين وبالخدمة.',
  openMenu: 'فتح القائمة',
  addProvider: 'إضافة مقدم',
  name: 'الاسم',
  crmUrl: 'رابط الموقع',
  active: 'نشط',
  inactive: 'غير نشط',
  refresh: 'تحديث',
  publish: 'نشر',
  yes: 'نعم',
  no: 'لا',
  permissions: 'الصلاحيات',
  notFound: 'غير موجود.',
  packageNotFound: 'الباقة غير موجودة.',
  findPackage: 'ابحث عن باقة',
  tabAll: 'الكل',
  tabHourly: 'بالساعة',
  tabStayIn: 'مقيمة',
  tabHidden: 'مخفية',
  allProviders: 'كل المقدمين',
  allCities: 'كل المدن',
  allStates: 'كل الحالات',
  noPackagesMatch: 'لا توجد باقات مطابقة لبحثك.',
  manageOffering: 'إدارة الباقة',
  openInProject: 'فتح في هذا المشروع',
  comingSoon: 'قريباً',
  onRoadmap: 'ضمن الخطة',
  notYetAvailable: 'غير متاح بعد',
  hourly: 'بالساعة',
  stayIn: 'مقيمة',
  sar: 'ر.س',
  dynamic: 'متغير',
  fixed: 'ثابت',
  onBelkhidmahUntilSync: 'على بالخدمة حتى المزامنة التالية',
  liveUntilSync: 'مخفية (حتى المزامنة التالية)',
  live: 'مباشر',
  liveOnBelkhidmah: 'مباشر على بالخدمة',
  hidden: 'مخفية',
  ready: 'جاهزة',
  conflict: 'تعارض',
  missing: 'ناقصة',
  titleEn: 'العنوان (إنجليزي)',
  titleAr: 'العنوان (عربي)',
  details: 'التفاصيل',
  detailsEn: 'التفاصيل (إنجليزي)',
  detailsAr: 'التفاصيل (عربي)',
  durationEn: 'المدة (إنجليزي)',
  durationAr: 'المدة (عربي)',
  price: 'السعر',
  addRule: 'إضافة قاعدة',
  removeRule: 'حذف القاعدة',
  priority: 'الأولوية',
  addAnd: 'إضافة و',
  addOr: 'إضافة أو',
  removeCondition: 'حذف الشرط',
  conditionCity: 'المدينة',
  conditionDays: 'أيام بعد الحجز',
  cityEquals: 'تساوي',
  fromDay: 'من (أيام بعد الحجز)',
  toDay: 'إلى (أيام بعد الحجز)',
  andUp: 'وبعدها',
  joinAnd: 'و',
  joinOr: 'أو',
  rulePrice: 'سعر القاعدة',
  alonePrice: 'هذا الشرط وحده',
  tryBooking: 'جرّب حجزاً',
  priceEffect: 'أثر على السعر',
  effectAddAmount: 'زيادة بمبلغ',
  effectAddPercent: 'زيادة بنسبة',
  effectSubtractAmount: 'نقص بمبلغ',
  effectSubtractPercent: 'نقص بنسبة',
  priceNeedEffect: 'كل أثر على السعر يحتاج رقماً أكبر من صفر.',
  priceRulesHint: 'الثابت سعر واحد. المتغير قواعد. كل قاعدة لها شروط وسعر واحد للعقد وأولوية. الرقم الأصغر يفوز. يمكن للشرط أيضاً أن يرفع السعر أو يخفضه عندما يتحقق.',
  priceNeedRule: 'أضف قاعدة واحدة على الأقل.',
  priceNeedCondition: 'كل قاعدة تحتاج شرطاً.',
  priceNeedCity: 'كل شرط مدينة يحتاج مدينة.',
  priceNeedPriority: 'كل قاعدة تحتاج أولوية 1 أو أكثر.',
  priceInvalidRange: 'يوم «إلى» يجب ألا يقل عن يوم «من».',
  priceNeedAmount: 'كل قاعدة تحتاج سعراً أكبر من صفر.',
  bookingPreview: 'إذا حجز العميل في {city} وبدأ العقد بعد {days} يوماً من تاريخ الحجز: {amount}',
  priorityWins: 'الأولوية {priority} تفوز.',
  noPriceForBooking: 'لا يوجد سعر لهذا الحجز.',
  previewCity: 'مدينة العقد',
  contractDays: 'أيام بعد الحجز حتى البداية',
  daysRange: '{from}–{to} أيام بعد الحجز',
  daysAndUp: '{from}+ أيام بعد الحجز',
  city: 'المدينة',
  photos: 'الصور',
  adminLocked: 'المشرف قفل هذا الحقل.',
  save: 'حفظ',
  hide: 'إخفاء',
  unhide: 'إظهار',
  cancel: 'إلغاء',
  close: 'إغلاق',
  confirmHide: 'تأكيد الإخفاء',
  dontSyncYet: 'لا تُزامن بعد',
  clearDontSync: 'إلغاء تأجيل المزامنة',
  hideConfirm: 'تبقى في الكتالوج. المزامنة التالية تزيلها من تطبيق العميل.',
  skipConfirm: 'تبقى هنا ولن تُرسل.',
  websiteTitleEn: 'عنوان الموقع (إنجليزي)',
  websiteTitleAr: 'عنوان الموقع (عربي)',
  websitePrice: 'سعر الموقع',
  websiteDurationEn: 'مدة الموقع (إنجليزي)',
  websiteDurationAr: 'مدة الموقع (عربي)',
  websiteDetailsEn: 'تفاصيل الموقع (إنجليزي)',
  websiteDetailsAr: 'تفاصيل الموقع (عربي)',
  droppedFromWebsite: 'محذوفة من الموقع',
  globalPublish: 'النشر العام',
  now: 'الآن',
  onADate: 'في تاريخ',
  nextSync: 'المزامنة التالية',
  runSync: 'تشغيل مزامنة بالخدمة الآن',
  treatScheduled: 'اعتبار وقت الجدولة قد حان',
  lastJob: 'آخر مهمة {job}',
  lastPullJob: 'آخر سحب {pull} · آخر مهمة {job}',
  onPlatform: 'على المنصة',
  leavingNext: 'تغادر في المزامنة التالية',
  allOnPlatform: 'كل ما على المنصة',
  noPackagesOnBelkhidmah: 'لا توجد باقات على بالخدمة في هذا العرض.',
  platformHint: 'الباقات على بالخدمة الآن. الكتالوج للوسيط. مهمة بالخدمة الحقيقية تعمل على فترة؛ هذه الأزرار بديل عنها.',
  jobNote: '{added} أُضيفت إلى بالخدمة · {removed} أُزيلت من بالخدمة · {unchanged} دون تغيير',
  viewOnly: 'عرض فقط',
  priceOnly: 'السعر فقط',
  priceAndDetails: 'السعر والتفاصيل',
  full: 'كامل',
  package: 'الباقة',
  selectAll: 'تحديد كل الباقات',
  permPrice: 'السعر',
  permTitle: 'العنوان',
  permDetails: 'التفاصيل',
  permPhotos: 'الصور',
  permCity: 'المدينة',
  permHide: 'إخفاء',
  permSkip: 'لا تُزامن بعد',
  permNow: 'الآن',
  permDate: 'في تاريخ',
  permNext: 'المزامنة التالية',
  englishName: 'الاسم بالإنجليزية',
  arabicName: 'الاسم بالعربية',
  contact: 'جهة الاتصال',
  crmWebsiteUrl: 'رابط موقع مقدم الخدمة',
  canRefreshCrm: 'يمكنه تحديث موقعه',
  enterEnglishName: 'أدخل الاسم بالإنجليزية.',
  enterArabicName: 'أدخل الاسم بالعربية.',
  enterAnEmail: 'أدخل بريداً إلكترونياً.',
  enterCrmUrl: 'أدخل رابط موقع مقدم الخدمة.',
  enterAPassword: 'أدخل كلمة مرور.',
  one: 'واحد',
  several: 'عدة',
  all: 'الكل',
  importOnly: 'استيراد فقط',
  importAndQueue: 'استيراد ووضع الباقات الناجحة في قائمة الانتظار',
  sync: 'مزامنة',
  simulateFail: 'محاكاة فشل السحب',
  queuedCount: 'في الانتظار {count}',
  queued: 'في الانتظار',
  held: 'معلّقة',
  conflicts: 'التعارضات',
  keepMine: 'إبقاء نسختي',
  takeWebsite: 'أخذ نسخة الموقع',
  saveResolution: 'حفظ القرار',
  noConflicts: 'لا تعارضات.',
  mine: 'نسختي',
  website: 'الموقع',
  titleEN: 'العنوان إنجليزي',
  titleAR: 'العنوان عربي',
  crmId: 'معرّف الموقع',
  lastJobLabel: 'آخر مهمة',
  openFullPackage: 'فتح الباقة كاملة',
  inThisProject: 'في هذا المشروع',
  inThisProjectHint: 'ما تديره هنا. العملاء لا يرون هذه القائمة حتى المزامنة.',
  onBelkhidmahHint: 'ما يراه العملاء الآن. الباقات المخفية تبقى حتى مزامنة بالخدمة التالية.',
  nothingLiveBelkhidmah: 'لا شيء مباشر على بالخدمة.',
  nothingLiveClient: 'لا شيء مباشر على تطبيق العميل.',
  onBelkhidmahNow: 'على بالخدمة الآن',
  refreshMyCrm: 'تحديث موقعي',
  publishingOff: 'النشر متوقف لهذه الباقة.',
  missingPackage: 'الباقة غير موجودة.',
  enterFutureDate: 'أدخل تاريخاً ووقتاً في المستقبل.',
  pullFailed: 'تعذر قراءة هذا الموقع. لم يُغيَّر شيء.',
  sendReset: 'إرسال رابط إعادة التعيين',
  resetReady: 'إذا كان هذا البريد موجوداً، رابط إعادة التعيين جاهز',
  setNewPassword: 'تعيين كلمة مرور جديدة',
  newPassword: 'كلمة المرور الجديدة',
  confirmPassword: 'تأكيد كلمة المرور',
  savePassword: 'حفظ كلمة المرور',
  inactiveAccount: 'هذا الحساب غير نشط. تواصل مع بالخدمة.',
  backToLogin: 'العودة لتسجيل الدخول',
  cardReady: 'جاهزة للمزامنة التالية',
  cardNotQueued: 'غير مدرجة',
  cardDontSync: 'لا تُزامن بعد',
  cardScheduled: 'مجدولة',
  cardLive: 'مباشر',
  cardHidden: 'مخفية',
  cardConflict: 'تعارض',
  cardMissing: 'ناقصة من الموقع',
  cardComingSoon: 'قريباً',
  kindNew: 'جديدة',
  kindUpdated: 'محدّثة',
  kindUnchanged: 'دون تغيير',
  actionEdit: 'تعديل',
  actionHide: 'إخفاء',
  actionPublish: 'نشر',
  actionPull: 'سحب',
  actionConflict: 'حل التعارض',
  fieldPrice: 'السعر',
  fieldTitle: 'العنوان',
  fieldDetails: 'التفاصيل',
  fieldPhotos: 'الصور',
  fieldCity: 'المدينة',
  fieldDuration: 'المدة',
  error: 'خطأ',
  tabOnBelkhidmah: 'على بالخدمة',
  tabNotOnBelkhidmah: 'ليست على بالخدمة',
  tabDifferentBelkhidmah: 'تختلف عن بالخدمة',
  onBelkhidmahPageHint:
    'باقاتك على بالخدمة، والباقات الموجودة هنا فقط، والباقات التي لم تعد تفاصيلها مطابقة لما على بالخدمة.',
  matchesBelkhidmah: 'مطابقة لبالخدمة',
  differsBelkhidmah: '{count} حقول تختلف',
  comparePackage: 'مقارنة',
  compareViewOnly: 'للعرض فقط. هذا لا يغيّر بالخدمة.',
  onBelkhidmahColumn: 'على بالخدمة',
  inThisProjectColumn: 'في هذا المشروع',
  fieldsMatch: '{count} حقول متطابقة',
  noFieldDiffs: 'لا توجد اختلافات.',
  noPackagesNotOnBelkhidmah: 'كل الباقات هنا موجودة أصلاً على بالخدمة.',
  noDifferentPackages: 'لا توجد باقات تختلف عن بالخدمة.',
  packagesCount: '{count} باقات',
  previousPage: 'السابق',
  nextPage: 'التالي',
  pageOf: 'صفحة {page} من {pages}'
}

const CITY_AR: Record<string, string> = {
  Riyadh: 'الرياض',
  Jeddah: 'جدة'
}

const PHOTO_AR: Record<string, string> = {
  'Living room': 'غرفة المعيشة',
  Calendar: 'التقويم',
  Iron: 'مكواة',
  'Uniform photo': 'صورة الزي',
  Kitchen: 'المطبخ',
  Car: 'سيارة',
  Playroom: 'غرفة اللعب',
  Hall: 'صالة'
}

const CARD_STATE_KEY: Record<CardState, MsgKey> = {
  'Ready for next sync': 'cardReady',
  'Not queued': 'cardNotQueued',
  "Don't sync yet": 'cardDontSync',
  Scheduled: 'cardScheduled',
  Live: 'cardLive',
  Hidden: 'cardHidden',
  Conflict: 'cardConflict',
  'Missing from website': 'cardMissing',
  'Coming soon': 'cardComingSoon'
}

const HOLD_KEY: Record<HoldReason, MsgKey> = {
  Conflict: 'cardConflict',
  Hidden: 'cardHidden',
  "Don't sync yet": 'cardDontSync',
  'Coming soon': 'cardComingSoon',
  'Missing from website': 'cardMissing',
  Error: 'error'
}

const PERM_KEY: Record<PermKey, MsgKey> = {
  price: 'permPrice',
  title: 'permTitle',
  details: 'permDetails',
  photos: 'permPhotos',
  city: 'permCity',
  hide: 'permHide',
  skipSync: 'permSkip',
  now: 'permNow',
  date: 'permDate',
  next: 'permNext'
}

const FIELD_KEY: Record<FieldKey, MsgKey> = {
  price: 'fieldPrice',
  title: 'fieldTitle',
  details: 'fieldDetails',
  photos: 'fieldPhotos',
  city: 'fieldCity',
  duration: 'fieldDuration'
}

const ACTION_KEY: Record<string, MsgKey> = {
  Edit: 'actionEdit',
  Hide: 'actionHide',
  Publish: 'actionPublish',
  Pull: 'actionPull',
  'Conflict resolution': 'actionConflict',
  "Don't sync yet": 'dontSyncYet',
  'Import only': 'importOnly',
  'Import and queue succeeded packages': 'importAndQueue'
}

export function translate (locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const dict = locale === 'ar' ? AR : EN
  let s = (dict as Record<string, string>)[key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
  }
  return s
}

export function cityLabel (city: string, locale: Locale): string {
  if (locale !== 'ar') return city
  return CITY_AR[city] ?? city
}

export function photoLabel (photo: string, locale: Locale): string {
  if (locale !== 'ar') return photo
  return PHOTO_AR[photo] ?? photo
}

export function photosLabel (photos: string[], locale: Locale): string {
  return photos.map((p) => photoLabel(p, locale)).join(locale === 'ar' ? '، ' : ', ')
}

export function formatMoney (amount: number, locale: Locale): string {
  return amount.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')
}

export function formatPriceAmount (amount: number, locale: Locale): string {
  return `${translate(locale, 'sar')} ${formatMoney(amount, locale)}`
}

export function formatPriceSummary (
  item: { price: number; priceMode: PriceMode; priceRules: PriceRule[] },
  locale: Locale
): string {
  const range = priceRange(item.priceMode, item.price, item.priceRules)
  if (range.min === range.max) return formatMoney(range.min, locale)
  return `${formatMoney(range.min, locale)}–${formatMoney(range.max, locale)}`
}

const EFFECT_LABEL: Record<PriceCondition['effectOp'], MsgKey> = {
  addAmount: 'effectAddAmount',
  addPercent: 'effectAddPercent',
  subtractAmount: 'effectSubtractAmount',
  subtractPercent: 'effectSubtractPercent'
}

export function formatConditionLabel (condition: PriceCondition, locale: Locale): string {
  const base = condition.kind === 'city'
    ? `${translate(locale, 'conditionCity')} ${translate(locale, 'cityEquals')} ${cityLabel(condition.city, locale)}`
    : `${translate(locale, 'conditionDays')} ${
        condition.toDay == null
          ? translate(locale, 'daysAndUp', { from: condition.fromDay })
          : translate(locale, 'daysRange', { from: condition.fromDay, to: condition.toDay })
      }`
  if (!condition.effectOn) return base
  const unit = condition.effectOp === 'addPercent' || condition.effectOp === 'subtractPercent' ? '%' : ` ${translate(locale, 'sar')}`
  return `${base} (${translate(locale, EFFECT_LABEL[condition.effectOp])} ${condition.effectValue}${unit})`
}

export function formatRuleLabel (rule: PriceRule, locale: Locale): string {
  const parts = rule.conditions.map((condition, index) => {
    const label = formatConditionLabel(condition, locale)
    if (index === 0) return label
    const join = condition.join === 'or' ? translate(locale, 'joinOr') : translate(locale, 'joinAnd')
    return `${join} ${label}`
  })
  return `${translate(locale, 'priority')} ${rule.priority}: ${parts.join(' ')}: ${formatPriceAmount(rule.price, locale)}`
}

export function formatPricedLines (
  item: { price: number; priceMode: PriceMode; priceRules: PriceRule[] },
  locale: Locale
): string[] {
  const mode = item.priceMode === 'dynamic' ? translate(locale, 'dynamic') : translate(locale, 'fixed')
  if (item.priceMode !== 'dynamic' || item.priceRules.length === 0) {
    return [`${formatPriceAmount(item.price, locale)} · ${mode}`]
  }
  const rows = [...item.priceRules]
    .sort((a, b) => a.priority - b.priority)
    .map((rule) => formatRuleLabel(rule, locale))
  return [mode, ...rows]
}

export function formatPricedLabel (
  item: { price: number; priceMode: PriceMode; priceRules: PriceRule[] },
  locale: Locale
): string {
  return formatPricedLines(item, locale).join(' · ')
}

export function localizedTitle (item: { titleEn: string; titleAr: string }, locale: Locale): string {
  return locale === 'ar' ? item.titleAr : item.titleEn
}

export function localizedDetails (item: { descriptionEn: string; descriptionAr: string }, locale: Locale): string {
  return locale === 'ar' ? item.descriptionAr : item.descriptionEn
}

export function localizedDuration (item: { durationEn: string; durationAr: string }, locale: Locale): string {
  return locale === 'ar' ? item.durationAr : item.durationEn
}

export function cardStateLabel (state: CardState, locale: Locale): string {
  return translate(locale, CARD_STATE_KEY[state])
}

export function holdReasonLabel (reason: HoldReason, locale: Locale): string {
  return translate(locale, HOLD_KEY[reason])
}

export function permLabel (key: PermKey, locale: Locale): string {
  return translate(locale, PERM_KEY[key])
}

export function fieldLabel (key: FieldKey, locale: Locale): string {
  return translate(locale, FIELD_KEY[key])
}

export function actionLabel (action: string, locale: Locale): string {
  const mapped = ACTION_KEY[action]
  return mapped ? translate(locale, mapped) : action
}

export function kindLabel (kind: 'new' | 'updated' | 'unchanged', locale: Locale): string {
  if (kind === 'new') return translate(locale, 'kindNew')
  if (kind === 'updated') return translate(locale, 'kindUpdated')
  return translate(locale, 'kindUnchanged')
}

export function conflictSides (
  offering: Offering,
  site: WebsitePackage | undefined,
  field: FieldKey,
  locale: Locale,
  stored: { mine: string; website: string }
): { mine: string; website: string } {
  switch (field) {
    case 'title':
      return {
        mine: localizedTitle(offering, locale),
        website: site ? localizedTitle(site, locale) : stored.website
      }
    case 'details':
      return {
        mine: localizedDetails(offering, locale),
        website: site ? localizedDetails(site, locale) : stored.website
      }
    case 'duration':
      return {
        mine: localizedDuration(offering, locale),
        website: site ? localizedDuration(site, locale) : stored.website
      }
    case 'photos':
      return {
        mine: photosLabel(offering.photos, locale),
        website: site ? photosLabel(site.photos, locale) : stored.website
      }
    case 'city':
      return {
        mine: cityLabel(offering.city, locale),
        website: site ? cityLabel(site.city, locale) : cityLabel(stored.website, locale)
      }
    case 'price':
      return {
        mine: formatPricedLabel(offering, locale),
        website: site ? formatPricedLabel(site, locale) : stored.website
      }
    default:
      return stored
  }
}

export function belkhidmahSides (
  offering: Offering,
  snapshot: BelkhidmahSnapshot,
  field: FieldKey,
  locale: Locale
): { platform: string; project: string } {
  switch (field) {
    case 'title':
      return {
        platform: localizedTitle(snapshot, locale),
        project: localizedTitle(offering, locale)
      }
    case 'details':
      return {
        platform: localizedDetails(snapshot, locale),
        project: localizedDetails(offering, locale)
      }
    case 'duration':
      return {
        platform: localizedDuration(snapshot, locale),
        project: localizedDuration(offering, locale)
      }
    case 'photos':
      return {
        platform: photosLabel(snapshot.photos, locale),
        project: photosLabel(offering.photos, locale)
      }
    case 'city':
      return {
        platform: cityLabel(snapshot.city, locale),
        project: cityLabel(offering.city, locale)
      }
    case 'price':
      return {
        platform: formatPricedLabel(snapshot, locale),
        project: formatPricedLabel(offering, locale)
      }
  }
}
