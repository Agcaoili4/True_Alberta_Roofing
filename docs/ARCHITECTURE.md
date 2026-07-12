# Architecture

Three pieces. The React app is the site. The Express API takes estimate requests and emails them. Sanity holds the content and photos the client manages themselves.

```
                 React frontend (Vite / TS)
                  |                    |
        POST /api/estimates      read from Sanity CDN
                  |                    |
          Express API              Sanity CMS
       validate + email         client edits text + photos
        (Resend, no DB)          (Sanity handles auth/storage/CDN)
```

The frontend doesn't hold any secrets or business logic beyond form handling and fetching.
The backend only knows about leads — it never touches site content. Sanity runs its own login and storage, so we don't build any of that.

## The two flows

**Estimate request.** Form submits to `POST /api/estimates`. The API validates the body, drops obvious spam (honeypot field), then sends two emails through Resend: the lead to the business, and a "we got it" reply to the customer. Returns 201. There's no database — the
inbox is the record.

**Content & gallery.** The client edits curated text (headlines, service copy, the family
story, business info, testimonials) and uploads before/after photos in Sanity Studio — form
fields or click-on-the-page visual editing. The frontend queries the published documents
from Sanity's CDN and renders them; the home page only shows projects marked featured.
See the spec §8 for the content types.

## Interfaces

- Frontend to backend: JSON over HTTP, one endpoint. Contract is in the spec, §7.
- Frontend to Sanity: a read-only GROQ query. Schema is in the spec, §8.
- Content vs. code: client-editable copy and photos live in Sanity; structural text and
  fallbacks live in a `content.ts` file, not scattered through components (spec §9).

## What we deliberately left out

No database, no auth, no custom admin panel. Reasons in ADR-0002 and ADR-0003.
