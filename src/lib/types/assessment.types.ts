import { type ApplicationDTO } from '@/lib/schemas/application.schema';
import { type Assessment } from '@/generated/prisma';
import { type AssessmentTemplate } from '@/generated/prisma';

export type AssessmentWithRelations = Assessment & {
    application: ApplicationDTO;
    assessmentTemplate: AssessmentTemplate;
};
