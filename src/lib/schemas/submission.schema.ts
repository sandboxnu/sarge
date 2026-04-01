import { ProgrammingLanguage } from '@/generated/prisma';
import { testCaseSchema } from '@/lib/schemas/task-template.schema';
import { z } from 'zod';

export const SubmissionSchema = z.object({
    code: z.string(),
    language: z.enum(ProgrammingLanguage),
    additonalTests: z.array(testCaseSchema).optional(), // May be useful for letting users create their own test cases in the future
});

export const TestSubmissionSchema = SubmissionSchema.omit({
    additonalTests: true,
}).extend({
    tests: z.array(testCaseSchema),
});

export type SubmissionSchemaDTO = z.infer<typeof SubmissionSchema>;
export type TestSubmissionSchemaDTO = z.infer<typeof TestSubmissionSchema>;
