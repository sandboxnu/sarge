import { SnapshotType } from '@/generated/prisma';
import { z } from 'zod';

export const SnapshotSchema = z.object({
    id: z.string(),
    taskId: z.string(),
    type: z.enum(SnapshotType),
    content: z.string().nullable(),
    createdAt: z.date(),
});

export const CreateSnapshotForCandidateSchema = z.object({
    type: z.enum(SnapshotType),
    content: z.string().optional(),
});

export const CreateDisconnectSnapshotSchema = z.object({
    candidateEmail: z.email(),
});

export type SnapshotDTO = z.infer<typeof SnapshotSchema>;
export type CreateSnapshotForCandidateDTO = z.infer<typeof CreateSnapshotForCandidateSchema>;
export type CreateDisconnectSnapshotDTO = z.infer<typeof CreateDisconnectSnapshotSchema>;
