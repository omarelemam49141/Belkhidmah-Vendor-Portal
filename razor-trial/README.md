# Razor login trial

One-page UI trial: daisyUI + Tailwind + Alpine + GSAP + htmx, themed to بالخدمة.

Identity spec: [`docs/design.md`](../docs/design.md)

```bash
cd razor-trial
dotnet run
```

Open http://localhost:5015

Same demo logins as the Next mock (`Demo1234`):

- `admin@belkhidmah.test`
- `manzil@belkhidmah.test`
- `bayt@belkhidmah.test`

CSS: trial ships `wwwroot/css/app.css` (identity CSS). Tailwind 4 + daisyUI source is `input.css` — run `npm install` then `npm run css` when you want the compiler.
