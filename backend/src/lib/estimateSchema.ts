import { z } from 'zod';

// Schema for data
export const estimateSchema = z.object({
    name: z.string().min(1),
    city: z.string().min(1),
    serviceType: z.enum(['asphalt', 'standing-seam-metal', 'others']),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional(),
    message: z.string().optional(),
    company: z.string().optional()
})

// Refine to add additional parameter if there's no email or phone
.refine((data) => Boolean(data.email || data.phone), {
    message: 'Provide an email or Phone',
    path: ['email'],
});


// Schema 
export type EstimateInput = z.infer<typeof estimateSchema>