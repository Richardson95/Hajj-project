# HajjPath

**From Intention to Completion, HajjPath Guides You All the Way.**

A complete pilgrimage ecosystem for Nigerian Muslims at home and abroad — Shariah-compliant
Hajj savings, verified identity onboarding, live guidance across the holy sites, a verified
Makkah marketplace, and an emergency network that never sleeps.

Built as a **responsive web application** with Next.js 16 (App Router), React 19, TypeScript
and Tailwind CSS v4. Nothing to install — it runs in any modern browser, on desktop, tablet
or phone.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

| Script              | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Development server (Turbopack)                       |
| `npm run build`     | Production build                                     |
| `npm start`         | Serve the production build                           |
| `npm run typecheck` | TypeScript, no emit                                  |
| `npm run lint`      | ESLint (flat config, React Compiler rules included)  |
| `npm run check`     | Typecheck → lint → build, in one pass                |

### Trying the demo

The app ships with a fully populated 2027 (1448 AH) pilgrimage so every screen has real
content.

- **Sign in** at `/auth/login` with any valid email or 11-digit Nigerian phone number and
  any 6+ character password. There is a one-click "fill demo credentials" button.
- **Register** at `/auth/register` to walk the full 6-step KYC onboarding. The phone
  verification step uses the code **`482016`**.
- State lives in `localStorage` under `hajjpath.state.v2`. **Reset demo data** from the
  sidebar or from Profile → Session & demo data.

---

## What is in the build

### Marketing site (public)

| Route             | Contents                                                                       |
| ----------------- | ------------------------------------------------------------------------------ |
| `/`               | Hero, three pillars, savings features, live plan estimator, in-Makkah modules, post-Hajj, personas, six-step journey, compliance, testimonials, FAQ, CTA |
| `/how-it-works`   | Eight-stage timeline with durations, requirements checklist, estimator          |
| `/packages`       | Three Hajj packages, full comparison table, contribution figures per frequency  |
| `/companion`      | The six on-the-ground modules, map legend, languages, offline behaviour         |
| `/vendors`        | Vendor value proposition, categories, onboarding steps, commercial terms        |
| `/about`          | Mission, values, the five constituencies served, governance                     |
| `/faq`            | Filterable FAQ across savings, compliance, in-Makkah and account topics         |
| `/contact`        | Validated contact form, support channels, emergency guidance                    |
| `/legal/terms`, `/legal/privacy` | Full terms of service and privacy policy                        |

### Authentication

- `/auth/login` — validated sign-in, password visibility toggle, biometric option
- `/auth/register` — six-step wizard: details → phone OTP → identity (BVN/NIN/passport)
  → document upload → savings plan → review, consents and activation
- `/auth/forgot-password` — reset request with success state

### The application (`/app`)

| Route                        | Module                                                                     |
| ---------------------------- | -------------------------------------------------------------------------- |
| `/app`                       | Dashboard — goal ring, plan health, countdown, savings trajectory chart, itinerary preview, activity, broadcasts, checklist, group |
| `/app/savings`               | Virtual account, plan cards, deposits, pause/resume, ledger with filters, CSV export, withdrawal flow |
| `/app/family`                | Household overview and sponsored plans for parents, spouses and children     |
| `/app/referrals`             | Referral code, share sheet, reward ledger, apply credit to a plan            |
| `/app/notifications`         | Filterable notification centre                                              |
| `/app/planner`               | Twelve-day 1448 AH itinerary, obligation levels, per-activity completion     |
| `/app/guide`, `/app/guide/[slug]` | Seven ritual chapters, ordered steps, du'ās in Arabic with transliteration, live speech narration in four languages |
| `/app/checklist`             | Twenty-six item packing checklist by category, export, marketplace hand-off  |
| `/app/map`                   | Schematic Mashaer map, 25 mapped points, category filters, walking times     |
| `/app/find-me`               | Live group positions, member welfare list, scannable QR pilgrim tag, group alerts |
| `/app/announcements`         | Prioritised broadcasts from NAHCON, the operator and the group admin         |
| `/app/sos`                   | Six emergency categories with dispatch routing, alert history, emergency contacts, direct numbers |
| `/app/marketplace`           | Seven categories, 20 products, six verified vendors, search and sort         |
| `/app/marketplace/[id]`      | Product detail, vendor profile, delivery zones, escrow explainer             |
| `/app/marketplace/cart`      | Quantities, drop-off selection, escrow checkout                             |
| `/app/marketplace/orders`    | Order tracker, delivery confirmation, dispute flow                          |
| `/app/gallery`               | Memories by stage with lightbox and composer                                |
| `/app/journal`               | Reflection entries, moods, privacy, Al-Hajji badge card, writing prompts     |
| `/app/profile`               | Identity record, security toggles, languages, appearance, notifications      |
| `/app/vendor`                | Vendor portal — orders, settlement, performance, catalogue                   |
| `/app/admin`                 | Group admin — live positions, 10-pilgrim manifest, broadcasts, CSV export    |

---

## Architecture

```
src/
├── app/                      # App Router
│   ├── (marketing)/          # Public site, shares header + footer
│   ├── auth/                 # Split-screen auth layout
│   ├── app/                  # Authenticated shell (sidebar, topbar, mobile nav)
│   ├── layout.tsx            # Fonts, metadata, theme + toast + store providers
│   ├── error.tsx             # Error boundary
│   ├── not-found.tsx         # 404
│   ├── manifest.ts           # PWA manifest
│   ├── sitemap.ts / robots.ts
│   └── globals.css           # Design tokens, patterns, animations
├── components/
│   ├── ui/                   # Button, Card, Badge, Field, Progress, Modal, Toast, Tabs, misc
│   ├── app/                  # Shell, search palette, charts, map canvas, modals, product views
│   ├── marketing/            # Header, footer, hero preview, calculator, FAQ, testimonials
│   ├── auth/                 # Login, register wizard, OTP input, upload field
│   ├── brand-icons.tsx       # Hand-drawn Ka'bah, mosque, tasbih, prayer mat, logo mark
│   ├── icon.tsx              # Icon registry for data-driven icons
│   └── logo.tsx
└── lib/
    ├── types.ts              # Complete domain model
    ├── data/                 # Seeded packages, account, itinerary, guide, map, marketplace, comms, journey, marketing
    ├── savings.ts            # Departure dates, cycle maths, plan health, projections
    ├── format.ts             # Currency, dates, masking, pluralisation
    ├── store.tsx             # Client store with localStorage persistence
    ├── client-hooks.ts       # useHydrated, useScrolledPast, usePrefersDark
    └── cn.ts
```

### Design system

- **Brand colour** Forest Green `#014421`, anchored at `forest-800` in a full 50–950 ramp.
- **Accent** Zamzam Gold `#C9A227`, with warm sand neutrals for surfaces.
- Semantic tokens (`--surface`, `--line`, `--ink`, `--muted`) drive **light and dark mode**;
  the theme is applied before paint by an inline script, so there is no flash.
- Islamic eight-point star tessellation, mihrab arch masks and a gold-on-green gradient
  system carry the brand across every surface.
- Typography: **Plus Jakarta Sans** for the interface, **Amiri** for Arabic du'ās,
  **Geist Mono** for tabular figures.

### Notable engineering decisions

- **No external chart or map library.** The savings trajectory chart and the Mashaer map
  are hand-rolled SVG, so they inherit the theme, respond to dark mode and add no weight.
- **Real QR codes.** Pilgrim tags render genuine scannable QR codes via `qrcode.react`,
  not decorative look-alikes.
- **Real audio narration.** The guide reads chapters aloud through the browser's speech
  synthesis and says plainly when a device has no voice for the chosen language.
- **Hydration-safe by construction.** Browser state is read through
  `useSyncExternalStore`, and date-dependent figures are marked
  `suppressHydrationWarning`, so server and client markup always agree.
- **React Compiler clean.** No `setState` inside effects anywhere; modals and the command
  palette mount their state only while open, and derived resets adjust state during render.
- **Accessibility.** Skip link, focus-visible rings, labelled controls, `aria-pressed` on
  toggles, focus-trapped modals, `prefers-reduced-motion` support, and semantic tables.

### Data

Everything is seeded, typed mock data — no backend is required to run or evaluate the app.
The seed set models one coherent pilgrimage: pilgrim **Ibrahim Adetunji**, the **Al-Amanah
Hajj Group 2027**, a 12-day 1448 AH itinerary, 48 group members, 25 mapped locations,
6 vendors and 20 products.

To connect a real backend, replace the reads in `src/lib/data/**` and the mutations in
`src/lib/store.tsx`; the UI layer is already isolated from both.

---

## Production notes

This build is a complete, working front end. Before going live you would add:

- A real API and database behind `src/lib/store.tsx` (PostgreSQL is the natural fit).
- Server-side sessions and authentication — the current auth is client-side for the demo.
- Live integrations: Paystack/Flutterwave/Moniepoint virtual accounts, VerifyMe or SmileID
  for BVN/NIN, and a push provider for reminders.
- Real device GPS for Find Me, replacing the seeded coordinates.
- Recorded audio narration files per language, alongside the browser speech fallback.

### Compliance framing already built in

HajjPath does not allocate Hajj seats — NAHCON and the State Pilgrims Welfare Boards do.
That boundary is stated in the terms, the FAQ, the onboarding consent and the footer, and
the app instead produces a compliance pack for submission.

All figures (package fares, Hijri dates, FX rates) are illustrative and labelled as
provisional in the interface, since they are re-gazetted each Hajj season.

---

## Status

`npm run check` passes cleanly: TypeScript reports no errors, ESLint reports no problems,
and the production build prerenders 40+ routes. Every route has been smoke-tested against a
running server and returns 200 (with 404 correctly served for unknown paths).
