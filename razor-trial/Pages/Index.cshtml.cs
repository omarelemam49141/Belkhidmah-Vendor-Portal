using Belkhidmah.Web.Ui;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Belkhidmah.Web.Pages;

public class IndexModel : PageModel
{
    [BindProperty]
    public string Email { get; set; } = "";

    [BindProperty]
    public string Password { get; set; } = "";

    public string? EmailError { get; set; }
    public string? PasswordError { get; set; }
    public string? FormError { get; set; }

    public string T(string key) => UiCopy.T(Request, key);

    public bool IsAr => UiCopy.IsAr(Request);

    public IActionResult OnGet(string? lang)
    {
        var localeRedirect = LocaleSwitch.Apply(this, lang);
        if (localeRedirect is not null)
        {
            return localeRedirect;
        }

        if (!string.IsNullOrEmpty(Request.Cookies[UiCopy.SessionCookie]))
        {
            return RedirectToPage("/Home");
        }

        return Page();
    }

    public IActionResult OnPost()
    {
        EmailError = string.IsNullOrWhiteSpace(Email) ? T("enterEmail") : null;
        PasswordError = string.IsNullOrEmpty(Password) ? T("enterPassword") : null;

        if (EmailError is not null || PasswordError is not null)
        {
            return LoginResult();
        }

        var user = DemoAuth.Find(Email, Password);
        if (user is null)
        {
            FormError = T("badLogin");
            return LoginResult();
        }

        Response.Cookies.Append(UiCopy.SessionCookie, user.Email, new CookieOptions
        {
            Path = "/",
            HttpOnly = true,
            IsEssential = true
        });

        if (Request.Headers.ContainsKey("HX-Request"))
        {
            Response.Headers["HX-Redirect"] = Url.Page("/Home") ?? "/Home";
            return new EmptyResult();
        }

        return RedirectToPage("/Home");
    }

    private IActionResult LoginResult()
    {
        if (Request.Headers.ContainsKey("HX-Request"))
        {
            return Partial("_LoginPanel", this);
        }

        return Page();
    }
}
