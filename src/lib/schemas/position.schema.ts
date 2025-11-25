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
    id: z.string('Invalid position ID'),
});

export const deletePositionSchema = z.object({
    id: z.string('Invalid position ID'),
});

export const getPositionsByOrgSchema = z.object({
    orgId: z.string('Invalid organization ID'),
});

export const positionSchema = z.object({
    id: z.string(),
    title: z.string(),
    orgId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdById: z.string(),
});

export type Position = z.infer<typeof positionSchema>;
export type CreatePositionDTO = z.infer<typeof createPositionSchema>;
export type UpdatePositionDTO = z.infer<typeof updatePositionSchema>;
export type GetPositionDTO = z.infer<typeof getPositionSchema>;
export type DeletePositionDTO = z.infer<typeof deletePositionSchema>;
export type GetPositionsByOrgDTO = z.infer<typeof getPositionsByOrgSchema>;
