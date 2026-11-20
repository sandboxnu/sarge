import { type AssessmentStatus } from '@/generated/prisma';
import { type LiveAssessmentStatus } from '@/lib/types/reviewing.types';

const PENDING_REVIEW_STATUSES: AssessmentStatus[] = [
    'NOT_SENT',
    'NOT_STARTED',
    'IN_PROGRESS',
    'SUBMITTED',
];

export function getReviewCounts(statuses: AssessmentStatus[]) {
    let reviewedCount = 0;
    let remainingCount = 0;
    let awaitingReviewCount = 0;

    for (const status of statuses) {
        if (status === 'GRADED') reviewedCount++;
        if (PENDING_REVIEW_STATUSES.includes(status)) remainingCount++;
        if (status === 'SUBMITTED') awaitingReviewCount++;
    }

    return { reviewedCount, remainingCount, awaitingReviewCount };
}

export function getLiveAssessmentStatus(
    reviewedCount: number,
    remainingCount: number
): LiveAssessmentStatus {
    if (reviewedCount === 0) return 'NOT_STARTED';
    if (remainingCount === 0) return 'COMPLETED';
    return 'IN_PROGRESS';
}

export function getReviewProgress(reviewedCount: number, remainingCount: number): number {
    const total = reviewedCount + remainingCount;
    return total === 0 ? 0 : reviewedCount / total;
}

export function formatShortName(name: string): string {
    const [first, ...rest] = name.trim().split(/\s+/);
    const last = rest.at(-1);
    return last ? `${first} ${last[0].toUpperCase()}.` : (first ?? '');
}

export function formatFinishedReviewers(names: string[]): string {
    if (names.length === 0) return '';
    const lead = formatShortName(names[0]);
    const others = names.length - 1;
    if (others === 0) return `${lead} finished reviewing`;
    return `${lead} & ${others} ${others === 1 ? 'other' : 'others'} finished reviewing`;
}
