# 0004 — Visual direction

Accepted, 2026-07-10

## Context

Client wanted something original and smooth, heavy on the family and 20-years angle, with
the custom metal work as the thing that sets them apart. Reference was trueflight.ca. There's
no existing logo or colors, so we designed from scratch. We went through a few directions in
a visual companion, landed on a "modern premium" feel, then switched it to a light
background.

## Decision

- Light base: page `#F8FAFC`, cards `#FFFFFF`, alternating sections `#EEF3F8`, footer `#0F172A`
- Steel blue accent: `#1E70B0` for buttons and links, `#4EA8DE` for lighter detail
- Outfit for headings, Inter for body
- Trust styling: licensed/insured/warranty badges, before/after proof, family story up front
- Split hero — headline and CTA left, roof photo right

## Consequences

Gives us a consistent set of Tailwind tokens to build from. Leans on good roof photography,
which we don't have yet, so placeholders until it shows up. The accent got darkened from the
`#4EA8DE` we first mocked to `#1E70B0` so white button text actually passes contrast. Light
over dark because roofs read better on white and light tends to convert better for local
home services. No dark mode — the site's light-only at launch.
