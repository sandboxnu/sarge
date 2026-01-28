import { z } from 'zod';

export const TagSchema = z.object({
    id: z.string(),
    orgId: z.string(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    colorHexCode: z.string(),
});

export type TagDTO = z.infer<typeof TagSchema>;
