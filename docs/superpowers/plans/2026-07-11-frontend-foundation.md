# Frontend Foundation + Home (Version B) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Mentor-mode note:** The developer chose to be mentored (writes the code themselves, hints before full solutions — see the project's working mode). So config/boilerplate steps give full code to type, but component steps give the **interface, acceptance criteria, and a test to pass** and leave the JSX for the developer to write with guidance. That's intentional, not a missing step.

**Goal:** A running, responsive, accessible React site whose home page matches the Version B mockup (`docs/mockups/home-preview-b-desktop.png`), with all copy driven by a placeholder content file. No backend or CMS yet.

**Architecture:** Vite + React + TypeScript + Tailwind. A `Layout` shell (promo bar, sticky nav with mobile menu, footer) wraps routed pages. The home page is assembled from section components. All text comes from a typed `content/site.ts` so later work can swap it for Sanity data.

**Tech Stack:** Vite, React 18, TypeScript, TailwindCSS, React Router, Vitest + React Testing Library, self-hosted fonts via `@fontsource-variable`.

## Global Constraints

- Package manager: npm. All frontend work happens in `frontend/`.
- Design tokens (exact values): page `#F8FAFC`, mist `#EEF3F8`, card/white `#FFFFFF`, line `#E2E8F0`, ink `#0F172A`, body `#475569`, muted `#64748B`, steel `#1E70B0`, steel-dark `#175D94`, steel-light `#4EA8DE`.
- Fonts: Outfit (headings), Inter (body/UI). Self-hosted, no external CDN.
- Accessibility: WCAG AA — labeled controls, visible focus, alt text, keyboard order, `prefers-reduced-motion` respected. Min 44px touch targets. SVG icons, never emoji.
- Home flow is Version B (ADR-0005). No process or testimonials section.
- Content rule (ADR-0006): client-editable copy will come from Sanity later; this plan puts that copy in `content/site.ts` as placeholders/defaults so the swap is mechanical.
- Commit after every task with a `feat:`/`chore:`/`test:` message.

---

### Task 1: Scaffold the Vite React+TS app

**Files:**
- Create: `frontend/` (Vite scaffold output)

- [ ] **Step 1: Scaffold**

Run: `npm create vite@latest frontend -- --template react-ts`
Then: `cd frontend && npm install`

- [ ] **Step 2: Verify dev server**

Run: `npm run dev`
Expected: Vite serves on `http://localhost:5173` and the default React page loads.

- [ ] **Step 3: Clean the boilerplate**

Delete `src/App.css`, the Vite/React logos in `src/assets`, and reduce `src/App.tsx` to a single `<h1>True Alberta Roofing</h1>`. Remove the logo imports from `App.tsx` and the counter demo.

- [ ] **Step 4: Commit**

```bash
git add frontend
git commit -m "chore: scaffold frontend (vite + react + ts)"
```

---

### Task 2: Tailwind, design tokens, and fonts

**Files:**
- Create: `frontend/tailwind.config.js`, `frontend/postcss.config.js`
- Modify: `frontend/src/index.css`, `frontend/src/main.tsx`

**Interfaces:**
- Produces: Tailwind theme tokens usable as `bg-page`, `text-ink`, `bg-steel`, `font-head`, `font-sans`, plus `text-body`, `text-muted`, `border-line`, `bg-mist`, `bg-steel-dark`, `text-steel-light`.

- [ ] **Step 1: Install**

Run: `npm install -D tailwindcss@^3 postcss autoprefixer && npx tailwindcss init -p`
Run: `npm install @fontsource-variable/outfit @fontsource-variable/inter`

- [ ] **Step 2: Configure tokens** — write `frontend/tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#F8FAFC', mist: '#EEF3F8', line: '#E2E8F0',
        ink: '#0F172A', body: '#475569', muted: '#64748B',
        steel: { DEFAULT: '#1E70B0', dark: '#175D94', light: '#4EA8DE' },
      },
      fontFamily: {
        head: ['"Outfit Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Base styles** — replace `frontend/src/index.css`:

```css
@import '@fontsource-variable/outfit';
@import '@fontsource-variable/inter';
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body { @apply bg-page text-body font-sans antialiased; }
  h1, h2, h3, h4 { @apply font-head text-ink tracking-tight; }
  :focus-visible { @apply outline-none ring-2 ring-steel ring-offset-2; }
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
  }
}
```

Ensure `src/main.tsx` imports `./index.css` (Vite's default does).

- [ ] **Step 4: Verify tokens** — temporarily set `App.tsx` body to `<h1 className="text-steel text-4xl font-head">Tokens work</h1>`, run `npm run dev`, confirm Outfit font + steel-blue color render. Revert the temporary text.

- [ ] **Step 5: Commit**

```bash
git add frontend
git commit -m "chore: add tailwind, design tokens, and self-hosted fonts"
```

---

### Task 3: Test tooling (Vitest + Testing Library)

**Files:**
- Create: `frontend/vitest.config.ts`, `frontend/src/test/setup.ts`, `frontend/src/test/smoke.test.tsx`
- Modify: `frontend/package.json` (add `"test": "vitest"` script)

- [ ] **Step 1: Install**

Run: `npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`

- [ ] **Step 2: Config** — `frontend/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.ts'] },
});
```

`frontend/src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Smoke test** — `frontend/src/test/smoke.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

test('renders a heading', () => {
  render(<h1>True Alberta Roofing</h1>);
  expect(screen.getByRole('heading', { name: /true alberta roofing/i })).toBeInTheDocument();
});
```

- [ ] **Step 4: Run**

Run: `npm test -- --run`
Expected: 1 passing test.

- [ ] **Step 5: Commit**

```bash
git add frontend
git commit -m "test: add vitest + testing-library setup with a smoke test"
```

---

### Task 4: Content file (placeholder copy + business info)

**Files:**
- Create: `frontend/src/content/site.ts`

**Interfaces:**
- Produces: a typed `site` object. Components import fields from it. Shape:
  - `site.business`: `{ name: string; phone: string; email: string; cities: string[]; hours: string }`
  - `site.promo`: `{ enabled: boolean; text: string }`
  - `site.nav`: `{ label: string; href: string }[]`
  - `site.hero`: `{ eyebrow: string; headline: string; sub: string; ctaLabel: string }`
  - `site.services`: `{ key: 'asphalt' | 'standing-seam-metal'; name: string; blurb: string }[]`
  - `site.valueProp`: `{ eyebrow: string; heading: string; sub: string }`
  - `site.trust`: `{ title: string; body: string }[]` (6 items)
  - `site.footerNote`: `string`

- [ ] **Step 1: Write the content** — `frontend/src/content/site.ts`. Use the placeholder copy already in the mockup (`docs/mockups/home-preview-b.html`) as the source of truth for wording. Mark every business fact with a trailing `// TODO: real value`.

```ts
export interface SiteContent {
  business: { name: string; phone: string; email: string; cities: string[]; hours: string };
  promo: { enabled: boolean; text: string };
  nav: { label: string; href: string }[];
  hero: { eyebrow: string; headline: string; sub: string; ctaLabel: string };
  services: { key: 'asphalt' | 'standing-seam-metal'; name: string; blurb: string }[];
  valueProp: { eyebrow: string; heading: string; sub: string };
  trust: { title: string; body: string }[];
  footerNote: string;
}

export const site: SiteContent = {
  business: {
    name: 'True Alberta Roofing',
    phone: '(403) 555-0142',            // TODO: real value
    email: 'hello@truealbertaroofing.ca', // TODO: real value
    cities: ['Calgary', 'Airdrie', 'Okotoks', 'Cochrane'], // TODO: real value
    hours: 'Mon–Sat, 8am–6pm',          // TODO: real value
  },
  promo: { enabled: true, text: 'Ask about our current new-roof offer when you book your free estimate' }, // TODO: real offer or disable
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  hero: {
    eyebrow: 'Family owned · Serving Calgary & area',
    headline: 'Built by family. Backed by 20 years.',
    sub: 'Asphalt shingles and custom standing seam metal, installed right the first time — by the same local crew for two decades.',
    ctaLabel: 'Get My Free Estimate',
  },
  services: [
    { key: 'asphalt', name: 'Asphalt Shingles', blurb: 'Durable, cost-effective shingle roofs installed to last through Alberta hail, wind, and snow. Wide range of colors and profiles.' },
    { key: 'standing-seam-metal', name: 'Custom Standing Seam Metal', blurb: 'Premium standing seam metal roofing, fabricated and fitted to your home. Clean lines, decades of life, and serious curb appeal.' },
  ],
  valueProp: {
    eyebrow: 'Your roofing partner across Alberta',
    heading: 'Two services, done to a standard we put our family name on',
    sub: "We keep the focus narrow so the quality stays high — shingles and custom metal, nothing we can't stand behind.",
  },
  trust: [
    { title: 'Family owned & operated', body: 'You deal with the owners, start to finish — not a call center.' },
    { title: '20+ years experience', body: 'Two decades on Alberta roofs, now under our own name.' },
    { title: 'Licensed, insured & WCB', body: 'Fully covered on every job — no risk to you.' },
    { title: 'Honest, upfront pricing', body: 'Clear written quotes — no surprise line items later.' },
    { title: 'Built for Alberta weather', body: 'Hail, wind, and deep-freeze ready, every install.' },
    { title: 'Workmanship warranty', body: 'We stand behind every roof we put on.' },
  ],
  footerNote: 'Family-owned roofing serving Calgary and surrounding Alberta communities. Asphalt shingles and custom standing seam metal, done right.',
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/content/site.ts
git commit -m "feat: add placeholder site content"
```

---

### Task 5: UI primitives

**Files:**
- Create: `frontend/src/components/ui/Button.tsx`, `Container.tsx`, `SectionHeading.tsx`, `Chip.tsx`
- Test: `frontend/src/components/ui/Button.test.tsx`

**Interfaces:**
- Produces:
  - `Button` — props `{ as?: 'button' | 'a'; href?: string; variant?: 'primary' | 'ghost'; children; ...rest }`. `primary` = `bg-steel text-white hover:bg-steel-dark`; `ghost` = `border border-line text-ink`. Always `inline-flex items-center gap-2 font-head font-bold rounded-lg px-5 py-3 min-h-[44px] cursor-pointer transition-colors`.
  - `Container` — `{ children; className? }` → `<div class="mx-auto max-w-content px-6 md:px-10">`.
  - `SectionHeading` — `{ eyebrow?; title; sub?; center? }`.
  - `Chip` — `{ children }` → pill with `bg-mist border border-line text-slate-700 rounded-full px-3 py-1 text-sm`.

- [ ] **Step 1 (mentor): Write the failing test** — `Button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Button } from './Button';

test('primary button renders as a link when href is given', () => {
  render(<Button href="/contact">Free Estimate</Button>);
  const el = screen.getByRole('link', { name: /free estimate/i });
  expect(el).toHaveAttribute('href', '/contact');
  expect(el.className).toMatch(/bg-steel/);
});
```

- [ ] **Step 2: Run it, confirm it fails** — `npm test -- --run Button` → FAIL (module not found).

- [ ] **Step 3 (mentor): Implement the four primitives** to satisfy the interfaces above. Hint for `Button`: render an `<a>` when `href` is present, otherwise a `<button>`; compose classes from a `base` string + a `variants` map keyed by `variant`. Keep each file tiny and prop-typed.

- [ ] **Step 4: Run tests** — `npm test -- --run Button` → PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ui
git commit -m "feat: add ui primitives (Button, Container, SectionHeading, Chip)"
```

---

### Task 6: Layout shell (promo bar, nav, footer)

**Files:**
- Create: `frontend/src/components/layout/PromoBar.tsx`, `Nav.tsx`, `Footer.tsx`, `Layout.tsx`
- Test: `frontend/src/components/layout/Nav.test.tsx`

**Interfaces:**
- Consumes: `site` (Task 4), `Button`/`Container` (Task 5).
- Produces: `Layout` — `{ children }` renders `<PromoBar/>` (only if `site.promo.enabled`), `<Nav/>`, `<main>{children}</main>`, `<Footer/>`. `Nav` shows the brand, `site.nav` links, phone, a Free Estimate `Button`, and a hamburger `<button aria-label="Menu" aria-expanded={open}>` that toggles a mobile menu panel. Links hidden below `md`, hamburger shown below `md`.

- [ ] **Step 1 (mentor): Write the failing test** — `Nav.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import { Nav } from './Nav';

test('mobile menu toggles open', async () => {
  render(<Nav />, { wrapper: MemoryRouter });
  const button = screen.getByRole('button', { name: /menu/i });
  expect(button).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
});
```

(Note: `react-router-dom` is added in Task 7; if you build Nav before routing, use a plain `<a>` and drop the `MemoryRouter` wrapper, then switch to `Link` in Task 7.)

- [ ] **Step 2: Run it, confirm it fails** — `npm test -- --run Nav` → FAIL.

- [ ] **Step 3 (mentor): Implement the layout pieces.** Hints: keep open/closed state with `useState(false)`; the hamburger is `md:hidden`, the desktop links are `hidden md:flex`; match spacing/colors to the mockup (`docs/mockups/home-preview-b.html` is the reference — steal its class intents, not its raw CSS). Sticky nav: `sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-line`.

- [ ] **Step 4: Run tests** — `npm test -- --run Nav` → PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/layout
git commit -m "feat: add layout shell (promo bar, nav with mobile menu, footer)"
```

---

### Task 7: Routing and page stubs

**Files:**
- Create: `frontend/src/pages/Home.tsx`, `Services.tsx`, `Gallery.tsx`, `About.tsx`, `Contact.tsx`
- Modify: `frontend/src/App.tsx`, `frontend/src/main.tsx`, `frontend/src/components/layout/Nav.tsx` (swap `<a>` for `<Link>`)

**Interfaces:**
- Consumes: `Layout` (Task 6).
- Produces: `App` renders `<Layout>` wrapping `<Routes>` for `/`, `/services`, `/gallery`, `/about`, `/contact`. Non-home pages are stubs: a `Container` with an `<h1>` naming the page.

- [ ] **Step 1: Install router** — `npm install react-router-dom`.

- [ ] **Step 2 (mentor): Wire routes.** In `main.tsx` wrap `<App/>` in `<BrowserRouter>`. In `App.tsx` render `<Layout>` + `<Routes>`/`<Route>` for the five paths. Convert `Nav` links to `<Link to={item.href}>`.

- [ ] **Step 3: Verify navigation** — `npm run dev`, click each nav item, confirm the URL and stub heading change and the layout persists.

- [ ] **Step 4: Commit**

```bash
git add frontend/src
git commit -m "feat: add routing and page stubs"
```

---

### Task 8: Home page sections (Version B)

**Files:**
- Create: `frontend/src/components/sections/Hero.tsx`, `Services.tsx`, `WhyTrust.tsx`, `GalleryPreview.tsx`, `CtaBand.tsx`
- Create: `frontend/src/components/icons/` (small inline SVG icon components: `CheckIcon`, `ArrowIcon`, `PhoneIcon`, `ShieldIcon`, plus the trust-card icons)
- Modify: `frontend/src/pages/Home.tsx`

**Interfaces:**
- Consumes: `site`, `Container`, `SectionHeading`, `Button`, `Chip`.
- Produces: `Home` renders, in order: `Hero`, `Services` (value prop + two cards), `WhyTrust` (6-card grid + CTA), `GalleryPreview` (placeholder tiles + "See all projects" → `/gallery`), `CtaBand`. This is the Version B flow (ADR-0005).

- [ ] **Step 1 (mentor): Build the sections** to match `docs/mockups/home-preview-b-desktop.png`. Reference the mockup HTML for layout intent. Notes:
  - `Hero`: two-column grid on `md+`, single column on mobile; left = eyebrow/headline/sub/two buttons (primary CTA + ghost "Call" with `site.business.phone`)/chips; right = a placeholder photo block (a `rounded-2xl` gradient div with a "Your project photo goes here" tag — real image comes with Sanity later).
  - `Services`: `SectionHeading` (from `site.valueProp`) + a 2-col grid mapping `site.services`.
  - `WhyTrust`: `bg-mist` section, 3-col grid (`sm:grid-cols-2 lg:grid-cols-3`) mapping `site.trust`, then a centered `Button`.
  - `GalleryPreview`: heading + a responsive grid of 6 placeholder before/after tiles + a ghost `Button` linking to `/gallery`.
  - `CtaBand`: full-width `bg-steel` band, white heading/sub, white primary `Button` + phone link.
- [ ] **Step 2: Assemble Home** — `Home.tsx` renders the five sections in order.
- [ ] **Step 3: Visual check** — `npm run dev`, compare `/` against `docs/mockups/home-preview-b-desktop.png` at 1440px and against `home-preview-b-mobile.png` at 390px. Fix spacing/order until it matches.
- [ ] **Step 4: Run all tests** — `npm test -- --run` → all green.
- [ ] **Step 5: Commit**

```bash
git add frontend/src
git commit -m "feat: build Version B home page sections"
```

---

### Task 9: Responsive + accessibility pass

**Files:**
- Modify: section/layout components as needed
- Create: `frontend/src/pages/Home.test.tsx`

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Add a skip link** — in `Layout`, a visually-hidden-until-focus `<a href="#main">Skip to content</a>`, and give `<main id="main">`.
- [ ] **Step 2 (mentor): Manual a11y sweep** — every interactive element reachable by Tab in visual order with a visible focus ring; the placeholder photo blocks are decorative (`aria-hidden` or empty `alt`); real images later get real `alt`; icon-only buttons have `aria-label`; check color contrast of muted text on `bg-mist`.
- [ ] **Step 3: Responsive sweep** — verify 375 / 768 / 1024 / 1440px: no horizontal scroll, nav collapses to hamburger, grids reflow (services → 1 col, trust → 1–2 col, gallery → 2 col).
- [ ] **Step 4 (mentor): Home smoke test** — `Home.test.tsx` renders `Home` inside `MemoryRouter` and asserts the hero headline and the "Why trust" heading are present. Write the failing test first, then confirm it passes (the components already exist).

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import Home from './Home';

test('home shows the hero headline and trust section', () => {
  render(<Home />, { wrapper: MemoryRouter });
  expect(screen.getByRole('heading', { name: /built by family/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /why trust/i })).toBeInTheDocument();
});
```

- [ ] **Step 5: Run + commit**

Run: `npm test -- --run` → all green.

```bash
git add frontend/src
git commit -m "feat: accessibility + responsive pass with home smoke test"
```

---

## Self-Review

- **Spec coverage:** Frontend §6 (site map shell + Version B home), design system §6.3, content split §9 (placeholder content file), a11y/responsive §10 — covered. Backend §7, Sanity §8, the estimate form, and the detailed inner pages are explicitly out of scope here and handled in plans 2–5.
- **Placeholder scan:** The only `TODO`s are real business values in `content/site.ts` (phone/email/cities/hours/offer), which are genuine unknowns flagged for the client, not plan gaps.
- **Type consistency:** `site` field names in Task 4 match their uses in Tasks 6 and 8; `Button` props in Task 5 match usage in layout/sections.

## Deferred to later plans

Estimate form + backend (`POST /api/estimates`, Zod, Resend), Sanity Studio + content types + fetching, Services/Gallery/About/Contact page detail, SEO meta/sitemap, and deploy.
