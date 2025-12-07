import { z } from 'zod';

export const TaskSchema = z.object({
    id: z.string(),
    assessmentId: z.string(),
    taskTemplateId: z.string(),
    candidateCode: z.string(),
});

export const CreateTaskSchema = TaskSchema.omit({ id: true });

export const UpdateTaskSchema = TaskSchema.partial().extend({
    id: z.string(),
});

export type TaskDTO = z.infer<typeof TaskSchema>;
export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
