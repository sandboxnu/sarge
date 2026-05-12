import { useEffect, useState } from 'react';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';
import { getTaskTemplateList } from '@/lib/api/task-templates';

export type TaskTemplateSortBy = 'title-asc' | 'title-desc' | 'estimated-asc' | 'estimated-desc';

export function useTaskTemplateList() {
    const [allTaskTemplates, setAllTaskTemplates] = useState<TaskTemplateListItemDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState<string[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [sortBy, setSortBy] = useState<TaskTemplateSortBy | null>(null);

    function applySort(items: TaskTemplateListItemDTO[]): TaskTemplateListItemDTO[] {
        let sorted: TaskTemplateListItemDTO[] = items;
        if (sortBy) {
            sorted = [...items];
            switch (sortBy) {
                case 'title-asc':
                    sorted.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'title-desc':
                    sorted.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case 'estimated-asc':
                    sorted.sort((a, b) => a.estimatedTime - b.estimatedTime);
                    break;
                case 'estimated-desc':
                    sorted.sort((a, b) => b.estimatedTime - a.estimatedTime);
                    break;
            }
        }

        if (!selected || selected.length === 0) return sorted;
        const selectedSet = new Set(selected);
        const selectedItems = sorted.filter((item) => selectedSet.has(item.id));
        const unselectedItems = sorted.filter((item) => !selectedSet.has(item.id));
        return [...selectedItems, ...unselectedItems];
    }

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

    const handleSelectTask = (id: string) => {
        if (selected?.includes(id)) {
            setSelected(selected.filter((s) => s !== id));
        } else {
            setSelected([...(selected ?? []), id]);
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
        applySort,
    };
}
