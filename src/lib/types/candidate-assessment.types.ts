import type { AssessmentStatus } from '@/generated/prisma';
import type { TestCaseDTO } from '@/lib/schemas/task-template.schema';
import type { BlockNoteContent } from './task-template.types';

export type TaskLanguageOption = {
    id: number;
    language: string;
    stub: string;
};

export type CandidateTaskView = {
    id: string;
    title: string;
    description: BlockNoteContent;
    publicTestCases: TestCaseDTO[];
    estimatedTime: number;
    timeout: number;
    languages: TaskLanguageOption[];
};

export type AssessmentQuestion = {
    taskTemplateId: string;
    order: number;
    taskTemplate: CandidateTaskView;
};

export type CandidateAssessment = {
    id: string;
    deadline: Date | null;
    assignedAt: Date;
    submittedAt: Date | null;
    assessmentStatus: AssessmentStatus;
    candidateName: string;
    assessmentTemplate: {
        title: string;
        tasks: AssessmentQuestion[];
    };
};

export type AssessmentPhase = 'intro' | 'assessment' | 'outro';
export type OutroReason = 'submitted' | 'expired';
export type SectionStatus = 'locked' | 'current' | 'completed';

export type TestCaseResult = {
    status: 'default' | 'loading' | 'passed' | 'failed' | 'runtime_error';
    actualOutput?: string;
};

export type SectionState = {
    taskTemplateId: string;
    order: number;
    taskTemplate: CandidateTaskView;
    status: SectionStatus;
    code: string;
    language: string;
    testCaseResults: TestCaseResult[];
};
