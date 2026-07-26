import request from 'supertest';
import { expect, test, vi } from 'vitest';
import { createApp } from '../app.js';

// Inject a fake emailer so the endpoint test never sends real mail.
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
