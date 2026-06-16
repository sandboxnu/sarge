import z from 'zod';
import { ProgrammingLanguage } from '@/generated/prisma';

export const TaskTemplateLanguageSchema = z.object({
    id: z.int(),
    taskTemplateId: z.string(),
    solution: z.string(),
    stub: z.string(),
    language: z.enum(ProgrammingLanguage),
});

export const generateStubSchema = z.object({
    functionName: z.string().trim().min(1),
    returnType: z.string().trim().min(1),
    parameters: z.array(
        z.object({
            name: z.string().trim().min(1),
            type: z.string().trim().min(1),
        })
    ),
    language: z.string().trim().min(1),
});

export type TaskTemplateLanguageDTO = z.infer<typeof TaskTemplateLanguageSchema>;
export type GenerateStubDTO = z.infer<typeof generateStubSchema>;
