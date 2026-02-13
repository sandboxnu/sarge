import z from 'zod';
import { ProgrammingLanguage } from '@/generated/prisma';

export const TaskTemplateLanguageSchema = z.object({
    id: z.int(),
    taskTemplateId: z.string(),
    solution: z.string(),
    stub: z.string(),
    language: z.enum(ProgrammingLanguage),
});

export type TaskTemplateLanguageDTO = z.infer<typeof TaskTemplateLanguageSchema>;
