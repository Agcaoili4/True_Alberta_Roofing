# 0006 — Sanity manages curated site content, not just the gallery

Accepted, 2026-07-11

## Context

The client asked to edit the site's text (headlines, service copy, the family story,
business info) themselves after launch, not just the photos. ADR-0002 already chose Sanity
for the gallery and argued against a custom admin dashboard (auth, uploads, security, and
maintenance we'd own forever). A headless CMS manages text as well as images, so the same
reasoning applies to editable copy: buy, don't build.

Our earlier plan put most copy in a `content.ts` file only the developer edits. That's fine
for structural text but doesn't let the client change wording on their own.

## Decision

Extend Sanity to manage a curated set of client-editable content, alongside the gallery:
`siteSettings`, `homePage`, `service`, `testimonial`, `aboutStory`, and `project`. Enable
Sanity's Presentation (visual) editing so the client can click text on a live preview and
edit it.

Keep structural text the client shouldn't touch (nav labels, footer legal, form labels) in
`content.ts`, which also supplies defaults when a CMS field is empty. Scope is "curated key
content," not every word — chosen over making almost everything editable to limit schema
work and the risk of the client emptying a section.

No custom admin dashboard. Lead-email destination stays a backend env var, not a CMS field.

## Consequences

Client edits copy and photos in one place with a real editing UI and no security burden on
us. Costs a bit more Sanity schema and wiring the frontend to read those documents (with code
fallbacks). Extends ADR-0002; `content.ts` shrinks to structural text + defaults. Revisit the
editable scope if the client later wants finer control.
