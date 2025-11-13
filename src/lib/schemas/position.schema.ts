import { z } from 'zod';

export const createPositionSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title must be less than 200 characters')
        .trim(),
});

export const updatePositionSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title must be less than 200 characters')
        .trim()
        .optional(),
});

export const getPositionSchema = z.object({
    id: z.cuid('Invalid position ID'),
});

export const deletePositionSchema = z.object({
    id: z.cuid('Invalid position ID'),
});

export const getPositionsByOrgSchema = z.object({
    orgId: z.cuid('Invalid organization ID'),
});

export const positionSchema = z.object({
    id: z.cuid(),
    title: z.string(),
    orgId: z.cuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdById: z.cuid(),
});

export type PositionDTO = z.infer<typeof positionSchema>;
export type CreatePositionDTO = z.infer<typeof createPositionSchema>;
export type UpdatePositionDTO = z.infer<typeof updatePositionSchema>;
export type GetPositionDTO = z.infer<typeof getPositionSchema>;
export type DeletePositionDTO = z.infer<typeof deletePositionSchema>;
export type GetPositionsByOrgDTO = z.infer<typeof getPositionsByOrgSchema>;
