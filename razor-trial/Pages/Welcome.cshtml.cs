using Belkhidmah.Web.Ui;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Belkhidmah.Web.Pages;

public class WelcomeModel : PageModel
{
    public IActionResult OnGet()
    {
        if (DemoAuth.Current(Request) is null)
        {
            return RedirectToPage("/Index");
        }

        return RedirectToPage("/Home");
    }
}
