# Frontend Estimate Form Wiring Implementation Plan

> **Mentor-mode note:** developer writes the form component; I write the API client and review. Config full-code; the component gives interface + a test to pass + hints.

**Goal:** The Contact page's Free Estimate form submits to `POST /api/estimates`, shows loading / success / error states, and renders the backend's field errors inline.

**Architecture:** A thin `lib/api.ts` client is the *only* thing that talks to the backend (frontend never calls the API from components directly — matches `FRONTEND.md`). `EstimateForm` holds controlled inputs + a status state machine and calls the client on submit. Wired into the `Contact` page.

**Tech Stack:** React state (`useState`), `fetch`, Vite env (`import.meta.env.VITE_API_URL`), Vitest + Testing Library (mock the api client).

## Global Constraints

- API base URL from `import.meta.env.VITE_API_URL`, default `http://localhost:4000`.
- Payload matches the backend contract exactly: `name`, `email?`, `phone?`, `city`, `serviceType` (`asphalt`|`standing-seam-metal`|`not-sure`), `message?`, `company` (honeypot — hidden, must stay empty for humans).
- Backend responses: `{ ok: true }` / `{ ok: false, errors }` / `{ ok: false, error }`.
- Accessibility: every input has a `<label>`; field errors linked via `aria-describedby`; the submit button disables while submitting.
- Commit after each task.

## File structure

```
frontend/
├── .env / .env.example      # VITE_API_URL
└── src/
    ├── lib/api.ts           # submitEstimate() — the only caller of the backend
    └── components/form/
        ├── EstimateForm.tsx
        └── EstimateForm.test.tsx
    └── pages/Contact.tsx     # mounts <EstimateForm />
```

---

### Task 1: API client + env (I'll build this)

**Files:** `frontend/src/lib/api.ts`, `frontend/.env`, `frontend/.env.example`

**Interfaces:**
- Produces `submitEstimate(payload: EstimatePayload): Promise<EstimateResult>` where
  `EstimatePayload = { name: string; email?: string; phone?: string; city: string; serviceType: 'asphalt'|'standing-seam-metal'|'not-sure'; message?: string; company?: string }`
  and `EstimateResult = { ok: true } | { ok: false; errors?: Record<string,string>; error?: string }`.

- [ ] `.env.example` + `.env`: `VITE_API_URL=http://localhost:4000`
- [ ] `api.ts`: POST JSON to `${VITE_API_URL}/api/estimates`, return the parsed body; on a thrown fetch (network down) return `{ ok: false, error: 'Network error — please try again or call us.' }`.
- [ ] Commit: `feat: add estimate api client`

---

### Task 2: EstimateForm component (developer builds, TDD-ish)

**Files:** `frontend/src/components/form/EstimateForm.tsx`, `EstimateForm.test.tsx`

**Interfaces:**
- Consumes `submitEstimate` (Task 1), `Button` (ui).
- `EstimateForm` renders labeled inputs for name / email / phone / city / serviceType (select) / message, a **hidden honeypot** `company`, and a submit button. It owns a status: `'idle' | 'submitting' | 'success' | 'error'`.

- [ ] **Step 1: the test** — `EstimateForm.test.tsx` (mock the client so no real network):

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi, beforeEach } from 'vitest';
import { EstimateForm } from './EstimateForm';
import * as api from '../../lib/api';

beforeEach(() => vi.restoreAllMocks());

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText(/name/i), 'Sam');
  await userEvent.type(screen.getByLabelText(/email/i), 'sam@example.com');
  await userEvent.type(screen.getByLabelText(/city/i), 'Calgary');
  await userEvent.click(screen.getByRole('button', { name: /free estimate|send|submit/i }));
}

test('shows a success message after a successful submit', async () => {
  vi.spyOn(api, 'submitEstimate').mockResolvedValue({ ok: true });
  render(<EstimateForm />);
  await fillAndSubmit();
  await waitFor(() => expect(screen.getByText(/thank|got your request|in touch/i)).toBeInTheDocument());
});

test('shows an error message when the submit fails', async () => {
  vi.spyOn(api, 'submitEstimate').mockResolvedValue({ ok: false, error: 'Something went wrong' });
  render(<EstimateForm />);
  await fillAndSubmit();
  await waitFor(() => expect(screen.getByText(/something went wrong|try again/i)).toBeInTheDocument());
});
```

- [ ] **Step 2: run red.**
- [ ] **Step 3: build `EstimateForm`.** Hints:
  - Hold field values in state: one object `const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', serviceType: 'not-sure', message: '', company: '' })`, and update with a shared `onChange` that does `setForm(f => ({ ...f, [e.target.name]: e.target.value }))` (so each input needs a matching `name`).
  - Hold `const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle')`, plus `errors` (field map) and a `generalError` string.
  - `onSubmit`: `e.preventDefault()`, `setStatus('submitting')`, `const res = await submitEstimate(form)`. If `res.ok` → `setStatus('success')`. Else → set `errors`/`generalError` from `res`, `setStatus('error')`.
  - When `status === 'success'`, render a thank-you block instead of the form (early return).
  - Disable the submit `Button` when `status === 'submitting'` and change its label to "Sending…".
  - **Honeypot:** an `<input name="company">` wrapped in a visually-hidden container (`className="hidden"` or an off-screen style), `tabIndex={-1}`, `autoComplete="off"`. Humans never see or fill it; bots do → the backend silently drops them.
  - Each field: a real `<label htmlFor>`; show `errors[field]` beneath it, linked with `aria-describedby`.
- [ ] **Step 4: run green.** Commit: `feat: add estimate form with submit states`

---

### Task 3: Mount in Contact + end-to-end check (I'll help)

**Files:** modify `frontend/src/pages/Contact.tsx`

- [ ] Replace the stub with an intro + `<EstimateForm />` (plus phone/email/service-area from `site`).
- [ ] **Manual E2E:** run the backend (`cd backend && npm run dev`) and the frontend (`cd frontend && npm run dev`), submit the form. An invalid submit shows inline errors (400); a valid one shows the thank-you (with a real Resend key it emails; with the placeholder it hits the error state, which still proves the wiring).
- [ ] Commit: `feat: wire estimate form into contact page`

## Self-Review

- Contract match: payload fields + `serviceType` union + honeypot align with backend spec §7 and the `estimateSchema`.
- Placeholder scan: none (VITE_API_URL is a real config with a sane default).
- Type consistency: `EstimatePayload.serviceType` union matches the backend enum and the frontend `site.services[].key` (plus `not-sure`).

## Deferred

Restricting backend CORS to the real frontend origin (prod), and deploy — later plan.
