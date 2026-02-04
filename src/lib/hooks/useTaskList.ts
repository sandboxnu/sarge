import { useEffect, useState } from 'react';
import type {
    TaskTemplateWithTagsDTO,
    TaskTemplatePreviewDTO,
} from '@/lib/schemas/task-template.schema';
import { getTaskList, getTaskTemplatePreview } from '@/lib/api/task-templates';

export function useTaskTemplatePreview(selectedTaskTemplateId: string | null) {
    const [taskTemplatePreview, setTaskTemplatePreview] = useState<TaskTemplatePreviewDTO | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!selectedTaskTemplateId) {
            setTaskTemplatePreview(null);
            setError(null);
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        const taskTemplateId = selectedTaskTemplateId;
        setIsLoading(true);
        setError(null);

        async function fetchPreview() {
            try {
                const data = await getTaskTemplatePreview(taskTemplateId);
                if (!cancelled) setTaskTemplatePreview(data);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        fetchPreview();

        return () => {
            cancelled = true;
        };
    }, [selectedTaskTemplateId]);

    return { taskTemplatePreview, isLoading, error };
}

export function useTaskTemplateList() {
    const [allTaskTemplates, setAllTaskTemplates] = useState<TaskTemplateWithTagsDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState<number[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        async function fetchTaskList() {
            try {
                const response = await getTaskList(page, limit);

                updateTemplatesForPage(page, limit, response.data);
                setTotal(response.total);
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTaskList();
    }, [limit, page]);

    const taskTemplateList = allTaskTemplates.slice(page * limit, (page + 1) * limit);

    const updateTemplatesForPage = (
        pageNum: number,
        limitNum: number,
        newData: TaskTemplateWithTagsDTO[]
    ) => {
        setAllTaskTemplates((prev) => {
            const startIdx = pageNum * limitNum;
            const updated = [...prev];
            updated.splice(startIdx, limitNum, ...newData);
            return updated;
        });
    };

    const handleSelectTask = (index: number) => {
        const absoluteIndex = page * limit + index;
        if (selected?.includes(absoluteIndex)) {
            setSelected(selected.filter((idx) => idx !== absoluteIndex));
        } else {
            setSelected([...(selected ?? []), absoluteIndex]);
        }
    };

    return {
        taskTemplateList,
        limit,
        page,
        setLimit,
        setPage,
        selected,
        isLoading,
        error,
        handleSelectTask,
        total,
    };
}
