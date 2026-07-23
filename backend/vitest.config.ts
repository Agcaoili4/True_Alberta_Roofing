import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // Placeholder env so modules that import config.ts don't exit during tests.
    env: {
      RESEND_API_KEY: 'test',
      LEAD_TO_EMAIL: 'test@example.com',
      FROM_EMAIL: 'test@example.com',
    },
  },
});
