import { AssessmentStatus, DecisionStatus } from '@/generated/prisma';
import { z } from 'zod';

// for adding a single application by candidate ID (candidate must already exist)
export const addApplicationByCandidateIdSchema = z.object({
    candidateId: z.cuid('Invalid candidate ID'),
});

// for adding a single application with candidate data (create candidate if not exists)
export const addApplicationWithCandidateDataSchema = z.object({
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
    linkedinUrl: z.union([z.literal('-'), z.string()]).optional(),
    githubUrl: z.union([z.literal('-'), z.string()]).optional(),
    major: z.union([z.literal('-'), z.string()]).optional(),
    graduationDate: z.union([z.literal('-'), z.string()]).optional(),
    resumeUrl: z.union([z.literal('-'), z.string()]).optional(),
});

// for batch adding applications (CSV upload flow)
export const batchAddApplicationsSchema = z.object({
    applications: z
        .array(addApplicationWithCandidateDataSchema)
        .min(1, 'At least one application is required')
        .max(1000, 'Cannot add more than 1000 applications at once'),
});

export const updateAssessmentStatusSchema = z.object({
    assessmentStatus: z.enum(AssessmentStatus),
});

export const updateDecisionStatusSchema = z.object({
    decisionStatus: z.enum(DecisionStatus),
});

export const ApplicationSchema = z.object({
    id: z.cuid(),
    candidateId: z.cuid(),
    positionId: z.cuid(),
    assessmentStatus: z.enum(AssessmentStatus),
    decisionStatus: z.enum(DecisionStatus),
    decidedBy: z.cuid().nullable(),
    decidedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type ApplicationDTO = z.infer<typeof ApplicationSchema>;
export type AddApplicationByCandidateIdDTO = z.infer<typeof addApplicationByCandidateIdSchema>;
export type AddApplicationWithCandidateDataDTO = z.infer<
    typeof addApplicationWithCandidateDataSchema
>;
export type BatchAddApplicationsDTO = z.infer<typeof batchAddApplicationsSchema>;
export type UpdateAssessmentStatusDTO = z.infer<typeof updateAssessmentStatusSchema>;
export type UpdateDecisionStatusDTO = z.infer<typeof updateDecisionStatusSchema>;
