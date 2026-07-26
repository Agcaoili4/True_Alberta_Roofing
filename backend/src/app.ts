import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createResendEmailer, type Emailer } from './lib/email.js';
import { createEstimateService } from './services/estimateService.js';
import { createEstimatesRouter } from './routes/estimates.js';

// Factory so tests can inject a fake emailer; production uses the real Resend one.
export function createApp({ emailer = createResendEmailer() }: { emailer?: Emailer } = {}) {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  const service = createEstimateService(emailer);
  app.use('/api', createEstimatesRouter(service));

  // Central error handler — log the detail, return a generic message (never leak internals).
  const errorHandler: express.ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Something went wrong' });
  };
  app.use(errorHandler);

  return app;
}
