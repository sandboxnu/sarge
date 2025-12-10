import type { DecisionStatus, AssessmentStatus } from '@/generated/prisma';

export type PositionWithCounts = {
    title: string;
    id: string;
    numCandidates: number;
    numAssigned: number;
    createdAt: Date;
};

export interface CandidatePoolDisplayInfo {
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
        uniqueLink: string;
        submittedAt: Date | null;
    } | null;
    decisionMaker: {
        name: string;
        email: string;
    } | null;
}

export interface BatchAddResult {
    candidatesCreated: number;
    entriesCreated: number;
    totalProcessed: number;
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
        uniqueLink: string;
        submittedAt: Date | null;
        reviews: {
            reviewer: {
                id: string;
                name: string;
                email: string;
                image: string | null;
            };
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
