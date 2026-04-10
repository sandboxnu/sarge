import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';

export async function getCandidateAssessment(assessmentId: string): Promise<CandidateAssessment> {
    const res = await fetch(`/api/oa/${assessmentId}`);
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

export async function submitCandidateAssessment(assessmentId: string): Promise<void> {
    const res = await fetch(`/api/oa/${assessmentId}/submit`, { method: 'PUT' });
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

export async function startCandidateAssessment(assessmentId: string): Promise<void> {
    const res = await fetch(`/api/oa/${assessmentId}/start`, { method: 'PUT' });
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
