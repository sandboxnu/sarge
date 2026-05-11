import { useEffect, useState } from 'react';
import { getTaskTemplateList } from '@/lib/api/task-templates';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';
import useSearch from '@/lib/hooks/useSearch';
import type { TaskTemplateSortBy } from '@/lib/hooks/useTaskTemplateList';

const PAGE_SIZE = 9;

export function useAddTaskModal(open: boolean) {
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [taskTemplates, setTaskTemplates] = useState<TaskTemplateListItemDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<TaskTemplateSortBy | null>(null);
    const search = useSearch('task-templates');
    const { reset: resetSearch } = search; // we need to pull out reset so we only run the effect when the modal opens, not when the user types
    const isSearching = search.value.trim().length >= 1;

    useEffect(() => {
        if (open) {
            setPage(0);
            resetSearch();
            setError(null);
            setSortBy(null);
        }
    }, [open, resetSearch]);

    // this is when we aren't searching so we fetch the paginated list
    useEffect(() => {
        if (!open || isSearching) return;

        let cancelled = false;

        async function fetchList() {
            try {
                setIsLoading(true);
                setError(null);
                const response = await getTaskTemplateList(page, PAGE_SIZE);

                if (!cancelled) {
                    setTaskTemplates(response.data);
                    setTotal(response.total);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchList();

        return () => {
            cancelled = true;
        };
    }, [open, page, isSearching]);

    // we set to 0 because we want to start from the first page
    // when we search (otherwise it would leave the user on a random page)
    useEffect(() => {
        setPage(0);
    }, [search.value]);

    function applySort(
        items: TaskTemplateListItemDTO[],
        sortBy: TaskTemplateSortBy | null
    ): TaskTemplateListItemDTO[] {
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
    }

    const sortedSearchData = applySort(search.data, sortBy);
    const sortedPage = applySort(taskTemplates, sortBy);

    const displayList = isSearching
        ? sortedSearchData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
        : sortedPage;

    const displayTotal = isSearching ? sortedSearchData.length : total;

    const hookError = error ?? search.error;

    return {
        displayList,
        displayTotal,
        isLoading: isLoading || search.loading,
        error: hookError,
        page,
        setPage,
        limit: PAGE_SIZE,
        searchQuery: search.value,
        handleSearchChange: search.onChange,
        isSearching,
        sortBy,
        setSortBy,
    };
}
