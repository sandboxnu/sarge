import type { DecisionStatus, AssessmentStatus } from '@/generated/prisma';

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
