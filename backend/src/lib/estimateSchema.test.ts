import { expect, test } from 'vitest';
import { estimateSchema } from './estimateSchema.js';
import { email } from 'zod';

// Object for containing entities
const valid = { name: 'Sam', email: 'sam@example.ca', city: 'Calgary', serviceType: 'asphalt' };

// Test block
test('accepts a valid submission', () => {
    expect(estimateSchema.safeParse(valid).success).toBe(true);
});

test('accepts phone instead of email', () => {
    const {email, ...rest} = valid;
    expect(estimateSchema.safeParse({ ...rest, phone: '403-555-0000'}).success).toBe(true);
});

test('accepts a valid email', () => {
    const { ...rest} = valid;
    expect(estimateSchema.safeParse({ ...rest, email:'aj@example.ca'}).success).toBe(true);
});
test('rejects when both email and phone are missing', () => {
    const {email, ...rest} = valid;
    expect(estimateSchema.safeParse(rest).success).toBe(false);
});

test('rejects a missing name', () => {
    const  {name, ...rest} =valid;
    expect(estimateSchema.safeParse(rest).success).toBe(false);
});

test('reject if it is an invalid service type', () => {
    expect(estimateSchema.safeParse({ ...valid, serviceType:'gutters'}).success).toBe(false);
});

test('rejects incorrect or malformed email', () => {
    expect(estimateSchema.safeParse({ ...valid, email:'example-but-no-email'}).success).toBe(false);
});

test('accepts "not-sure" as a service type', () => {
    expect(estimateSchema.safeParse({ ...valid, serviceType:'not-sure'}).success).toBe(true)
});