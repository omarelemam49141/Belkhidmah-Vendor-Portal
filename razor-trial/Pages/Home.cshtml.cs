using Belkhidmah.Web.Ui;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Belkhidmah.Web.Pages;

public class HomeModel : PageModel
{
    public DemoUser Account { get; private set; } = null!;
    public IReadOnlyList<DemoStat> Stats { get; private set; } = [];
    public IReadOnlyList<NavItem> Nav { get; private set; } = [];
    public IReadOnlyList<NavItem> Actions { get; private set; } = [];

    public string T(string key) => UiCopy.T(Request, key);

    public bool IsAr => UiCopy.IsAr(Request);

    public string DisplayName => Account.DisplayName(IsAr);

    public IActionResult OnGet(string? lang)
    {
        var localeRedirect = LocaleSwitch.Apply(this, lang);
        if (localeRedirect is not null)
        {
            return localeRedirect;
        }

        var user = DemoAuth.Current(Request);
        if (user is null)
        {
            return RedirectToPage("/Index");
        }

        Account = user;
        Stats = DemoAuth.Stats(user);
        Nav = user.Role == "admin"
            ?
            [
                new("home", "/Home", true),
                new("providers", "#"),
                new("pullCrm", "#"),
                new("catalog", "#"),
                new("mockCrm", "#"),
                new("platform", "#"),
                new("activity", "#")
            ]
            :
            [
                new("home", "/Home", true),
                new("myPackages", "#"),
                new("onBelkhidmah", "#")
            ];
        Actions = user.Role == "admin"
            ?
            [
                new("restore", "#"),
                new("pullCrm", "#"),
                new("providers", "#"),
                new("catalog", "#"),
                new("mockCrm", "#")
            ]
            : user.Email.StartsWith("manzil", StringComparison.OrdinalIgnoreCase)
                ? [new("refreshMyCrm", "#")]
                : [];

        return Page();
    }

    public IActionResult OnPostLogout()
    {
        Response.Cookies.Delete(UiCopy.SessionCookie);
        return RedirectToPage("/Index");
    }
}
