import { useEffect, useState } from 'react';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';
import { getTaskList } from '@/lib/api/task-templates';

export function useTaskTemplateList() {
    const [allTaskTemplates, setAllTaskTemplates] = useState<TaskTemplateListItemDTO[]>([]);
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
        newData: TaskTemplateListItemDTO[]
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
