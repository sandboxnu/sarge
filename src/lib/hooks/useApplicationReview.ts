import { useEffect, useState } from 'react';
import { getApplicationForReview } from '@/lib/api/applications';
import { type ApplicationWithReviewData } from '@/lib/types/position.types';

export default function useApplicationReview(applicationId: string | null) {
    const [application, setApplication] = useState<ApplicationWithReviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTask, setCurrentTask] = useState(0);

    useEffect(() => {
        if (!applicationId) {
            setError('Missing application id');
            setLoading(false);
            return;
        }

        async function fetchApplicationReview() {
            try {
                setLoading(true);
                setError(null);
                const data = await getApplicationForReview(applicationId as string);
                setApplication(data);
            } catch (err) {
                setError((err as Error).message);
                setApplication(null);
            } finally {
                setLoading(false);
            }
        }

        fetchApplicationReview();
    }, [applicationId]);

    const tasks = (application?.assessment?.tasks ?? []).filter((t) => t.submittedAt !== null);
    const totalTasks = tasks.length;
    const currentTaskData = tasks[currentTask] ?? null;
    // NOTE(laith): probably temporary, but basic ring buffer implementation
    const goPrev = () =>
        setCurrentTask((i) => (totalTasks === 0 ? 0 : (i - 1 + totalTasks) % totalTasks));
    const goNext = () => setCurrentTask((i) => (totalTasks === 0 ? 0 : (i + 1) % totalTasks));

    return {
        application,
        loading,
        error,
        tasks,
        totalTasks,
        currentTaskData,
        currentTask,
        setCurrentTask,
        goPrev,
        goNext,
    };
}
