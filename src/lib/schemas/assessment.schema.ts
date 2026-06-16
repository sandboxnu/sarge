import { z } from 'zod';

export const getAssessmentSchema = z.object({
    id: z.cuid(),
});

export const assessmentSchema = z.object({
    id: z.string(),
    applicationId: z.string(),
    assessmentTemplateId: z.string(),
    deadline: z.date().nullable(),
    assignedAt: z.date(),
    submittedAt: z.date().nullable(),
});

export const createAssessmentSchema = assessmentSchema.omit({ id: true });

export const updateAssessmentSchema = assessmentSchema.partial().extend({
    id: z.string(),
});

export const deleteAssessmentSchema = z.object({
    id: z.string(),
});

export const sendAssessmentInvitationSchema = z.object({
    positionId: z.string(),
    deadline: z.coerce.date(),
});

export type GetAssessmentDTO = z.infer<typeof getAssessmentSchema>;
export type UpdateAssessmentDTO = z.infer<typeof updateAssessmentSchema>;
export type DeleteAssessmentDTO = z.infer<typeof deleteAssessmentSchema>;
export type Assessment = z.infer<typeof assessmentSchema>;
export type CreateAssessmentDTO = z.infer<typeof createAssessmentSchema>;
export type SendAssessmentInvitationDTO = z.infer<typeof sendAssessmentInvitationSchema>;
