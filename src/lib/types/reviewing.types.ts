export type LiveAssessmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface LiveAssessmentSummary {
    positionId: string;
    positionTitle: string;
    archived: boolean;
    assessmentTemplateId: string;
    assessmentTemplateTitle: string;
    candidateCount: number;
    reviewedCount: number;
    remainingCount: number;
    awaitingReviewCount: number;
    status: LiveAssessmentStatus;
    lastActivityAt: string;
    reviewTargetApplicationId: string;
    continueGrading: ContinueGradingItem[];
    awaitingYourReview: AwaitingYourReviewItem[];
}

export interface ContinueGradingItem {
    positionId: string;
    positionTitle: string;
    applicationId: string;
    taskCount: number;
    tasksLeft: number;
    lastEditedAt: string;
}

export interface AwaitingYourReviewItem {
    positionId: string;
    positionTitle: string;
    applicationId: string;
    finishedReviewerNames: string[];
    lastFinishedAt: string | null;
    submittedAt: string | null;
}
