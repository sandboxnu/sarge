'use client';

import { Button } from '@/lib/components/Button';
import useAssessment from '@/lib/hooks/useAssessment';
import { use } from 'react';

export default function OutroAssessmentPage({
    params,
}: {
    params: Promise<{ assessmentId: string }>;
}) {
    const { assessmentId } = use(params);
    const { loading, error, assessment, submitAssessment } = useAssessment(assessmentId);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (assessment?.candidatePoolEntry.assessmentStatus === 'SUBMITTED') {
        return <div>This assessment has already been submitted.</div>;
    }

    return (
        <div className="p-8">
            <h1 className="mb-4 text-2xl font-bold">Thank you!</h1>

            <p className="mb-6">You have completed the assessment.</p>

            <Button onClick={submitAssessment}>Submit Assessment</Button>
        </div>
    );
}
