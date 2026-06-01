import type {
    DecisionStatus,
    AssessmentStatus,
    Application,
    Assessment,
    Task,
    Review,
    Comment,
    Snapshot,
} from '@/generated/prisma';

export type PositionWithCounts = {
    title: string;
    id: string;
    archived: boolean;
    numCandidates: number;
    numAssigned: number;
    assessmentTemplateId: string | null;
    assessmentTemplateTitle: string | null;
    assessmentSentCount: number;
    assessmentSubmittedCount: number;
    createdAt: Date;
};

export interface ApplicationDisplayInfo {
    id: string;
    assessmentStatus: AssessmentStatus;
    decisionStatus: DecisionStatus;
    candidate: {
        name: string;
        major: string | null;
        graduationDate: string | null;
        githubUrl: string | null;
        resumeUrl: string | null;
    };
    assessment: {
        id: string;
        submittedAt: Date | null;
        reviewers: {
            id: string;
            name: string;
        }[];
    } | null;
}

// A review along with its inline (line-anchored) comments.
export type ReviewWithComments = Review & {
    comments: Comment[];
};

// A candidate's task attempt with everything a reviewer needs: the submitted code (on Task),
// all reviews (with comments), and the full proctoring snapshot history.
export type TaskWithReviewData = Task & {
    reviews: ReviewWithComments[];
    snapshots: Snapshot[];
};

// An application with its full assessment review tree. Returned when fetching a single
// application by id for the reviewing page.
export type ApplicationWithReviewData = Application & {
    assessment:
        | (Assessment & {
              tasks: TaskWithReviewData[];
          })
        | null;
};

export interface BatchAddResult {
    candidatesCreated: number;
    entriesCreated: number;
    totalProcessed: number;
    candidates: ApplicationDisplayInfo[];
}

export interface PositionPreviewCandidate {
    id: string;
    assessmentStatus: AssessmentStatus;
    decisionStatus: DecisionStatus;
    candidate: {
        id: string;
        name: string;
        major: string | null;
        graduationDate: string | null;
    };
    assessment: {
        id: string;
        submittedAt: Date | null;
        reviewers: {
            id: string;
            name: string;
            email: string;
            image: string | null;
        }[];
    } | null;
}

export interface PositionPreviewData {
    id: string;
    title: string;
    createdAt: Date;
    candidateCount: number;
    assessmentTemplate: {
        id: string;
        title: string;
    } | null;
    candidates: PositionPreviewCandidate[];
    stats: {
        totalSent: number;
        totalSubmitted: number;
        totalGraded: number;
    };
}

export interface PositionPreviewResponse {
    id: string;
    title: string;
    createdAt: string;
    candidateCount: number;
    assessmentTemplate: {
        id: string;
        title: string;
    } | null;
    candidates: {
        id: string;
        assessmentStatus: AssessmentStatus;
        decisionStatus: DecisionStatus;
        candidate: {
            id: string;
            name: string;
            major: string | null;
            graduationDate: string | null;
        };
        assessment: {
            id: string;
            submittedAt: string | null;
            reviewers: {
                id: string;
                name: string;
                email: string;
                image: string | null;
            }[];
        } | null;
    }[];
    stats: {
        totalSent: number;
        totalSubmitted: number;
        totalGraded: number;
    };
}
