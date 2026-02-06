import { z } from 'zod';
import { TagSchema } from './tag.schema';

const testCaseSchema = z.object({
    input: z.string().min(1, 'Expected input required'),
    output: z.string().min(1, 'Expected output required'),
});

export const getTaskTemplateSchema = z.object({
    id: z.string(),
});

export const TaskTemplateSchema = z.object({
    id: z.string(),
    title: z.string().trim(),
    content: z.string().min(2),
    orgId: z.string(),
    publicTestCases: z.array(testCaseSchema).min(1, 'There must at least be one public test case'),
    privateTestCases: z.array(testCaseSchema).default([]),
    taskType: z.string().optional(),
    supportedLanguages: z.array(z.string()).default([]),
    authorId: z.string(),
});

export const createTaskTemplateSchema = TaskTemplateSchema.omit({ id: true, authorId: true });

export const deleteTaskTemplateSchema = z.object({
    id: z.string(),
});

export const updateTaskTemplateSchema = TaskTemplateSchema.partial().extend({
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
});

export type TaskTemplateDTO = z.infer<typeof TaskTemplateSchema>;
export type GetTaskTemplateDTO = z.infer<typeof getTaskTemplateSchema>;
export type CreateTaskTemplateDTO = z.infer<typeof createTaskTemplateSchema>;
export type DeleteTaskTemplateDTO = z.infer<typeof deleteTaskTemplateSchema>;
export type UpdateTaskTemplateDTO = z.infer<typeof updateTaskTemplateSchema>;
export type TestCaseDTO = z.infer<typeof testCaseSchema>;
export type TaskTemplateWithTagsDTO = z.infer<typeof taskTemplateWithTagsSchema>;
export type TaskTemplateListItemDTO = z.infer<typeof taskTemplateListItemSchema>;
