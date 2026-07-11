# 0001 — Stack

Accepted, 2026-07-10

## Context

New marketing site with a photo gallery the client manages and an estimate form that emails
leads. I also want to actually learn full-stack building it, not just ship it.

## Decision

- Frontend: React + Vite + TypeScript + Tailwind
- Backend: Node (the runtime) + Express + TypeScript + Helmet
- Gallery: Sanity (see 0002)
- Email: Resend

This lines up with the standards already in the repo, keeps TypeScript on both ends, and
Vite plus Tailwind is a fast loop for a custom design. Express is a good place to learn
backend basics.

## Consequences

One language across the whole thing. Express is heavier than a static marketing site
strictly needs, but that's the point here — it's the learning surface and leaves room for
dynamic features later. Sanity and Resend are external services we now depend on; both have
free tiers.
