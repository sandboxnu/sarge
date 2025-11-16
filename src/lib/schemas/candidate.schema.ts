import { z } from 'zod';

export const createCandidateSchema = z.object({
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
    orgId: z.cuid('Invalid orgId'),
    linkedinUrl: z.url('Invalid LinkedIn URL').optional().nullable(),
    githubUrl: z.url('Invalid GitHub URL').optional().nullable(),
    major: z.string().optional().nullable(),
    graduationDate: z.string().optional().nullable(),
    resumeUrl: z.url('Invalid resume URL').optional().nullable(),
});

export const updateCandidateSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim()
        .optional(),
    email: z
        .email('Invalid email format')
        .toLowerCase()
        .trim()
        .max(255, 'Email must be less than 255 characters')
        .optional(),
    linkedinUrl: z.url('Invalid LinkedIn URL').nullable().optional(),
    githubUrl: z.url('Invalid GitHub URL').nullable().optional(),
    major: z.string().nullable().optional(),
    graduationDate: z.string().nullable().optional(),
    resumeUrl: z.url('Invalid resume URL').nullable().optional(),
});

export const CandidateSchema = z.object({
    id: z.string(),
    name: createCandidateSchema.shape.name,
    email: createCandidateSchema.shape.email,
    orgId: createCandidateSchema.shape.orgId,
    linkedinUrl: createCandidateSchema.shape.linkedinUrl,
    githubUrl: createCandidateSchema.shape.githubUrl,
    major: createCandidateSchema.shape.major,
    graduationDate: createCandidateSchema.shape.graduationDate,
    resumeUrl: createCandidateSchema.shape.resumeUrl,
    createdAt: z.date(),
});

export type CandidateDTO = z.infer<typeof CandidateSchema>;

export type CreateCandidateDTO = z.infer<typeof createCandidateSchema>;

export type UpdateCandidateDTO = z.infer<typeof updateCandidateSchema>;
