import { expect, test, vi } from 'vitest';
import { createEstimateService } from './estimateService.js';

// Object for containing entities
const valid = { name: 'Sam', email: 'sam@example.ca', city: 'Calgary', serviceType: 'asphalt' };

// Added a function for fake emails
const fakeEmailer = () => ({ sendEstimateEmails: vi.fn().mockResolvedValue(undefined) });
test('valid submission emails and returns ok', async () => {
    const emailer = fakeEmailer();
    const result = await createEstimateService(emailer).submit(valid);
    expect(result).toEqual( {ok: true });
    expect(emailer.sendEstimateEmails).toHaveBeenCalledOnce();
});

test('invalid submission returns errors and does NOT email', async () => {
    const emailer = fakeEmailer();
    const result = await createEstimateService(emailer).submit({ name:'', city:'', serviceType:'x'});
    expect(result.ok).toBe(false);
    expect(emailer.sendEstimateEmails).not.toHaveBeenCalled();
});

test('honeypot-filled submission is silently accepted without emailing', async () =>{
    const emailer = fakeEmailer();
    const result = await createEstimateService(emailer).submit( { ...valid, company: 'spam-bot' });
    expect(result).toEqual({ ok:true });
    expect(emailer.sendEstimateEmails).not.toHaveBeenCalled();
})