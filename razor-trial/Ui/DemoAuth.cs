namespace Belkhidmah.Web.Ui;

public sealed record DemoUser(
    string Email,
    string Password,
    string Role,
    string NameEn,
    string NameAr)
{
    public string DisplayName(bool arabic) => arabic ? NameAr : NameEn;
}

public sealed record DemoStat(string Key, int Value);

public static class DemoAuth
{
    public static readonly DemoUser[] Users =
    [
        new("admin@belkhidmah.test", "Demo1234", "admin", "Admin", "مشرف"),
        new("manzil@belkhidmah.test", "Demo1234", "provider", "Al Manzil Home Services", "المنزل للخدمات المنزلية"),
        new("bayt@belkhidmah.test", "Demo1234", "provider", "Bayt Al Noor", "بيت النور")
    ];

    public static DemoUser? Find(string email, string password) =>
        Users.FirstOrDefault(u =>
            string.Equals(u.Email, email.Trim(), StringComparison.OrdinalIgnoreCase)
            && u.Password == password);

    public static DemoUser? Current(HttpRequest request)
    {
        var email = request.Cookies[UiCopy.SessionCookie];
        return Users.FirstOrDefault(u =>
            string.Equals(u.Email, email, StringComparison.OrdinalIgnoreCase));
    }

    public static IReadOnlyList<DemoStat> Stats(DemoUser user) =>
        user.Role == "admin"
            ?
            [
                new("providers", 2),
                new("ready", 8),
                new("live", 5),
                new("hidden", 1),
                new("conflict", 2),
                new("missing", 1)
            ]
            : user.Email.StartsWith("bayt", StringComparison.OrdinalIgnoreCase)
                ?
                [
                    new("ready", 3),
                    new("live", 2),
                    new("hidden", 1),
                    new("conflict", 0)
                ]
                :
                [
                    new("ready", 4),
                    new("live", 3),
                    new("hidden", 0),
                    new("conflict", 1)
                ];
}
