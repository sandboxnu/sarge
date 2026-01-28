import { useEffect, useState } from 'react';
import type { TaskTemplateWithTagsDTO } from '@/lib/schemas/task-template.schema';

export function useTaskTemplateList() {
    const [taskTemplateList, setTaskTemplateList] = useState<TaskTemplateWithTagsDTO[] | null>(
        null
    );
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
                setTaskTemplateList(body.data);
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTaskList();
    }, []);

    return {
        taskTemplateList,
        isLoading,
        error,
    };
}
