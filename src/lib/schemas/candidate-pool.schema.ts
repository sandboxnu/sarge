import { AssessmentStatus, DecisionStatus } from '@/generated/prisma';
import { z } from 'zod';

// for adding a single candidate by ID (candidate must already exist)
export const addCandidateByIdSchema = z.object({
    candidateId: z.string().cuid('Invalid candidate ID'),
});

// for adding a single candidate with data (create if not exists)
export const addCandidateWithDataSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    email: z
        .email('Invalid email format')
        .toLowerCase()
        .trim()
        .max(255, 'Email must be less than 255 characters'),
    linkedinUrl: z.union([z.literal('-'), z.string().url('Invalid LinkedIn URL')]).optional(),
    githubUrl: z.union([z.literal('-'), z.string().url('Invalid GitHub URL')]).optional(),
    major: z.union([z.literal('-'), z.string()]).optional(),
    graduationDate: z.union([z.literal('-'), z.string()]).optional(),
    resumeUrl: z.union([z.literal('-'), z.string().url('Invalid resume URL')]).optional(),
});

// for batch adding candidates (CSV upload flow)
export const batchAddCandidatesSchema = z.object({
    candidates: z
        .array(addCandidateWithDataSchema)
        .min(1, 'At least one candidate is required')
        .max(1000, 'Cannot add more than 1000 candidates at once'),
});

export const updateAssessmentStatusSchema = z.object({
    assessmentStatus: z.enum(AssessmentStatus),
});

export const updateDecisionStatusSchema = z.object({
    decisionStatus: z.enum(DecisionStatus),
});

export const CandidatePoolSchema = z.object({
    id: z.cuid(),
    candidateId: z.cuid(),
    positionId: z.cuid(),
    assessmentStatus: z.enum(AssessmentStatus),
    decisionStatus: z.enum(DecisionStatus),
    decidedBy: z.cuid().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type CandidatePoolDTO = z.infer<typeof CandidatePoolSchema>;
export type AddCandidateByIdDTO = z.infer<typeof addCandidateByIdSchema>;
export type AddCandidateWithDataDTO = z.infer<typeof addCandidateWithDataSchema>;
export type BatchAddCandidatesDTO = z.infer<typeof batchAddCandidatesSchema>;
export type UpdateAssessmentStatusDTO = z.infer<typeof updateAssessmentStatusSchema>;
export type UpdateDecisionStatusDTO = z.infer<typeof updateDecisionStatusSchema>;
