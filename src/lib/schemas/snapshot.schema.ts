import { SnapshotType } from '@/generated/prisma';
import { z } from 'zod';

export const SnapshotSchema = z.object({
    id: z.string(),
    taskId: z.string(),
    type: z.enum(SnapshotType),
    content: z.string().nullable(),
    createdAt: z.date(),
});

export const CreateSnapshotForCandidateSchema = z
    .object({
        type: z.enum(SnapshotType),
        content: z.string().optional(),
    })
    .superRefine((value, ctx) => {
        if (value.type === SnapshotType.CONTENT && !value.content) {
            ctx.addIssue({
                code: 'custom',
                message: 'CONTENT snapshots must include content',
                path: ['content'],
            });
        }
        if (value.type !== SnapshotType.CONTENT && value.content) {
            ctx.addIssue({
                code: 'custom',
                message: 'Only CONTENT snapshots may include content',
                path: ['content'],
            });
        }
    });

export type SnapshotDTO = z.infer<typeof SnapshotSchema>;
export type CreateSnapshotForCandidateDTO = z.infer<typeof CreateSnapshotForCandidateSchema>;
