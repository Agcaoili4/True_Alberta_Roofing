import { estimateSchema } from "../lib/estimateSchema.js";
import type { Emailer } from "../lib/email.js";

export type SubmitResult = { ok: true } | { ok: false; errors: Record<string, string> };
export function createEstimateService(emailer: Emailer) { return {
    async submit(raw: unknown): Promise<SubmitResult> {
        const parsed = estimateSchema.safeParse(raw);

        // Added guardrail if parsed is not sucdcessful
        if(!parsed.success){
            const fieldErrors = parsed.error.flatten().fieldErrors;
            const errors: Record<string, string> = {};
            for (const [field, msgs] of Object.entries(fieldErrors)) {
                if (msgs?.length) errors[field] = msgs[0];
            }
            return { ok: false, errors };
        }
        // Passed the guard nad when parsed.success becomes true
        if (parsed.data.company) return { ok: true };
        await emailer.sendEstimateEmails(parsed.data); 
        return { ok: true };
     } }; 

}