import type { AssessmentStatus, DecisionStatus } from '@/generated/prisma';
import type { ChipVariant } from '@/lib/components/Chip';

/**
 * Get the chip variant for a given assessment status
 */
export function getAssessmentStatusVariant(status: AssessmentStatus): ChipVariant {
    switch (status) {
        case 'GRADED':
            return 'success'; // Green chip per Figma Position Preview Modal
        case 'SUBMITTED':
            return 'primary'; // Purple chip per Figma Position Preview Modal
        case 'ASSIGNED':
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
        case 'ASSIGNED':
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

/**
 * Get Tailwind CSS classes for status badge color
 * Legacy function for backwards compatibility with existing code
 * @deprecated Use getAssessmentStatusVariant or getDecisionStatusVariant with Chip component instead
 */
export function getStatusBadgeColor(status: AssessmentStatus | DecisionStatus | string): string {
    if (status === 'ACCEPTED' || status === 'GRADED') {
        return 'bg-sarge-success-100 text-sarge-success-800';
    }
    if (status === 'REJECTED' || status === 'EXPIRED') {
        return 'bg-sarge-error-200 text-sarge-error-700';
    }
    if (status === 'ASSIGNED') {
        return 'bg-sarge-gray-200 text-sarge-gray-600'; // Gray per Figma design
    }
    if (status === 'SUBMITTED') {
        return 'bg-sarge-primary-200 text-sarge-primary-600';
    }
    return 'bg-sarge-gray-200 text-sarge-gray-600';
}
