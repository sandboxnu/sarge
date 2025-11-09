import { z } from 'zod';

export const PositionSchema = z.object({
    title: z.string(),
    orgId: z.cuid(),
    tags: z.array(z.string()).optional(),
});

export const CreatePositionSchema = z.object({
    title: PositionSchema.shape.title,
});

export const UpdatePositionSchema = CreatePositionSchema.partial();

export type Position = z.infer<typeof PositionSchema>;
export type CreatePositionData = z.infer<typeof CreatePositionSchema>;
