import { z } from 'zod';

export const AssessmentTemplateSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    orgId: z.string(),
    taskTemplates: z.array(z.string()).min(1),
});

export const CreateAssessmentTemplateSchema = AssessmentTemplateSchema.omit({
    id: true,
});

export const UpdateAssessmentTemplateSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
});

export const GetAssessmentTemplateSchema = z.object({
    id: z.string(),
});

export const DeleteAssessmentTemplateSchema = z.object({
    id: z.string(),
});

export type CreateAssessmentTemplateDTO = z.infer<typeof CreateAssessmentTemplateSchema>;
export type UpdateAssessmentTemplateDTO = z.infer<typeof UpdateAssessmentTemplateSchema>;
export type GetAssessmentTemplateDTO = z.infer<typeof GetAssessmentTemplateSchema>;
export type DeleteAssessmentTemplateDTO = z.infer<typeof DeleteAssessmentTemplateSchema>;
export type AssessmentTemplate = z.infer<typeof AssessmentTemplateSchema>;
