# 0005 — Home page flow: TrueFlight-matched (Version B)

Accepted, 2026-07-11

Decided: the client chose **Version B**, the TrueFlight-matched flow. We built two mockups to
compare (both in `docs/mockups/`); Version A (our original, fuller flow) is kept there for
reference but is not what we build.

## Context

The client's main reference is trueflight.ca and they asked to keep the page "flow" as
close to it as possible. TrueFlight's home flow is: header with phone + an offer banner,
a hero built around a short mission tagline, a value-prop headline, a "why trust us"
benefits grid with a free-estimate CTA, a before/after portfolio grid, a repeated
free-estimate CTA with the offer, then a footer with hours and socials. It has no
testimonials and no multi-step process section.

We already locked our own visual design in 0004 (light, steel blue, Outfit/Inter, split
hero). This decision is only about section order and conversion structure, not the look.

## Decision

Match TrueFlight's flow, mapped onto True Alberta's identity:

1. Sticky header + promo/offer bar (offer is a placeholder — client decides the actual deal)
2. Hero — mission tagline ("Built by family. Backed by 20 years."), split layout, phone + CTA
3. Value prop — one line naming asphalt + standing seam and the service area, with the two services
4. Why Trust Us — six benefit cards + a free-estimate CTA
5. Before/after portfolio — the centerpiece, managed in Sanity
6. Repeated free-estimate CTA band (no-pressure, offer)
7. Footer — contact, hours prominent, service area, socials

Drop the 3-step process and the testimonials section to match TrueFlight. We keep a compact
services duo so the standing-seam work stays visible, which is a small deviation the client
asked for on the business side.

## Consequences

The home page leans on the trust grid + portfolio + repeated CTA, like the reference. Two
things stay the client's call: whether to run a real discount offer, and whether to keep the
services duo. Testimonials come back later once there are real reviews. Supersedes the home
flow described in the design spec §6.1, which is updated to match.
