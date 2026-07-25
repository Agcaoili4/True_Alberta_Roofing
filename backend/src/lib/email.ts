import { Resend } from 'resend';
import { config } from '../config.js';
import type { EstimateInput } from './estimateSchema.js';

// The abstraction the service depends on. Tests pass a fake that implements this,
// so the service logic can be verified without sending real mail (dependency injection).
export type Emailer = {
  sendEstimateEmails(input: EstimateInput): Promise<void>;
};

// The real implementation, backed by Resend. Resend returns { data, error }
// instead of throwing, so we check error and throw ourselves — that turns a
// failed send into a clean 500 upstream.
export function createResendEmailer(): Emailer {
  const resend = new Resend(config.resendApiKey);

  return {
    async sendEstimateEmails(input) {
      // 1) The lead, to the business.
      const lead = await resend.emails.send({
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
      if (lead.error) throw new Error(`Failed to send lead email: ${lead.error.message}`);

      // 2) The auto-reply to the customer — only if they gave an email.
      if (input.email) {
        const reply = await resend.emails.send({
          from: config.fromEmail,
          to: input.email,
          subject: 'We got your request — True Alberta Roofing',
          text:
            `Hi ${input.name}, thanks for reaching out. We'll be in touch shortly ` +
            `about your ${input.city} roof.\n\n— True Alberta Roofing`,
        });
        if (reply.error) throw new Error(`Failed to send auto-reply: ${reply.error.message}`);
      }
    },
  };
}
