using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Belkhidmah.Web.Ui;

public static class LocaleSwitch
{
    public static IActionResult? Apply(PageModel page, string? lang)
    {
        if (lang is not ("ar" or "en"))
        {
            return null;
        }

        page.Response.Cookies.Append(UiCopy.LocaleCookie, lang, new CookieOptions
        {
            Path = "/",
            Expires = DateTimeOffset.UtcNow.AddYears(1),
            IsEssential = true
        });

        return new RedirectResult(page.HttpContext.Request.Path);
    }
}
