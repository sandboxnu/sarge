import { z } from 'zod';

export const createCandidateSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    email: z
        .email('Invalid email format')
        .toLowerCase()
        .trim()
        .max(255, 'Email must be less than 255 characters'),
    orgId: z.cuid('Invalid orgId'),
});

export const CandidateSchema = z.object({
    id: z.cuid(),
    name: createCandidateSchema.shape.name,
    email: createCandidateSchema.shape.email,
    orgId: createCandidateSchema.shape.orgId,
});

export type CandidateDTO = z.infer<typeof CandidateSchema>;

export type CreateCandidateDTO = z.infer<typeof createCandidateSchema>;
