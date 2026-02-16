import { z } from 'zod';

export const TagSchema = z.object({
    id: z.string(),
    orgId: z.string(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    colorHexCode: z.string(),
});

export const createTagSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Tag name is required')
        .max(20, 'Tag name must be 20 characters or less'),
    colorHexCode: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color')
        .default('#e5e5e7'),
});

export type TagDTO = z.infer<typeof TagSchema>;
export type CreateTagInput = z.input<typeof createTagSchema>;
