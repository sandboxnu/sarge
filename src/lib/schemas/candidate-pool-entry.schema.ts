import { Status } from '@/generated/prisma';
import { z } from 'zod';

export const createCandidatePoolEntrySchema = z.object({
    candidateId: z.uuid(),
    positionId: z.uuid(),
    tags: z.array(z.string()).optional(),
});

export const CandidatePoolEntrySchema = z.object({
    id: z.uuid(),
    candidateId: createCandidatePoolEntrySchema.shape.candidateId,
    positionId: createCandidatePoolEntrySchema.shape.positionId,
    status: Status,
});

export type CandidatePoolEntryDTO = z.infer<typeof CandidatePoolEntrySchema>;

export type CreateCandidatePoolEntryDTO = z.infer<typeof createCandidatePoolEntrySchema>;
