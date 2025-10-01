import { z } from 'zod';

export class PositionNotFoundError extends Error {
    constructor() {
        super('Position Not Found');
    }
}

export const PositionSchema = z.object({
    title: z.uuid(),
    orgId: z.uuid(),
    createdBy: z.uuid(),
    tags: z.array(z.string()).optional(),
});

export const CreatePositionSchema = z.object({
    title: PositionSchema.shape.title,
    orgId: PositionSchema.shape.orgId,
    createdBy: PositionSchema.shape.createdBy,
});

export type Position = z.infer<typeof PositionSchema>;
export type CreatePositionData = z.infer<typeof CreatePositionSchema>;
