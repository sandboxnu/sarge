import { useEffect, useState } from 'react';
import type { TaskTemplateDTO } from '@/lib/schemas/task-template.schema';

export function useTaskList() {
    const [taskList, setTaskList] = useState<TaskTemplateDTO[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchTaskList() {
            try {
                const response = await fetch('/api/task-templates', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('fetch unsuccessful');
                }

                const body = await response.json();
                setTaskList(body.data);
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTaskList();
    }, []);

    return {
        taskList,
        isLoading,
        error,
    };
}
