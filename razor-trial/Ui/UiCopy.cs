namespace Belkhidmah.Web.Ui;

public static class UiCopy
{
    public const string LocaleCookie = "bk_locale";
    public const string SessionCookie = "bk_user";

    public static bool IsAr(HttpRequest request) =>
        request.Cookies[LocaleCookie] == "ar";

    public static string Lang(HttpRequest request) => IsAr(request) ? "ar" : "en";

    public static string T(HttpRequest request, string key) => Get(Lang(request), key);

    public static string Get(string lang, string key)
    {
        var table = lang == "ar" ? Ar : En;
        return table.TryGetValue(key, out var value) ? value : key;
    }

    public static readonly Dictionary<string, string> En = new()
    {
        ["signIn"] = "Sign in",
        ["forgot"] = "Forgot password",
        ["email"] = "Email",
        ["password"] = "Password",
        ["showPassword"] = "Show password",
        ["enterEmail"] = "Enter your email.",
        ["enterPassword"] = "Enter your password.",
        ["badLogin"] = "Email or password is incorrect.",
        ["demoHint"] = "Demo: admin@belkhidmah.test, manzil@belkhidmah.test, bayt@belkhidmah.test · Demo1234",
        ["brandTitle"] = "Belkhidmah MITM",
        ["lang"] = "العربية",
        ["visualKicker"] = "Belkhidmah",
        ["visualTitle"] = "Packages between providers and بالخدمة",
        ["visualBody"] = "Sign in to manage the catalog that sits between provider websites and the app.",
        ["loading"] = "Signing in…",
        ["welcomeTitle"] = "Signed in",
        ["welcomeBody"] = "Trial page — this is as far as the Razor login goes.",
        ["role"] = "Role",
        ["logOut"] = "Log out",
        ["forgotTitle"] = "Forgot password",
        ["forgotBody"] = "Trial only — reset is not wired yet.",
        ["backToSignIn"] = "Back to sign in",
        ["admin"] = "Admin",
        ["provider"] = "Provider",
        ["home"] = "Home",
        ["providers"] = "Providers",
        ["pullCrm"] = "Pull CRM",
        ["catalog"] = "Catalog",
        ["mockCrm"] = "Mock CRM",
        ["platform"] = "Platform",
        ["activity"] = "Activity",
        ["myPackages"] = "My packages",
        ["onBelkhidmah"] = "On Belkhidmah",
        ["restore"] = "Restore demo data",
        ["ready"] = "Ready",
        ["live"] = "Live",
        ["hidden"] = "Hidden",
        ["conflict"] = "Conflict",
        ["missing"] = "Missing",
        ["lastPullJob"] = "Last pull 20 Sep 12:00 · Last job 21 Sep 09:10",
        ["mitmMock"] = "MITM mock",
        ["refreshMyCrm"] = "Refresh my CRM",
        ["trialSoon"] = "Trial — this screen is not built yet. Home is the one to review.",
        ["homeLead"] = "Packages between provider websites and بالخدمة.",
        ["openMenu"] = "Open menu"
    };

    public static readonly Dictionary<string, string> Ar = new()
    {
        ["signIn"] = "تسجيل الدخول",
        ["forgot"] = "نسيت كلمة المرور",
        ["email"] = "البريد الإلكتروني",
        ["password"] = "كلمة المرور",
        ["showPassword"] = "إظهار كلمة المرور",
        ["enterEmail"] = "أدخل بريدك الإلكتروني.",
        ["enterPassword"] = "أدخل كلمة المرور.",
        ["badLogin"] = "البريد أو كلمة المرور غير صحيحة.",
        ["demoHint"] = "تجريبي: admin@belkhidmah.test، manzil@belkhidmah.test، bayt@belkhidmah.test · Demo1234",
        ["brandTitle"] = "بالخدمة — الوسيط",
        ["lang"] = "English",
        ["visualKicker"] = "بالخدمة",
        ["visualTitle"] = "الباقات بين المزودين وبالخدمة",
        ["visualBody"] = "سجّل الدخول لإدارة الكتالوج بين مواقع المزودين والتطبيق.",
        ["loading"] = "جارٍ الدخول…",
        ["welcomeTitle"] = "تم تسجيل الدخول",
        ["welcomeBody"] = "صفحة تجريبية — هذا حد تجربة الدخول في Razor.",
        ["role"] = "الدور",
        ["logOut"] = "تسجيل الخروج",
        ["forgotTitle"] = "نسيت كلمة المرور",
        ["forgotBody"] = "تجريبي فقط — إعادة التعيين غير مفعّلة بعد.",
        ["backToSignIn"] = "العودة لتسجيل الدخول",
        ["admin"] = "مشرف",
        ["provider"] = "مقدم",
        ["home"] = "الرئيسية",
        ["providers"] = "المقدمون",
        ["pullCrm"] = "سحب من الموقع",
        ["catalog"] = "الكتالوج",
        ["mockCrm"] = "موقع تجريبي",
        ["platform"] = "المنصة",
        ["activity"] = "السجل",
        ["myPackages"] = "باقاتي",
        ["onBelkhidmah"] = "على بالخدمة",
        ["restore"] = "استعادة بيانات العرض",
        ["ready"] = "جاهزة",
        ["live"] = "مباشر",
        ["hidden"] = "مخفية",
        ["conflict"] = "تعارض",
        ["missing"] = "ناقصة",
        ["lastPullJob"] = "آخر سحب 20 سبتمبر 12:00 · آخر مهمة 21 سبتمبر 09:10",
        ["mitmMock"] = "محاكاة الوسيط",
        ["refreshMyCrm"] = "تحديث موقعي",
        ["trialSoon"] = "تجريبي — هذه الشاشة غير مبنية بعد. راجع الرئيسية.",
        ["homeLead"] = "الباقات بين مواقع المزودين وبالخدمة.",
        ["openMenu"] = "فتح القائمة"
    };
}
