import { type ApplicationDTO } from '@/lib/schemas/application.schema';
import type { AssessmentTaskTemplatePreviewDTO } from '@/lib/schemas/assessment-template.schema';
import { type AssessmentTemplateTask, type Assessment } from '@/generated/prisma';
import { type AssessmentTemplate } from '@/generated/prisma';

export type AssessmentWithRelations = Assessment & {
    application: ApplicationDTO;
    assessmentTemplate: AssessmentTemplate & {
        tasks: AssessmentTemplateTask[];
    };
};

export type AssessmentTemplateTaskOrder = {
    taskTemplateId: string;
    order: number;
};

export type TaskSection = {
    type: 'task';
    taskTemplateId: string;
    taskTemplate: AssessmentTaskTemplatePreviewDTO;
    order: number;
};

export type AssessmentInvitationResult = {
    totalSent: number;
    totalFailed: number;
    results: Array<{
        success: boolean;
        message: string;
        candidateName: string;
        positionTitle: string;
        assessmentId: string;
        applicationId: string;
    }>;
};

// TODO: TextSection will be added here
// export type TextSection = {
//     type: 'text';
//     title: string;
//     content: ...;
//     order: number;
// };

export type AssessmentSection = TaskSection; // | TextSection
