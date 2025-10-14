import { z } from 'zod';

export class TaskTemplateNotFoundError extends Error {
    constructor() {
        super('Task Template Not Found');
    }
}

export class TaskTemplateExistsError extends Error {
    constructor() {
        super('Task Template with that name already exists');
    }
}

const testCaseSchema = z.object({
    input: z.string().min(1, 'Expected input required'),
    output: z.string().min(1, 'Expected output required'),
});

export const getTaskTemplateSchema = z.object({
    id: z.uuid(),
});

export const createTaskTemplateSchema = z
    .object({
        title: z.string().trim(),
        content: z.string().min(2).max(500),
        orgId: z.uuid(),
        public_test_cases: z
            .array(testCaseSchema)
            .min(1, 'There must at least be one public test case'),
        private_test_cases: z.array(testCaseSchema).default([]),
    })
    .strict();

export const deleteTaskTemplateSchema = z.object({
    id: z.uuid(),
});

export const updateTaskTemplateSchema = z.object({
    id: z.uuid(),
    title: z.string().trim(),
    content: z.string().min(2).max(500),
    public_test_cases: z
        .array(testCaseSchema)
        .min(1, 'There must at least be one public test case'),
    private_test_cases: z.array(testCaseSchema).default([]),
});

export const TaskTemplateSchema = z.object({
    id: z.uuid(),
    title: z.string().trim(),
    content: z.string().min(2).max(500),
    orgId: z.uuid(),
    public_test_cases: z
        .array(testCaseSchema)
        .min(1, 'There must at least be one public test case'),
    private_test_cases: z.array(testCaseSchema).default([]),
});

export type TaskTemplateDTO = z.infer<typeof TaskTemplateSchema>;
export type GetTaskTemplateDTO = z.infer<typeof getTaskTemplateSchema>;
export type CreateTaskTemplateDTO = z.infer<typeof createTaskTemplateSchema>;
export type DeleteTaskTemplateDTO = z.infer<typeof deleteTaskTemplateSchema>;
export type UpdateTaskTemplateDTO = z.infer<typeof updateTaskTemplateSchema>;
