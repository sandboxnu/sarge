import type { AssessmentStatus, DecisionStatus } from '@/generated/prisma';
import type { ChipVariant } from '@/lib/components/ui/Chip';

/**
 * Get the chip variant for a given assessment status
 */
export function getAssessmentStatusVariant(status: AssessmentStatus): ChipVariant {
    switch (status) {
        case 'GRADED':
            return 'success'; // Green chip per Figma Position Preview Modal
        case 'SUBMITTED':
            return 'primary'; // Purple chip per Figma Position Preview Modal
        case 'IN_PROGRESS':
            return 'warning';
        case 'NOT_SENT':
        case 'NOT_STARTED':
            return 'neutral'; // Gray chip per Figma design
        case 'EXPIRED':
            return 'error';
        case 'NOT_ASSIGNED':
        default:
            return 'neutral';
    }
}

/**
 * Get the display label for a given assessment status
 */
export function getAssessmentStatusLabel(status: AssessmentStatus): string {
    switch (status) {
        case 'GRADED':
            return 'Graded';
        case 'SUBMITTED':
            return 'Submitted';
        case 'IN_PROGRESS':
            return 'In progress';
        case 'NOT_SENT':
            return 'Not sent';
        case 'NOT_STARTED':
            return 'Sent';
        case 'EXPIRED':
            return 'Expired';
        case 'NOT_ASSIGNED':
        default:
            return 'Not started';
    }
}

/**
 * Get the chip variant for a given decision status
 */
export function getDecisionStatusVariant(status: DecisionStatus): ChipVariant {
    switch (status) {
        case 'ACCEPTED':
            return 'success';
        case 'REJECTED':
            return 'error';
        case 'PENDING':
        default:
            return 'neutral';
    }
}

/**
 * Get the display label for a given decision status
 */
export function getDecisionStatusLabel(status: DecisionStatus): string {
    switch (status) {
        case 'ACCEPTED':
            return 'Accept';
        case 'REJECTED':
            return 'Reject';
        case 'PENDING':
        default:
            return 'Pending';
    }
}

/**
 * Get the chip variant based on submission percentage
 * Used for displaying submission progress (e.g., "5/10 submitted")
 */
export function getSubmissionVariant(submitted: number, total: number): ChipVariant {
    if (total <= 0 || submitted <= 0) return 'neutral';
    const ratio = submitted / total;
    if (ratio <= 1 / 3) return 'error';
    if (ratio <= 2 / 3) return 'warning';
    return 'success';
}
