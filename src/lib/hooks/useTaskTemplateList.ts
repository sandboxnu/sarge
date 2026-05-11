import { useCallback, useEffect, useState } from 'react';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';
import { getTaskTemplateList } from '@/lib/api/task-templates';

export type TaskTemplateSortBy =
    | 'title-asc'
    | 'title-desc'
    | 'estimated-asc'
    | 'estimated-desc';

export function useTaskTemplateList() {
    const [allTaskTemplates, setAllTaskTemplates] = useState<TaskTemplateListItemDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState<number[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [sortBy, setSortBy] = useState<TaskTemplateSortBy | null>(null);

    const sortAndFilter = useCallback(
        (items: TaskTemplateListItemDTO[]): TaskTemplateListItemDTO[] => {
            if (!sortBy) return items;
            const next = [...items];
            switch (sortBy) {
                case 'title-asc':
                    next.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'title-desc':
                    next.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case 'estimated-asc':
                    next.sort((a, b) => a.estimatedTime - b.estimatedTime);
                    break;
                case 'estimated-desc':
                    next.sort((a, b) => b.estimatedTime - a.estimatedTime);
                    break;
            }
            return next;
        },
        [sortBy]
    );

    useEffect(() => {
        async function fetchTaskList() {
            try {
                setIsLoading(true);
                setError(null);
                const response = await getTaskTemplateList(page, limit);

                updateTaskTemplatesForPage(page, limit, response.data);
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

    const updateTaskTemplatesForPage = (
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

    const updatePageTemplates = async () => {
        setError(null);
        const response = await getTaskTemplateList(page, limit);
        updateTaskTemplatesForPage(page, limit, response.data);
        setTotal(response.total);
    };

    const insertTaskTemplateAtTopOfPage = (taskTemplate: TaskTemplateListItemDTO) => {
        const startIdx = page * limit;

        setAllTaskTemplates((prev) => {
            const currentPageItems = prev.slice(startIdx, startIdx + limit);
            const nextPageItems =
                currentPageItems.length >= limit
                    ? [taskTemplate, ...currentPageItems.slice(0, limit - 1)]
                    : [taskTemplate, ...currentPageItems];

            const updated = [...prev];
            updated.splice(startIdx, currentPageItems.length, ...nextPageItems);
            return updated;
        });

        setTotal((prev) => prev + 1);
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
        updatePageTemplates,
        insertTaskTemplateAtTopOfPage,
        sortBy,
        setSortBy,
        sortAndFilter,
    };
}
