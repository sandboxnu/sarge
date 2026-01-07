import { type AssessmentWithRelations } from '@/lib/services/assessment.service';
import { type Application } from '@/generated/prisma';
import { type AssessmentStatus } from '@/generated/prisma';
import { type Assessment, type UpdateAssessmentDTO } from '@/lib/schemas/assessment.schema';

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
