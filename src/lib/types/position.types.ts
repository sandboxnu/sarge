import type {
    DecisionStatus,
    AssessmentStatus,
    Application,
    Assessment,
    Candidate,
    Task,
    Review,
    Comment,
    Snapshot,
    TaskTestResult,
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

export type ReviewWithComments = Review & {
    comments: Comment[];
};

export type TaskWithReviewData = Task & {
    reviews: ReviewWithComments[];
    snapshots: Snapshot[];
    testResults: TaskTestResult[];
};

export type ApplicationWithReviewData = Application & {
    candidate: Candidate;
    assessment:
        | (Assessment & {
              assessmentTemplate: { title: string };
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
