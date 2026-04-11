import {
    type SubmissionSchemaDTO,
    type TestSubmissionSchemaDTO,
} from '@/lib/schemas/submission.schema';
import type { CandidateTestResult } from '@/lib/types/candidate-assessment.types';

export async function runEditorSubmission(
    submission: TestSubmissionSchemaDTO
): Promise<CandidateTestResult[]> {
    const result = await fetch(`/api/runner`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
    });

    const json = await result.json();

    if (!result.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

export async function runAssessmentSubmission(
    taskTemplateId: string,
    submission: SubmissionSchemaDTO
): Promise<CandidateTestResult[]> {
    const result = await fetch(`/api/runner/${taskTemplateId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
    });

    const json = await result.json();

    if (!result.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
