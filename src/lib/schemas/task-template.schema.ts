import { z } from 'zod';
import { blockNoteContentSchema } from './block-note.schema';
import { TagSchema } from './tag.schema';
import { TaskTemplateLanguageSchema } from './task-template-language.schema';

export const testCaseSchema = z.object({
    input: z.string().min(1, 'Expected input required'),
    output: z.string().min(1, 'Expected output required'),
});

export const getTaskTemplateSchema = z.object({
    id: z.string(),
});

export const TaskTemplateSchema = z.object({
    id: z.string(),
    title: z.string().trim(),
    description: blockNoteContentSchema.default([]),
    orgId: z.string(),
    publicTestCases: z.array(testCaseSchema).min(1, 'There must at least be one public test case'),
    privateTestCases: z.array(testCaseSchema).default([]),
    taskType: z.string().nullable(),
    authorId: z.string(),
    timeLimitMinutes: z.number().int().default(0),
});

export const TaskTemplateEditorSchema = TaskTemplateSchema.extend({
    tags: TagSchema.array(),
    languages: TaskTemplateLanguageSchema.array(),
});

export const createTaskTemplateSchema = z.object({
    title: z.string().trim(),
    description: blockNoteContentSchema.default([]),
    publicTestCases: z.array(testCaseSchema).default([]),
    privateTestCases: z.array(testCaseSchema).default([]),
    taskType: z.string().nullable().default(null),
});

export const deleteTaskTemplateSchema = z.object({
    id: z.string(),
});

export const updateTaskTemplateSchema = TaskTemplateSchema.partial()
    .omit({ orgId: true, authorId: true })
    .extend({
        id: z.string(),
    });

export const taskTemplateWithTagsSchema = TaskTemplateSchema.extend({
    tags: TagSchema.array(),
});

export const taskTemplateAuthorSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const taskTemplateListItemSchema = taskTemplateWithTagsSchema.extend({
    author: taskTemplateAuthorSchema.nullable(),
    assessmentTemplatesCount: z.number(),
    languages: TaskTemplateLanguageSchema.array(),
});

export const taskTemplateEditorSaveSchema = TaskTemplateSchema.omit({
    orgId: true,
    authorId: true,
}).extend({
    description: blockNoteContentSchema,
    tags: z.array(z.string()),
    languages: TaskTemplateLanguageSchema.array(),
});

export type TaskTemplateDTO = z.infer<typeof TaskTemplateSchema>;
export type GetTaskTemplateDTO = z.infer<typeof getTaskTemplateSchema>;
export type CreateTaskTemplateDTO = z.infer<typeof createTaskTemplateSchema>;
export type DeleteTaskTemplateDTO = z.infer<typeof deleteTaskTemplateSchema>;
export type UpdateTaskTemplateDTO = z.infer<typeof updateTaskTemplateSchema>;
export type TestCaseDTO = z.infer<typeof testCaseSchema>;
export type TaskTemplateWithTagsDTO = z.infer<typeof taskTemplateWithTagsSchema>;
export type TaskTemplateListItemDTO = z.infer<typeof taskTemplateListItemSchema>;
export type TaskTemplateEditorDTO = z.infer<typeof TaskTemplateEditorSchema>;
export type TaskTemplateEditorSaveDTO = z.infer<typeof taskTemplateEditorSaveSchema>;
