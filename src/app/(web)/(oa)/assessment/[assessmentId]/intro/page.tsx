'use client';

import { Button } from '@/lib/components/ui/Button';
import useAssessment from '@/lib/hooks/useAssessment';
import { use } from 'react';

export default function IntroAssessmentPage({
    params,
}: {
    params: Promise<{ assessmentId: string }>;
}) {
    const { assessmentId } = use(params);
    const { loading, error, assessment, startAssessment } = useAssessment(assessmentId);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (assessment?.deadline && new Date() > new Date(assessment.deadline)) {
        return <div>Assessment deadline has passed</div>;
    }

    if (assessment?.candidatePoolEntry.assessmentStatus !== 'ASSIGNED') {
        return <div>Assessment is not open</div>;
    }

    return (
        <div className="p-8">
            <h1 className="mb-4 text-2xl font-bold">{assessment?.assessmentTemplate.title}</h1>

            <p className="mb-6">
                You are about to start the assessment.
                {assessment?.deadline && (
                    <> Deadline: {new Date(assessment.deadline).toLocaleDateString()}</>
                )}
            </p>

            <Button onClick={startAssessment}>Start Assessment</Button>
        </div>
    );
}
