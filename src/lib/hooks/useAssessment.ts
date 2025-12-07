'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AssessmentWithRelations } from '@/lib/services/assessment.service';
import { AssessmentStatus } from '@/generated/prisma';

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
                const response = await fetch(`/api/assessments/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assessment template');
                }
                const assessment = await response.json();
                setAssessment(assessment.data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        fetchAssessment();
    }, [id]);

    function startAssessment() {
        // Setting this up in case we want to add future logic
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
            const response = await fetch(`/api/assessments/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ submittedAt: new Date() }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to submit assessment');
            }

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
            const response = await fetch(`/api/assessments/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ assessmentStatus: status }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update assessment status');
            }

            setAssessment((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    candidatePoolEntry: {
                        ...prev.candidatePoolEntry,
                        assessmentStatus: status,
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
        if (!currentTaskId || !assessment?.assessmentTemplate.taskTemplates) return -1;
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
