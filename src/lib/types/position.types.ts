import type { DecisionStatus, AssessmentStatus } from '@/generated/prisma';

export type PositionWithCounts = {
    title: string;
    id: string;
    numCandidates: number;
    numAssigned: number;
};

// the naming isn't exactly right :/ - but we are selecting for information we need to display the candidate pool
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
