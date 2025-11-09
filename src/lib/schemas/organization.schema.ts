import { z } from 'zod';

export const createOrganizationSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
});

export const getOrganizationSchema = z.object({
    id: z.cuid('Invalid organization ID'),
});

export const updateOrganizationSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    imageUrl: z.url(),
});

export type CreateOrganizationDTO = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationDTO = z.infer<typeof updateOrganizationSchema>;
export type GetOrganizationDTO = z.infer<typeof getOrganizationSchema>;
