import { useEffect, useState } from 'react';
import type {
    TaskTemplateWithTagsDTO,
    TaskTemplatePreviewDTO,
} from '@/lib/schemas/task-template.schema';

export function useTaskTemplatePreview(selectedTaskTemplateId: string | null) {
    const [taskTemplatePreview, setTaskTemplatePreview] = useState<TaskTemplatePreviewDTO | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<Error | null>(null);

    useEffect(() => {
        if (!selectedTaskTemplateId) {
            setTaskTemplatePreview(null);
            setLoadError(null);
            return;
        }
        let isCancelled = false;
        setLoadError(null);
        setIsLoading(true);
        fetch(`/api/task-templates/${selectedTaskTemplateId}/preview`)
            .then((response) => {
                if (!response.ok) throw new Error('Failed to load preview');
                return response.json();
            })
            .then((responseData) => {
                if (!isCancelled) setTaskTemplatePreview(responseData.data);
            })
            .catch((err) => {
                if (!isCancelled) setLoadError(err instanceof Error ? err : new Error(String(err)));
            })
            .finally(() => {
                if (!isCancelled) setIsLoading(false);
            });
        return () => {
            isCancelled = true;
        };
    }, [selectedTaskTemplateId]);

    return { taskTemplatePreview, isLoading, error: loadError };
}

export function useTaskTemplateList() {
    const [taskTemplates, setTaskTemplates] = useState<TaskTemplateWithTagsDTO[] | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadError, setLoadError] = useState<Error | null>(null);
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
    const [listVersionKey, setListVersionKey] = useState(0);

    useEffect(() => {
        async function fetchTaskTemplates() {
            try {
                const response = await fetch(`/api/task-templates?page=${page}&limit=${limit}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to load task templates');
                }

                const responseData = await response.json();
                setTaskTemplates(responseData.data);
                setTotal(responseData.total ?? 0);
            } catch (err) {
                setLoadError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTaskTemplates();
    }, [limit, page, listVersionKey]);

    const refetchTaskTemplates = () => setListVersionKey((prev) => prev + 1);

    return {
        taskTemplates,
        total,
        limit,
        page,
        setLimit,
        setPage,
        isLoading,
        error: loadError,
        refetchTaskTemplates,
    };
}
