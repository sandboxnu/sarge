import { useState, useEffect } from 'react';
import { getTaskTemplate } from '@/lib/api/task-templates';
import { type TaskTemplate } from '@/generated/prisma';

export default function useTaskTemplateEditPage(taskTemplateId: string) {
    const [taskTemplate, setTaskTemplate] = useState<TaskTemplate | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const taskTemplate = await getTaskTemplate(taskTemplateId);

                setTaskTemplate(taskTemplate);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [taskTemplateId]);

    return {
        taskTemplate,
        error,
        isLoading,
    };
}
