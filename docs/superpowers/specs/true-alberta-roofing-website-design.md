# Design spec — True Alberta Roofing website

Status: design approved, no code yet
Date: 2026-07-10
Owner: Jansen

Working mode is mentor: I write the code, guidance explains the reasoning and reviews it.

## What we're building

A lead-gen site for True Alberta Roofing, a family-owned Alberta company moving from subcontracting to selling and installing on their own. They do asphalt shingles and custom standing seam metal.

The only metric that matters is free estimate requests. Everything on the site points at that. The brand should feel original (not a template), smooth to scroll, and lean on the family angle and 20+ years of experience. Client's reference for the vibe was trueflight.ca — concept, not a copy.

## Scope

In:

- Scrolling home page plus Services, Gallery, About, and Contact pages
- Free estimate form that emails the lead to the business and auto-replies to the customer
- Before/after gallery the client manages in Sanity
- Placeholder content now, real photos and details swapped in later
- Responsive, accessible (WCAG AA), basic SEO

Out, for now:

- Auth / JWT — nothing to protect yet (ADR-0003)
- A database — email is the lead record (ADR-0003)
- A custom photo-upload admin — Sanity does that (ADR-0002)
- Per-city landing pages, FAQ, financing copy, online booking, reviews API. After launch if
  they want them.

## Architecture

See [ARCHITECTURE.md](../../ARCHITECTURE.md) for the diagram. Short version: React app,
Express API for the estimate form (validate then email via Resend, no DB), Sanity for the
gallery. Full walk-through of the two flows is in that doc.

## Repo

```
frontend/   React (Vite + TS + Tailwind)
backend/    Express (TS) — already started
studio/     Sanity Studio (schemas + config)
docs/       specs, architecture, ADRs
```

## Frontend

Pages:

- `/` — Version B (TrueFlight-matched), chosen by the client (ADR-0005): promo/offer bar,
  hero mission tagline, value prop + two services, "why trust us" grid + CTA, before/after
  portfolio, repeated free-estimate CTA, footer with hours. No process or testimonials
  section for launch. (Version A is kept in `docs/mockups/` for reference only.)
- `/services` — asphalt and standing seam, in detail
- `/gallery` — full before/after grid from Sanity
- `/about` — the family and the 20 years
- `/contact` — the full estimate form, plus phone, email, service area

Sticky nav with a "Free Estimate" button and the phone number on every page. Dark footer.

Components group roughly as: `layout/` (nav, footer, shell), `sections/` (the home page
blocks), `gallery/`, `form/`, and `ui/` for the small shared primitives. Mobile-first,
props typed, data fetching kept out of the presentational pieces.

### Look

- Light: page `#F8FAFC`, cards `#FFFFFF`, alternating sections `#EEF3F8`, footer `#0F172A`
- Steel blue accent: `#1E70B0` for buttons and links, `#4EA8DE` for lighter detail
- Text: `#475569` body, `#64748B` muted
- Outfit for headings, Inter for body and forms
- Trust-and-authority styling: licensed/insured/warranty badges, before/after proof, family
  story up top
- Split hero (headline + CTA on the left, roof photo on the right)
- AA contrast, 44px touch targets, honors `prefers-reduced-motion`, SVG icons not emoji

More on why in ADR-0004.

## Backend — POST /api/estimates

Controller stays thin, logic in a service, email in its own module, so we can swap the
provider or the validation later without touching the route.

Request:

```json
{
  "name": "required",
  "email": "required if no phone",
  "phone": "required if no email",
  "city": "required",
  "serviceType": "asphalt | standing-seam-metal | not-sure",
  "message": "optional",
  "company": "honeypot, must be empty"
}
```

Responses:

- `201` — accepted, emails sent: `{ "ok": true }`
- `400` — validation failed: `{ "ok": false, "errors": { field: message } }`
- `500` — send failed: `{ "ok": false, "error": "Something went wrong" }`

Notes:

- Validate with Zod. Reject unknown or oversized payloads.
- If the honeypot `company` field is filled, return 201 but don't send anything.
- Two Resend emails: lead to the business, auto-reply to the customer.
- Don't leak internal errors to the client; log them server-side.
- Rate limiting and anything fancier on spam is post-MVP.

## Sanity — content types

The client edits both text and photos in hosted Sanity Studio. We don't build the auth or
uploads (ADR-0002); the editable scope is "curated key content" (ADR-0006). Content types:

- `siteSettings` (singleton) — business name, phone, email, service-area cities, hours,
  promo/offer (text + on/off), social links
- `homePage` (singleton) — hero eyebrow/headline/subhead/CTA label, value-prop heading + text
- `service` — name, blurb, category (`asphalt` | `standing-seam-metal`), order
- `testimonial` — quote, author, city, rating, featured, order
- `aboutStory` (singleton) — the family / 20-years story (used on About + why-us)
- `project` (gallery) — `title`, `category`, `beforeImage`, `afterImage`, `location`,
  `featured` (show on home), `order`

Sanity's Presentation tool gives click-on-the-page visual editing, so the client can edit a
sentence on a live preview, not just in forms.

## Content split: Sanity vs code

Client-editable copy and photos live in Sanity (above). Structural text the client shouldn't
touch — nav labels, footer legal, form field labels, section scaffolding — stays in a typed
`content.ts` in the frontend, which also holds sensible defaults/fallbacks if a CMS field is
empty. Rule of thumb: if the owner would reasonably want to change it, it's in Sanity;
if changing it would break layout or wording the developer owns, it's in code.

## The rest

- Accessibility: labeled inputs, visible focus, alt text, sane tab order, contrast.
- Performance: Sanity's optimized images, lazy-load below the fold, reserve space so nothing
  jumps.
- SEO: real title/description per page, semantic headings, Open Graph, a sitemap.
- Responsive: check 375 / 768 / 1024 / 1440, no sideways scroll on mobile.
- Tests: backend gets unit tests on the validation and the estimate service (email mocked);
  the form gets a component test for loading/error/success.
- Hosting later: frontend on Vercel or Netlify, backend on Render, Sanity is hosted. Free
  tiers are fine to start.

## Build order

Small steps, each one runnable before the next:

1. Scaffold `frontend/` (Vite, Tailwind, fonts, tokens), get a static hero on screen
2. Layout and routing — nav, footer, five page stubs
3. Home sections wired to placeholder content
4. The estimate endpoint (validate, then Resend)
5. Hook the form up to it, with loading/error/success states
6. Sanity Studio and the gallery
7. Polish — SEO tags, an accessibility pass, responsive QA — then deploy

## Still need from the client

- The exact business name and spelling (using "True Alberta Roofing" for now)
- Where estimate emails should go
- Which Alberta cities they cover
- Phone, email, hours
- Real photos, a logo, testimonials

## Decisions

- ADR-0001 — stack
- ADR-0002 — Sanity instead of a custom admin
- ADR-0003 — no auth, no DB for the MVP
- ADR-0004 — the visual direction
- ADR-0005 — home flow mirrors trueflight.ca
- ADR-0006 — Sanity manages curated site content (text + images)
