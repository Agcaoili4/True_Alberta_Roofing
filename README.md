# True Alberta Roofing

Marketing site for a family-run Alberta roofing company. They do asphalt shingles and custom standing seam metal. The site exists to get people to request a free estimate.

Early Phase — the design is done but nothing's built yet.

## Stack

- Frontend: React + Vite + TypeScript + Tailwind
- Backend: Node (the runtime) + Express + TypeScript (Express runs on Node; Helmet for security headers)
- Gallery: Sanity, so the client can add their own photos without touching code
- Email: Resend, so estimate requests land in their inbox

## Layout

```
frontend/   the site
backend/    the estimate API
studio/     Sanity schemas
docs/       spec and decisions
```

## Running it

Nothing runs yet. Each package gets its own setup notes and scripts as it's built. See the
build order at the end of the [design spec](docs/superpowers/specs/true-alberta-roofing-website-design.md).

## Docs

- [Design spec](docs/superpowers/specs/true-alberta-roofing-website-design.md) — what we're building and why
- [Architecture](docs/ARCHITECTURE.md) — how the pieces fit
- [Decisions](docs/adr/) — ADRs for the calls worth explaining
