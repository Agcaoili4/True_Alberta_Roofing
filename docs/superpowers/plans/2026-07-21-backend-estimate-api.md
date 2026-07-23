# Backend Estimate API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.
>
> **Mentor-mode note:** The developer writes the code with hints-first guidance. Config/boilerplate steps give full code; logic steps give the failing tests (the spec) + hints and leave the implementation to the developer. That split is intentional.

**Goal:** A working `POST /api/estimates` endpoint that validates a lead, drops spam, emails the lead to the business + an auto-reply to the customer, and returns proper status codes — no database, no auth.

**Architecture:** Express + TypeScript, layered thin controller → service → email, matching `prompts/BACKEND.md`. Validation with Zod. Email via Resend, injected into the service as a dependency so it's testable without sending real mail. Config from env vars.

**Tech Stack:** Node, Express, TypeScript, Helmet, cors, Zod, Resend, dotenv; Vitest + supertest for tests; tsx for dev.

## Global Constraints

- All backend work is in `backend/`. Package manager: npm.
- Endpoint contract (from spec §7), copied verbatim:
  - Request body: `name` (required), `email` (required if no phone), `phone` (required if no email), `city` (required), `serviceType` (`asphalt` | `standing-seam-metal` | `not-sure`), `message` (optional), `company` (honeypot — must be empty).
  - `201 Created` → `{ "ok": true }`
  - `400 Bad Request` → `{ "ok": false, "errors": { field: message } }`
  - `500 Internal Server Error` → `{ "ok": false, "error": "Something went wrong" }`
- Honeypot: if `company` is non-empty, return `201` but send nothing (silent spam drop).
- Never leak internal error detail to the client; log server-side.
- No database, no JWT (ADR-0003). Rate limiting is post-MVP.
- `serviceType` values must exactly match the frontend union in `content/site.ts` (`asphalt`, `standing-seam-metal`) plus `not-sure`.
- Commit after every task.

## File structure

```
backend/
├── package.json
├── tsconfig.json
├── .env.example
├── vitest.config.ts
└── src/
    ├── server.ts                  # boots the http server (listen)
    ├── app.ts                     # builds the express app: middleware + routes + error handler
    ├── config.ts                  # reads + validates env vars
    ├── lib/
    │   ├── estimateSchema.ts      # Zod schema + EstimateInput type
    │   └── email.ts               # Emailer interface + Resend implementation
    ├── services/
    │   └── estimateService.ts     # validate + honeypot + orchestrate email
    ├── controllers/
    │   └── estimatesController.ts # thin: call service, map result -> HTTP
    └── routes/
        └── estimates.ts           # POST /api/estimates
```

---

### Task 1: Scaffold the backend app + health check

**Files:**
- Create: `backend/package.json`, `backend/tsconfig.json`, `backend/vitest.config.ts`, `backend/src/app.ts`, `backend/src/server.ts`

**Interfaces:**
- Produces: `createApp(): express.Express` from `app.ts` (an Express app with `helmet`, `cors`, `express.json()`, and a `GET /health` returning `{ ok: true }`). `server.ts` imports `createApp` and calls `.listen`.

- [ ] **Step 1: Init + install**

```bash
cd backend
npm init -y
npm install express helmet cors zod resend dotenv
npm install -D typescript tsx vitest supertest @types/express @types/cors @types/supertest
```

- [ ] **Step 2: `backend/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: scripts.** In `backend/package.json` add `"type": "module"` and scripts:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "vitest"
}
```

- [ ] **Step 4: `backend/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', globals: true } });
```

- [ ] **Step 5: `backend/src/app.ts`**

```ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));

  return app;
}
```

- [ ] **Step 6: `backend/src/server.ts`**

```ts
import { createApp } from './app.js';

const PORT = Number(process.env.PORT) || 4000;
createApp().listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
```

- [ ] **Step 7: verify + commit**

Run: `npm run dev`, then in another shell `curl -s localhost:4000/health` → `{"ok":true}`.

```bash
git add backend && git commit -m "chore: scaffold express + ts backend with health check"
```

---

### Task 2: Config module (env vars)

**Files:**
- Create: `backend/src/config.ts`, `backend/.env.example`
- Modify: `backend/src/server.ts` (load dotenv first)

**Interfaces:**
- Produces: `config` object `{ port: number; resendApiKey: string; leadToEmail: string; fromEmail: string; corsOrigin: string }`. Reads from `process.env`, validated with Zod so a missing var fails loudly at boot, not at request time.

- [ ] **Step 1: `backend/.env.example`**

```
PORT=4000
CORS_ORIGIN=http://localhost:5173
RESEND_API_KEY=re_xxxxxxxx
LEAD_TO_EMAIL=owner@truealbertaroofing.ca
FROM_EMAIL=estimates@truealbertaroofing.ca
```

- [ ] **Step 2: `backend/src/config.ts`**

```ts
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RESEND_API_KEY: z.string().min(1),
  LEAD_TO_EMAIL: z.string().email(),
  FROM_EMAIL: z.string().email(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment config:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  port: parsed.data.PORT,
  corsOrigin: parsed.data.CORS_ORIGIN,
  resendApiKey: parsed.data.RESEND_API_KEY,
  leadToEmail: parsed.data.LEAD_TO_EMAIL,
  fromEmail: parsed.data.FROM_EMAIL,
};
```

- [ ] **Step 3:** at the very top of `server.ts`, add `import 'dotenv/config';` as the first line so env is loaded before `config.ts` runs. Copy `.env.example` to `.env` and fill real values (Resend key comes later; use a placeholder to boot).

- [ ] **Step 4: commit**

```bash
git add backend && git commit -m "feat: add validated env config"
```

---

### Task 3: Estimate validation schema (TDD)

**Files:**
- Create: `backend/src/lib/estimateSchema.ts`, `backend/src/lib/estimateSchema.test.ts`

**Interfaces:**
- Produces: `estimateSchema` (Zod) and `type EstimateInput = z.infer<typeof estimateSchema>`. Rules: `name` non-empty; `city` non-empty; `serviceType` is one of the three; `email` optional but valid if present; `phone` optional; `message` optional; `company` optional (honeypot); AND at least one of `email`/`phone` present.

- [ ] **Step 1: write the failing tests** — `estimateSchema.test.ts`:

```ts
import { expect, test } from 'vitest';
import { estimateSchema } from './estimateSchema';

const valid = { name: 'Sam', email: 'sam@example.com', city: 'Calgary', serviceType: 'asphalt' };

test('accepts a valid submission', () => {
  expect(estimateSchema.safeParse(valid).success).toBe(true);
});

test('accepts phone instead of email', () => {
  const { email, ...rest } = valid;
  expect(estimateSchema.safeParse({ ...rest, phone: '403-555-0000' }).success).toBe(true);
});

test('rejects when both email and phone are missing', () => {
  const { email, ...rest } = valid;
  expect(estimateSchema.safeParse(rest).success).toBe(false);
});

test('rejects a missing name', () => {
  const { name, ...rest } = valid;
  expect(estimateSchema.safeParse(rest).success).toBe(false);
});

test('rejects an invalid serviceType', () => {
  expect(estimateSchema.safeParse({ ...valid, serviceType: 'gutters' }).success).toBe(false);
});

test('rejects a malformed email', () => {
  expect(estimateSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
});
```

- [ ] **Step 2: run, confirm RED** — `npm test -- --run estimateSchema` → fails (module missing).

- [ ] **Step 3: implement `estimateSchema.ts`** (yours to write). Hints:
  - `z.object({ ... })` with `name: z.string().min(1)`, `city: z.string().min(1)`, `serviceType: z.enum(['asphalt','standing-seam-metal','not-sure'])`, `email: z.string().email().optional()`, `phone: z.string().min(1).optional()`, `message: z.string().optional()`, `company: z.string().optional()`.
  - The "email OR phone" rule can't live on a single field — use `.refine(data => Boolean(data.email || data.phone), { message: 'Provide an email or phone', path: ['email'] })` on the whole object.
  - Export `export type EstimateInput = z.infer<typeof estimateSchema>;`.

- [ ] **Step 4: run GREEN** — `npm test -- --run estimateSchema` → all pass.

- [ ] **Step 5: commit**

```bash
git add backend && git commit -m "feat: add estimate validation schema"
```

---

### Task 4: Email module (Resend, injectable)

**Files:**
- Create: `backend/src/lib/email.ts`

**Interfaces:**
- Produces:
  - `type Emailer = { sendEstimateEmails(input: EstimateInput): Promise<void> }` — the abstraction the service depends on (so tests pass a fake).
  - `createResendEmailer(): Emailer` — the real one, using the Resend SDK + `config`.

- [ ] **Step 1: implement `email.ts`** (mostly boilerplate — full code):

```ts
import { Resend } from 'resend';
import { config } from '../config.js';
import type { EstimateInput } from './estimateSchema.js';

export type Emailer = { sendEstimateEmails(input: EstimateInput): Promise<void> };

export function createResendEmailer(): Emailer {
  const resend = new Resend(config.resendApiKey);
  return {
    async sendEstimateEmails(input) {
      const contact = input.email ?? input.phone;
      // 1) lead to the business
      await resend.emails.send({
        from: config.fromEmail,
        to: config.leadToEmail,
        subject: `New estimate request — ${input.name} (${input.city})`,
        text: [
          `Name: ${input.name}`,
          `Email: ${input.email ?? '—'}`,
          `Phone: ${input.phone ?? '—'}`,
          `City: ${input.city}`,
          `Service: ${input.serviceType}`,
          `Message: ${input.message ?? '—'}`,
        ].join('\n'),
      });
      // 2) auto-reply to the customer (only if we have their email)
      if (input.email) {
        await resend.emails.send({
          from: config.fromEmail,
          to: input.email,
          subject: 'We got your request — True Alberta Roofing',
          text: `Hi ${input.name}, thanks for reaching out. We'll be in touch shortly about your ${input.city} roof. — True Alberta Roofing`,
        });
      }
      void contact;
    },
  };
}
```

- [ ] **Step 2: commit** (no test here — it's a thin SDK wrapper; the service test covers the logic that *uses* it)

```bash
git add backend && git commit -m "feat: add resend email module"
```

---

### Task 5: Estimate service (TDD, the heart of it)

**Files:**
- Create: `backend/src/services/estimateService.ts`, `backend/src/services/estimateService.test.ts`

**Interfaces:**
- Consumes: `estimateSchema` (Task 3), `Emailer` (Task 4).
- Produces: `createEstimateService(emailer: Emailer)` returning `{ submit(raw: unknown): Promise<SubmitResult> }` where
  `type SubmitResult = { ok: true } | { ok: false; errors: Record<string, string> }`.
  Logic: validate `raw`; if invalid → `{ ok: false, errors }`. If `company` (honeypot) is non-empty → `{ ok: true }` WITHOUT emailing. Otherwise call `emailer.sendEstimateEmails` and return `{ ok: true }`.

- [ ] **Step 1: write the failing tests** — `estimateService.test.ts`:

```ts
import { expect, test, vi } from 'vitest';
import { createEstimateService } from './estimateService';

const good = { name: 'Sam', email: 'sam@example.com', city: 'Calgary', serviceType: 'asphalt' };
const fakeEmailer = () => ({ sendEstimateEmails: vi.fn().mockResolvedValue(undefined) });

test('valid submission emails and returns ok', async () => {
  const emailer = fakeEmailer();
  const result = await createEstimateService(emailer).submit(good);
  expect(result).toEqual({ ok: true });
  expect(emailer.sendEstimateEmails).toHaveBeenCalledOnce();
});

test('invalid submission returns errors and does NOT email', async () => {
  const emailer = fakeEmailer();
  const result = await createEstimateService(emailer).submit({ name: '', city: '', serviceType: 'x' });
  expect(result.ok).toBe(false);
  expect(emailer.sendEstimateEmails).not.toHaveBeenCalled();
});

test('honeypot-filled submission is silently accepted without emailing', async () => {
  const emailer = fakeEmailer();
  const result = await createEstimateService(emailer).submit({ ...good, company: 'spam-bot' });
  expect(result).toEqual({ ok: true });
  expect(emailer.sendEstimateEmails).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: run, confirm RED** — `npm test -- --run estimateService` → fails.

- [ ] **Step 3: implement `estimateService.ts`** (yours). Hints:
  - `const parsed = estimateSchema.safeParse(raw);` if `!parsed.success`, build an errors map from `parsed.error.flatten().fieldErrors` (each field → first message) and return `{ ok: false, errors }`.
  - If `parsed.data.company` is truthy → `return { ok: true }` (no email).
  - Else `await emailer.sendEstimateEmails(parsed.data); return { ok: true };`.
  - Notice the pattern: the emailer is *passed in*, so the test hands it a `vi.fn()` fake and never touches Resend. That's dependency injection — the reason this logic is testable.

- [ ] **Step 4: run GREEN**, then commit

```bash
git add backend && git commit -m "feat: add estimate service (validation, honeypot, email)"
```

---

### Task 6: Controller, route, wiring + integration test

**Files:**
- Create: `backend/src/controllers/estimatesController.ts`, `backend/src/routes/estimates.ts`, `backend/src/routes/estimates.test.ts`
- Modify: `backend/src/app.ts` (mount route + error handler)

**Interfaces:**
- Consumes: `createEstimateService`, `createResendEmailer`.
- Produces: `POST /api/estimates` mapping `{ ok: true }` → 201, `{ ok: false }` → 400, thrown errors → 500 via an error-handling middleware.

- [ ] **Step 1: write the failing integration test** — `estimates.test.ts` (uses supertest against the app; inject a fake emailer so no real mail):

```ts
import request from 'supertest';
import { expect, test, vi } from 'vitest';
import { createApp } from '../app';

const emailer = { sendEstimateEmails: vi.fn().mockResolvedValue(undefined) };
const app = createApp({ emailer });
const good = { name: 'Sam', email: 'sam@example.com', city: 'Calgary', serviceType: 'asphalt' };

test('POST /api/estimates returns 201 for a valid lead', async () => {
  const res = await request(app).post('/api/estimates').send(good);
  expect(res.status).toBe(201);
  expect(res.body).toEqual({ ok: true });
});

test('POST /api/estimates returns 400 for an invalid lead', async () => {
  const res = await request(app).post('/api/estimates').send({ name: '' });
  expect(res.status).toBe(400);
  expect(res.body.ok).toBe(false);
});
```

- [ ] **Step 2: run, confirm RED.**

- [ ] **Step 3: implement.** Hints:
  - Make `createApp` accept an optional `{ emailer }` so tests inject a fake and production uses `createResendEmailer()` as the default: `export function createApp({ emailer = createResendEmailer() } = {})`.
  - `estimatesController.ts`: `submitEstimate` is a factory taking the service — `(service) => async (req, res, next) => { try { const r = await service.submit(req.body); res.status(r.ok ? 201 : 400).json(r); } catch (e) { next(e); } }`.
  - `routes/estimates.ts`: an `express.Router()` with `router.post('/estimates', submitEstimate(service))`; export a factory taking the service (or the emailer).
  - In `app.ts`: `app.use('/api', createEstimatesRouter(createEstimateService(emailer)))`, then a final error-handler middleware `(err, _req, res, _next) => { console.error(err); res.status(500).json({ ok: false, error: 'Something went wrong' }); }`.

- [ ] **Step 4: run GREEN.**

- [ ] **Step 5: manual smoke** — `npm run dev`, then:

```bash
curl -s -X POST localhost:4000/api/estimates -H 'Content-Type: application/json' \
  -d '{"name":"Sam","email":"sam@example.com","city":"Calgary","serviceType":"asphalt"}'
```

Expect `{"ok":true}` (with a real Resend key set, an email actually sends; with a placeholder key the send throws → 500, which is fine to confirm the wiring — real key comes when the client's domain is set up).

- [ ] **Step 6: commit**

```bash
git add backend && git commit -m "feat: add POST /api/estimates endpoint"
```

---

## Self-Review

- **Spec coverage:** endpoint contract §7 (request shape, 201/400/500, honeypot, two emails, no leak) → Tasks 3–6. No-DB/no-auth (ADR-0003) honored. Config/env → Task 2.
- **Placeholder scan:** `.env` values are real secrets the client provides (Resend key, addresses), flagged, not plan gaps.
- **Type consistency:** `EstimateInput` from Task 3 flows through `Emailer` (4), service (5), controller (6). `serviceType` enum matches the frontend union plus `not-sure`. `createApp({ emailer })` signature is consistent between Task 1 (base) and Task 6 (extended) — Task 6 updates it.

## Deferred to later plans

Wiring the frontend form to this endpoint (loading/error/success states), Sanity, and deploy.
