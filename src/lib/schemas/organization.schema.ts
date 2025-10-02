import { z } from 'zod';

export class ValidationError extends Error {
    constructor() {
        super(`The request structure is invalid. The server can't even parse the data.`);
    }
}

export const createOrganizationSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    createdById: z.string().uuid('createdById must be a valid UUID'),
});

export type CreateOrganizationDTO = z.infer<typeof createOrganizationSchema>;
