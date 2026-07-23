import { z } from 'zod';

// Validate env once, at boot. A missing/blank required var fails loudly here
// instead of surfacing as a confusing error on the first request.
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
