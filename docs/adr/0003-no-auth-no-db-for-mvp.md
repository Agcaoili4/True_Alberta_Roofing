# 0003 — No auth, no database for the MVP

Accepted, 2026-07-10

## Context

The early `BACKEND.md` and `API_DESIGN.md` notes assumed JWT auth and protected routes. But
looking at what the MVP actually does, there's nothing private: the backend takes a public
estimate form and emails it. Editing gallery content happens in Sanity, which has its own
login.

## Decision

No auth and no database for now. Leads go out by email through Resend, and the business
inbox is the record of them.

## Consequences

Smaller backend, less to get wrong, faster to ship. The tradeoff is there's no lead history,
search, or status in the app — fine at launch, since the owner has every lead in their
inbox. If we later want saved leads, a dashboard, or booking, that's when a database and
auth go in, and it gets its own ADR. The controller/service split leaves room for that
without a rewrite.
