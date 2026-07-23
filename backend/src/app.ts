import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

// Builds the Express app: security + parsing middleware, then routes.
// Kept as a factory so tests can create a fresh app (and later inject a fake emailer).
export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  return app;
}
