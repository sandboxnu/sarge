import { z } from 'zod';
import { testCaseSchema } from '@/lib/schemas/task-template.schema';

export const TaskSchema = z.object({
    id: z.string(),
    assessmentId: z.string(),
    taskTemplateId: z.string(),
    submission: z.string().nullable(),
    startedAt: z.date(),
    submittedAt: z.date().nullable(),
});

export const CreateTaskSchema = TaskSchema.omit({
    id: true,
    startedAt: true,
    submittedAt: true,
}).extend({
    submission: z.string().nullable().default(null),
});

export const UpdateTaskSchema = TaskSchema.partial().extend({
    id: z.string(),
});

// Candidate creates a Task by entering a question, so only the template's ID is needed
export const CreateTaskForCandidateSchema = z.object({
    taskTemplateId: z.string(),
});

// Candidate submits a task, their code and test results are retrieved from the client side
export const SubmitTaskForCandidateSchema = z.object({
    submission: z.string(),
    passedTestCases: z.array(testCaseSchema),
    failedTestCases: z.array(testCaseSchema),
});

export type TaskDTO = z.infer<typeof TaskSchema>;
export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
export type CreateTaskForCandidateDTO = z.infer<typeof CreateTaskForCandidateSchema>;
export type SubmitTaskForCandidateDTO = z.infer<typeof SubmitTaskForCandidateSchema>;
