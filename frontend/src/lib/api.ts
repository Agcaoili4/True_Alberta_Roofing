// The single point of contact with the backend. Components import from here,
// never call fetch directly — so the API surface lives in one place.

export type EstimatePayload = {
  name: string;
  email?: string;
  phone?: string;
  city: string;
  serviceType: 'asphalt' | 'standing-seam-metal' | 'not-sure';
  message?: string;
  company?: string; // honeypot — hidden field, stays empty for real people
};

export type EstimateResult =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; error?: string };

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export async function submitEstimate(payload: EstimatePayload): Promise<EstimateResult> {
  try {
    const res = await fetch(`${API_URL}/api/estimates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    // The backend always returns a JSON body with `ok`, on 201/400/500 alike.
    return (await res.json()) as EstimateResult;
  } catch {
    // fetch only throws for network-level failures (server down, offline).
    return { ok: false, error: 'Network error — please try again, or call us.' };
  }
}
