import { z } from 'zod';

export class OrganizationNotFoundError extends Error {
    constructor() {
        super('Organization Not Found');
    }
}

export const createOrganizationSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    createdById: z.uuid('createdById must be a valid UUID'),
});

export const getOrganizationSchema = z.object({
    id: z.uuid('ID is 36 characters'),
});

export const updateOrganizationSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
});

export type CreateOrganizationDTO = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationDTO = z.infer<typeof updateOrganizationSchema>;
export type GetOrganizationDTO = z.infer<typeof getOrganizationSchema>;
