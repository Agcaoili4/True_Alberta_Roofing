# Home page mockups

Two candidate home-page flows, same visual design (light, steel blue, Outfit/Inter, split
hero). Static HTML/CSS previews only — not the real React site. All content is placeholder
(phone, stats, reviews, and the grey/blue panels standing in for real roof photos).

Open the `.html` files in a browser to scroll them, or use the PNGs to drop into a document.

## Version A — original flow

Files: `home-preview.html`, `home-preview-desktop.png`, `home-preview-mobile.png`

Flow: hero → stats → two services → why-us / family story → before/after gallery →
3-step process → testimonials → CTA → footer.

Fuller page. More storytelling and social proof (process + testimonials).

## Version B — TrueFlight-matched flow

Files: `home-preview-b.html`, `home-preview-b-desktop.png`, `home-preview-b-mobile.png`

Flow: promo/offer bar → hero (mission tagline) → value prop + two services → "why trust us"
grid + CTA → before/after portfolio → repeated free-estimate CTA → footer with hours.

Closer to the client's reference (trueflight.ca). Leaner and more conversion-first: a trust
grid, a portfolio, and a repeated free-estimate CTA with an offer. No process or testimonials
section. See ADR-0005.

## Deciding

Pick a flow and we build that one. Open questions either way:

- Run a real discount offer (like TrueFlight's "$1,000 off"), or drop the promo bar?
- Version A's testimonials come back once there are real reviews.

Once chosen, ADR-0005 gets marked Accepted with the winner.
