# Belkhidmah MITM — UI / UX

Canonical look for this app. **Identity source:** pilgrimage landing page (`belkhidmah-landing-page`).  
**Ship in Next.js now.** Razor (`razor-trial`) is a proof only — do not rebuild the product there.

Do not use Material 3, Bootstrap, or Fluent.

---

## Stack

| Now (Next mock) | Later (Razor) | Role |
|---|---|---|
| Design tokens + Tailwind 4 | same tokens + Tailwind 4 | Color, type, space |
| `src/components/ui/button.tsx` + `globals.css` classes | daisyUI themed `belkhidmah` | Controls |
| React state | Alpine.js | Local UI (password, drawers) |
| Next routes | htmx + Razor | Page / fragment updates |
| Framer Motion `FadeIn` (login, home) | GSAP enter | First-paint motion |

Lenis + cinematic scroll = landing only. Not MITM chrome.

---

## Identity (copy exactly)

Tokens: `src/styles/design-tokens.css` (same values as landing).

| Token | Value | Use |
|---|---|---|
| Magenta | `#91288d` | Primary, stat numbers, active nav text |
| Pink | `#db2c91` | CTA start, selection, focus ring |
| Lilac | `#b268af` | Outline hover border |
| Blush | `#f5c2df` | Active nav fill, kicker on dark |
| Overlay ink | `#0b1324` | Auth background |
| Overlay mid | `#162033` | Auth gradient mid |
| Glow cool | `#4b6d94` | Auth radial glow |
| Neutral 50 | `#fffafd` | App page ground |
| Neutral 200 | `#ecdce8` | Hairlines |
| Neutral 900 | `#221821` | App text |
| White | `#ffffff` | Sidebar, cards, top bar |

**Type**

| Role | Font |
|---|---|
| Headings | Tajawal 700/800 (`font-heading`) |
| Arabic body | Tajawal (`.locale-ar`) |
| English body | Cairo |

RTL: `dir="rtl"` + logical CSS (`start` / `end` / `ps` / `ms`). Never `left` / `right`.

**Logo:** `/images/logo.svg` via `src/components/brand/BrandMark.tsx`.

**CTA (auth):** class `btn-brand` — pink → magenta → pink gradient, white bold, **dark** (ink) shadow, hover shift, active `scale(0.98)`.

**CTA (app):** `Button` default = same gradient, compact. Secondary = `variant="outline"`.

**Glass (auth only):** class `glass-card-dark`.

**Cards (app):** class `stat-card` / `stat-card-label` / `stat-card-value`. Radius 1rem–1.5rem. Magenta numbers. Border only — no pink/magenta shadow or glow.

**Fields (auth):** `field-label` + `field-input`.

**Fields (app):** `app-label` + `app-field`. Errors: `app-error`.

**Selection:** pink fill, white text.

**Radius:** controls `0.75rem`.

---

## Two page types

### Auth (dark)

Login, forgot, inactive, reset.

- Full-viewport photo or ink + overlay + radial glow
- Large screens: brand column \| glass form
- White / blush text on ink
- `btn-brand` for submit
- EN/AR on the form column
- Motion: one `FadeIn` (respect `prefers-reduced-motion`)

**Done:** `src/app/page.tsx` (login).

### App chrome (light)

Every signed-in screen.

- Ground: Neutral 50
- Sidebar + header: white, Neutral 200 border
- Active nav: blush + magenta
- Logo + بالخدمة kicker in sidebar
- Mobile: hamburger + scrim (`lg:` sidebar always on)
- Quiet motion only (150–250ms). No splash, no Lenis

**Done:** `src/components/app-shell.tsx`  
**Done (content):** `src/app/admin/page.tsx`

---

## Shared pieces (reuse — do not restyle per page)

| Piece | File |
|---|---|
| Tokens | `src/styles/design-tokens.css` |
| Utilities | `src/app/globals.css` (`glass-card-dark`, `field-*`, `btn-brand`, `stat-card*`, `list-panel`, `list-row`, `data-table`, `filter-control`, `app-label`, `app-field`, `app-error`, `overlay-scrim`, `overlay-panel`, `overlay-drawer`) |
| Button | `src/components/ui/button.tsx` (`default` / `outline` / `selected`) |
| Shell | `src/components/app-shell.tsx` |
| Auth shell | `src/components/auth/auth-shell.tsx` |
| Logo | `src/components/brand/BrandMark.tsx` |
| Enter motion | `src/components/motion/fade-in.tsx` |
| Live list card | `src/components/client-preview.tsx` |

New screens must use these. No one-off palettes.

---

## Convert the rest — waves

Do **one wave per task**. Match the done screens. Checklist at the bottom of every wave.

### Wave 0 — done (reference)

- [x] Login `src/app/page.tsx`
- [x] App shell `src/components/app-shell.tsx`
- [x] Admin home `src/app/admin/page.tsx`
- [x] Live preview card `src/components/client-preview.tsx`

Open these first when converting another page.

### Wave 1 — done (other auth)

Same dark auth layout as login via `AuthShell`.

| File | What |
|---|---|
| [x] `src/components/auth/auth-shell.tsx` | Shared dark glass layout |
| [x] `src/app/page.tsx` | Login uses `AuthShell` |
| [x] `src/app/forgot/page.tsx` | Glass card, back to login, `btn-brand` |
| [x] `src/app/inactive/page.tsx` | Same |
| [x] `src/app/reset/page.tsx` | Same |

### Wave 2 — done (provider home)

Shell already applied. Match admin home content rhythm.

| File | What |
|---|---|
| [x] `src/app/provider/page.tsx` | `homeLead`, `stat-card` grid (4 cols), outline refresh if allowed, `ClientPreview` |

### Wave 3 — done (list / table screens)

White `rounded-2xl` panel, Neutral 200 border, magenta row hover / selected = blush. Pagination / filters use `Button outline`. No dense gray Bootstrap tables.

| File | What |
|---|---|
| [x] `src/app/admin/providers/page.tsx` | `list-panel` + `data-table`, row hover |
| [x] `src/app/admin/catalog/page.tsx` | `FadeIn` + `CatalogView` |
| [x] `src/app/admin/activity/page.tsx` | `list-panel` rows, `filter-control` |
| [x] `src/app/admin/conflicts/page.tsx` | `FadeIn` + `ConflictsView` |
| [x] `src/app/provider/packages/page.tsx` | outline refresh, catalog cards |
| [x] `src/app/provider/on-belkhidmah/page.tsx` | `FadeIn` (drawer chrome = Wave 5) |
| [x] `src/app/provider/conflicts/page.tsx` | `FadeIn` + `ConflictsView` |
| [x] `src/components/catalog-view.tsx` | outline / selected tabs, no per-row motion |
| [x] `src/components/conflicts-view.tsx` | panel + blush selected pick |
| [x] `src/components/package-card.tsx` | `list-panel`, hover magenta, selected blush |

### Wave 4 — done (forms / editors)

Light fields (not `field-input` — that is dark auth). Use: `app-label` + `app-field` (`rounded-lg border-neutral-200 bg-white`, focus ring `ring-brand-pink`). Primary save = `Button` default. Cancel = outline. Labels Neutral 700, errors rose (`app-error`).

| File | What |
|---|---|
| [x] `src/app/admin/providers/new/page.tsx` | `FadeIn` + `ProviderForm` |
| [x] `src/app/admin/providers/[id]/page.tsx` | outline permissions + form |
| [x] `src/app/admin/providers/[id]/permissions/page.tsx` | `FadeIn` + `PermissionsMatrix` |
| [x] `src/app/admin/packages/[id]/page.tsx` | `FadeIn` + `PackageEditor` |
| [x] `src/app/admin/platform/page.tsx` | `list-panel` forms, `filter-control`, no per-card motion |
| [x] `src/app/admin/pull/page.tsx` | `FadeIn` + `PullForm` |
| [x] `src/app/admin/mock-crm/page.tsx` | `list-panel` + `app-field` |
| [x] `src/app/provider/packages/[id]/page.tsx` | `FadeIn` + locked `PackageEditor` |
| [x] `src/app/provider/refresh/page.tsx` | `FadeIn` + `PullForm` |
| [x] `src/components/provider-form.tsx` | `list-panel`, `app-field`, save + outline cancel |
| [x] `src/components/package-editor.tsx` | `list-panel` + `app-field` |
| [x] `src/components/price-fields.tsx` | `app-field`, Neutral 700 labels |
| [x] `src/components/permissions-matrix.tsx` | `list-panel` + `data-table` |
| [x] `src/components/pull-form.tsx` | `list-panel`, selected / outline scopes |

### Wave 5 — done (overlays)

Drawers / dialogs: white panel, 1rem radius, blush/magenta actions. Overlay ink/45 like mobile nav scrim.

| File | What |
|---|---|
| [x] `src/components/compare-drawer.tsx` | `overlay-drawer` + blush diffs, gradient open |
| [x] `src/components/compare-catalog.tsx` | selected/outline tabs, `filter-control`, no per-row `FadeIn` |
| [x] `src/components/platform-drawer.tsx` | `overlay-drawer` + hide `overlay-panel` |
| [x] `src/components/publish-dialog.tsx` | `overlay-panel`, selected modes, `app-field` |

---

## Per-page checklist

1. Tokens only — no new hex.
2. Tajawal headings; Arabic uses `.locale-ar`.
3. Logical CSS for RTL.
4. Auth → dark glass. App → light shell + `stat-card` / white panels.
5. Primary = gradient button. Secondary = outline.
6. Motion: `FadeIn` on page enter max. No per-row animation.
7. `prefers-reduced-motion` already kills transitions in `globals.css`.
8. Focus ring pink, not browser blue.
9. No pink/magenta box-shadow or glow on cards, panels, or buttons. Dark ink shadow on auth CTA only.

---

## Later Razor move

Port **this file + tokens + class names**, not React trees.

| Next | Razor |
|---|---|
| `AppShell` | `_AppChrome.cshtml` (see `razor-trial/Pages/Home.cshtml`) |
| Login page | `razor-trial/Pages/Index.cshtml` |
| `FadeIn` | GSAP in `wwwroot/js/app.js` |
| Store / routers | PageModel + htmx |

Keep `docs/design.md` as the contract so both stacks stay identical.

---

## Do / don't

**Do:** landing colors, Tajawal, glass on auth, light chrome in-app, reuse shell/button/cards.

**Don't:** Material, new component kits, Framer on every list row, dark cinematic catalog tables, pink/magenta shadows or glows (not a nightclub).
