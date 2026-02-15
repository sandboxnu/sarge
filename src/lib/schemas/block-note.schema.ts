import { z } from 'zod';

export const blockNoteBlockSchema = z.object({
    id: z.string(),
    type: z.string(),
    props: z.record(z.string(), z.any()).optional(),
    content: z.array(z.any()).optional(),
    children: z.array(z.any()).optional(),
});

export const blockNoteContentSchema = z.array(blockNoteBlockSchema);

export type BlockNoteBlockDTO = z.infer<typeof blockNoteBlockSchema>;
