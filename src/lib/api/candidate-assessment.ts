import { type SnapshotType } from '@/generated/prisma';
import type { SubmitTaskForCandidateDTO, TaskDTO } from '@/lib/schemas/task.schema';
import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';

export async function getCandidateAssessment(assessmentId: string): Promise<CandidateAssessment> {
    const res = await fetch(`/api/oa/${assessmentId}`);
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

export async function submitCandidateAssessment(assessmentId: string): Promise<void> {
    const res = await fetch(`/api/oa/${assessmentId}/submit`, { method: 'PUT' });
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

export async function createCandidateTask(
    assessmentId: string,
    taskTemplateId: string
): Promise<TaskDTO> {
    const res = await fetch(`/api/oa/${assessmentId}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTemplateId }),
    });
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

export async function submitCandidateTask(
    assessmentId: string,
    taskId: string,
    payload: SubmitTaskForCandidateDTO
): Promise<TaskDTO> {
    const res = await fetch(`/api/oa/${assessmentId}/task/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

export async function createCandidateSnapshot(
    assessmentId: string,
    taskId: string,
    type: SnapshotType,
    content?: string
): Promise<void> {
    const res = await fetch(`/api/oa/${assessmentId}/task/${taskId}/snapshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content }),
    });
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
