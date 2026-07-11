# 0002 — Sanity for the gallery instead of a custom admin

Accepted, 2026-07-10

## Context

The client isn't technical and wants to manage their own project photos. The obvious
DIY version is a login plus an upload page. That sounds small but isn't: passwords,
sessions, resets, file-upload validation, somewhere to store the images, resizing, a CDN,
and then maintaining all of it. Auth and file uploads are two of the easiest things to get
wrong on a live site, and I'd be the one on the hook when it breaks.

## Decision

Use Sanity for the gallery. The client uploads photos in Sanity Studio; the frontend reads
them from Sanity's CDN.

## Consequences

No auth, upload, or storage code to write or secure. Image optimization and a CDN come with
it. The Express backend gets to stay focused on just the estimate form. Downside is another
third-party dependency and a second place content lives (alongside `content.ts`). Building a
real admin panel is still a good thing to learn someday — just not on a client's live site.
