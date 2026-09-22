using Belkhidmah.Web.Ui;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Belkhidmah.Web.Pages;

public class ForgotModel : PageModel
{
    public string T(string key) => UiCopy.T(Request, key);

    public bool IsAr => UiCopy.IsAr(Request);

    public IActionResult OnGet(string? lang)
    {
        var redirect = LocaleSwitch.Apply(this, lang);
        return redirect ?? Page();
    }
}
