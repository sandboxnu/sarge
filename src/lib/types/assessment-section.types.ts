import type { AssessmentTaskTemplatePreviewDTO } from '@/lib/schemas/assessment-template.schema';

export type TaskSection = {
    type: 'task';
    taskTemplateId: string;
    taskTemplate: AssessmentTaskTemplatePreviewDTO;
    order: number;
};

// TODO: TextSection will be added here
// export type TextSection = {
//     type: 'text';
//     title: string;
//     content: ...;
//     order: number;
// };

export type AssessmentSection = TaskSection; // | TextSection
