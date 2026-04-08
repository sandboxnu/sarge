import { type Application } from '@/generated/prisma';
import { type AssessmentStatus } from '@/generated/prisma';
import { type Assessment, type UpdateAssessmentDTO } from '@/lib/schemas/assessment.schema';
import {
    type AssessmentWithRelations,
    AssessmentInvitationResult,
} from '@/lib/types/assessment-template.types';

/**
 * GET /api/assessments/:assessmentId
 */
export async function getAssessment(assessmentId: string): Promise<AssessmentWithRelations> {
    const res = await fetch(`/api/assessments/${assessmentId}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * PUT /api/assessments/:assessmentId
 */
export async function updateAssessment(payload: UpdateAssessmentDTO): Promise<Assessment> {
    const res = await fetch(`/api/assessments/${payload.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * PUT /api/assessments/:assessmentId/status
 */
export async function updateAssessmentStatus(
    assessmentId: string,
    status: AssessmentStatus
): Promise<Application> {
    const res = await fetch(`/api/assessments/${assessmentId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            assessmentStatus: status,
        }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * POST /api/assessments/send-invitation
 * Sends assessment invitation emails to all NOT_SENT candidates of a position
 */
export async function sendAssessmentInvitation(
    positionId: string
): Promise<AssessmentInvitationResult> {
    const res = await fetch('/api/assessments/send-invitation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ positionId }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message ?? 'Failed to send assessment invitation');
    }

    return json.data;
}
