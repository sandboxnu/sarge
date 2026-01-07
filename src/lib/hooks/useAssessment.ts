'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type AssessmentWithRelations } from '@/lib/services/assessment.service';
import { AssessmentStatus } from '@/generated/prisma';
import { getAssessment, updateAssessment, updateAssessmentStatus } from '@/lib/api/assessments';

export default function useAssessment(id: string, currentTaskId?: string) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [assessment, setAssessment] = useState<AssessmentWithRelations>();

    useEffect(() => {
        async function fetchAssessment() {
            try {
                setLoading(true);
                setError(null);

                const data = await getAssessment(id);
                setAssessment(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchAssessment();
    }, [id]);

    function startAssessment() {
        goToNextTask();
    }

    function goToNextTask() {
        const currentTaskIndex = getCurrentTaskIndex();
        const nextTaskIndex = currentTaskIndex + 1;
        const taskList = assessment?.assessmentTemplate.taskTemplates ?? [];

        if (nextTaskIndex < taskList.length) {
            router.push(`/assessment/${id}/task/${taskList[nextTaskIndex]}`);
        } else {
            router.push(`/assessment/${id}/outro`);
        }
    }

    async function submitAssessment() {
        try {
            setLoading(true);
            setError(null);

            const updatedAssessment = await updateAssessment({
                id,
                submittedAt: new Date(),
            });

            setAssessment((prev) => (prev ? { ...prev, ...updatedAssessment } : prev));

            await setAssessmentStatus(AssessmentStatus.SUBMITTED);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function setAssessmentStatus(status: AssessmentStatus) {
        try {
            setLoading(true);
            setError(null);

            const updatedApplication = await updateAssessmentStatus(id, status);

            setAssessment((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    application: {
                        ...prev.application,
                        assessmentStatus: updatedApplication.assessmentStatus,
                    },
                };
            });
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    const getCurrentTaskIndex = () => {
        if (!currentTaskId || !assessment?.assessmentTemplate.taskTemplates) {
            return -1;
        }

        return assessment.assessmentTemplate.taskTemplates.indexOf(currentTaskId);
    };

    return {
        loading,
        error,
        assessment,
        submitAssessment,
        startAssessment,
        goToNextTask,
    };
}
