import { z } from 'zod';
import { blockNoteContentSchema } from '@/lib/schemas/block-note.schema';
import { testCaseSchema } from '@/lib/schemas/task-template.schema';
import { TagSchema } from '@/lib/schemas/tag.schema';
import { TaskTemplateLanguageSchema } from '@/lib/schemas/task-template-language.schema';

export const AssessmentTemplateSchema = z.object({
    id: z.string(),
    title: z.string(),
    orgId: z.string(),
    authorId: z.string(),
    internalNotes: blockNoteContentSchema.default([]),
});

export const CreateAssessmentTemplateSchema = AssessmentTemplateSchema.omit({
    id: true,
    orgId: true,
});

export const UpdateAssessmentTemplateSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    internalNotes: blockNoteContentSchema.optional(),
});

export const UpdateAssessmentTemplateTasksSchema = z.object({
    tasks: z.array(
        z.object({
            taskTemplateId: z.string(),
        })
    ),
});

const AssessmentTemplatePositionSchema = z.object({
    id: z.string(),
    title: z.string(),
});

const AssessmentTemplateAuthorSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const AssessmentTemplateListItemSchema = AssessmentTemplateSchema.extend({
    positions: z.array(AssessmentTemplatePositionSchema),
    author: AssessmentTemplateAuthorSchema,
});

const assessmentTaskTemplatePreviewSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: blockNoteContentSchema.default([]),
    timeLimitMinutes: z.number().int().default(0),
    languages: TaskTemplateLanguageSchema.array(),
    publicTestCases: testCaseSchema.array(),
    privateTestCases: testCaseSchema.array(),
    tags: TagSchema.array(),
});

const AssessmentTemplateTaskSchema = z.object({
    taskTemplateId: z.string(),
    order: z.number().int(),
    taskTemplate: assessmentTaskTemplatePreviewSchema,
});

export const AssessmentTemplateDetailSchema = AssessmentTemplateSchema.extend({
    tasks: z.array(AssessmentTemplateTaskSchema),
    author: AssessmentTemplateAuthorSchema.nullable(),
    positions: z.array(AssessmentTemplatePositionSchema),
});

export type CreateAssessmentTemplateDTO = z.infer<typeof CreateAssessmentTemplateSchema>;
export type UpdateAssessmentTemplateDTO = z.infer<typeof UpdateAssessmentTemplateSchema>;
export type AssessmentTemplateListItemDTO = z.infer<typeof AssessmentTemplateListItemSchema>;
export type AssessmentTemplateDetailDTO = z.infer<typeof AssessmentTemplateDetailSchema>;
export type AssessmentTaskTemplatePreviewDTO = z.infer<typeof assessmentTaskTemplatePreviewSchema>;
