import { z } from 'zod';
import { ProgrammingLanguage, TestVisibility } from '@/generated/prisma';

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

// A single test-case result, snapshotted at submit time.
export const taskTestResultSchema = z.object({
    visibility: z.enum(TestVisibility),
    passed: z.boolean(),
    input: z.string(),
    expectedOutput: z.string(),
    actualOutput: z.string().nullable().optional(),
});

// Candidate submits a task, their code and test results are retrieved from the client side
export const SubmitTaskForCandidateSchema = z.object({
    submission: z.string(),
    language: z.enum(ProgrammingLanguage),
    testResults: z.array(taskTestResultSchema),
});

export type TaskDTO = z.infer<typeof TaskSchema>;
export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
export type CreateTaskForCandidateDTO = z.infer<typeof CreateTaskForCandidateSchema>;
export type SubmitTaskForCandidateDTO = z.infer<typeof SubmitTaskForCandidateSchema>;
