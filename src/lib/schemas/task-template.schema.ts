import { z } from 'zod';

const testCaseSchema = z.object({
    input: z.string().min(1, 'Expected input required'),
    output: z.string().min(1, 'Expected output required'),
});

export const getTaskTemplateSchema = z.object({
    id: z.cuid(),
});

export const createTaskTemplateSchema = z
    .object({
        title: z.string().trim(),
        content: z.string().min(2).max(500),
        orgId: z.cuid(),
        public_test_cases: z
            .array(testCaseSchema)
            .min(1, 'There must at least be one public test case')
            .optional(),
        private_test_cases: z.array(testCaseSchema),
        tagIds: z.array(z.cuid()).default([]),
    })
    .strict();

export const deleteTaskTemplateSchema = z.object({
    id: z.cuid(),
});

export const updateTaskTemplateSchema = z.object({
    id: z.cuid(),
    title: z.string().trim(),
    content: z.string().min(2).max(500),
    public_test_cases: z
        .array(testCaseSchema)
        .min(1, 'There must at least be one public test case'), // Might not have to be required
    private_test_cases: z.array(testCaseSchema).default([]),
    tagIds: z.array(z.cuid()).default([]),
});

export const TaskTemplateSchema = z.object({
    id: z.cuid(),
    title: z.string().trim(),
    content: z.string().min(2).max(500),
    orgId: z.cuid(),
    public_test_cases: z
        .array(testCaseSchema)
        .min(1, 'There must at least be one public test case'), // Might not have to be required
    private_test_cases: z.array(testCaseSchema).default([]),
    tagIds: z.array(z.cuid()).optional(),
});

export type TaskTemplateDTO = z.infer<typeof TaskTemplateSchema>;
export type GetTaskTemplateDTO = z.infer<typeof getTaskTemplateSchema>;
export type CreateTaskTemplateDTO = z.infer<typeof createTaskTemplateSchema>;
export type DeleteTaskTemplateDTO = z.infer<typeof deleteTaskTemplateSchema>;
export type UpdateTaskTemplateDTO = z.infer<typeof updateTaskTemplateSchema>;
