import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';

/**
 * GET /api/oa/[assessmentId]?token=<uniqueLink>
 */
export async function getCandidateAssessment(
    assessmentId: string,
    token: string
): Promise<CandidateAssessment> {
    const res = await fetch(`/api/oa/${assessmentId}?token=${encodeURIComponent(token)}`);
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * PUT /api/oa/[assessmentId]/submit?token=<uniqueLink>
 */
export async function submitCandidateAssessment(
    assessmentId: string,
    token: string
): Promise<void> {
    const res = await fetch(`/api/oa/${assessmentId}/submit?token=${encodeURIComponent(token)}`, {
        method: 'PUT',
    });
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }
}
