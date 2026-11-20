export type LiveAssessmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

/**
 * One card on the Live Assessments (reviewing dashboard) page: a position that has an
 * assessment template attached, with review progress rolled up across its applications.
 */
export interface LiveAssessmentSummary {
    positionId: string;
    positionTitle: string;
    archived: boolean;
    assessmentTemplateId: string;
    assessmentTemplateTitle: string;
    candidateCount: number;
    /** Applications whose assessment has been graded. */
    reviewedCount: number;
    /** Applications still expected to be reviewed (sent, in progress, or submitted but not graded). */
    remainingCount: number;
    /** Submitted applications waiting on a reviewer right now. */
    awaitingReviewCount: number;
    status: LiveAssessmentStatus;
    /** ISO timestamp of the most recent change to the position, its applications, or their reviews. */
    lastActivityAt: string;
    /** Application to open when the card is clicked; null when the position has no applications. */
    reviewTargetApplicationId: string | null;
    /** Submissions on this position the current user has started grading but not finished. */
    continueGrading: ContinueGradingItem[];
    /** Submissions on this position assigned to the current user that they haven't started. */
    awaitingYourReview: AwaitingYourReviewItem[];
}

/** A submission the current user is partway through grading (Continue Grading panel). */
export interface ContinueGradingItem {
    positionId: string;
    positionTitle: string;
    applicationId: string;
    /** Tasks in the submission. */
    taskCount: number;
    /** Tasks the current user hasn't reviewed yet. */
    tasksLeft: number;
    /** ISO timestamp of the current user's most recent review on this submission. */
    lastEditedAt: string;
}

/** A submission assigned to the current user that they haven't started (Awaiting Your Review panel). */
export interface AwaitingYourReviewItem {
    positionId: string;
    positionTitle: string;
    applicationId: string;
    /** Other reviewers who reviewed every task, most recent finisher first. */
    finishedReviewerNames: string[];
    /** ISO timestamp of the most recent finish; null when nobody has finished. */
    lastFinishedAt: string | null;
    submittedAt: string | null;
}
