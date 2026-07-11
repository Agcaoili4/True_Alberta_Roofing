# Architecture

Three pieces. The React app is the site. The Express API takes estimate requests and emails them. Sanity holds the photo gallery the client manages themselves.

```
                 React frontend (Vite / TS)
                  |                    |
        POST /api/estimates      read from Sanity CDN
                  |                    |
          Express API              Sanity CMS
       validate + email          client uploads photos
        (Resend, no DB)          (Sanity handles auth/storage/CDN)
```

The frontend doesn't hold any secrets or business logic beyond form handling and fetching.
The backend only knows about leads — it never touches gallery content. Sanity runs its own login and storage, so we don't build any of that.

## The two flows

**Estimate request.** Form submits to `POST /api/estimates`. The API validates the body, drops obvious spam (honeypot field), then sends two emails through Resend: the lead to the business, and a "we got it" reply to the customer. Returns 201. There's no database — the
inbox is the record.

**Gallery.** The client uploads before/after photos in Sanity Studio. The frontend queries published `project` documents from Sanity's CDN and renders them. The home page only shows
the ones marked featured.

## Interfaces

- Frontend to backend: JSON over HTTP, one endpoint. Contract is in the spec, §7.
- Frontend to Sanity: a read-only GROQ query. Schema is in the spec, §8.
- Content vs. code: business facts and copy live in a `content.ts` file, not scattered
  through components.

## What we deliberately left out

No database, no auth, no custom admin panel. Reasons in ADR-0002 and ADR-0003.
