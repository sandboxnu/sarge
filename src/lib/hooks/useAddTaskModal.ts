import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { getTaskTemplateList, searchTaskTemplates } from '@/lib/api/task-templates';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';

const PAGE_SIZE = 9;

export function useAddTaskModal(open: boolean) {
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [taskTemplates, setTaskTemplates] = useState<TaskTemplateListItemDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, 500);

    const isSearching = debouncedQuery.trim().length >= 1;
    const isSearchPending = searchQuery.trim().length >= 1 && searchQuery !== debouncedQuery;

    const [searchResults, setSearchResults] = useState<TaskTemplateListItemDTO[]>([]);

    useEffect(() => {
        if (open) {
            setPage(0);
            setSearchQuery('');
            setSearchResults([]);
            setError(null);
        }
    }, [open]);

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
                    setError(err as Error);
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

    // this is when we are searching so we fetch the search results and paginate client side
    useEffect(() => {
        if (!open || !isSearching) {
            setSearchResults([]);
            return;
        }

        let cancelled = false;

        async function fetchSearch() {
            try {
                setIsLoading(true);
                setError(null);
                const results = await searchTaskTemplates(debouncedQuery);

                if (!cancelled) {
                    setSearchResults(results);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err as Error);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchSearch();

        return () => {
            cancelled = true;
        };
    }, [open, debouncedQuery, isSearching]);

    // we set to 0 because we want to start from the first page
    // when we search (otherwise it would leave the user on a random page)
    useEffect(() => {
        setPage(0);
    }, [debouncedQuery]);

    const displayList = useMemo(() => {
        if (isSearching) {
            return searchResults.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
        }
        return taskTemplates;
    }, [isSearching, searchResults, taskTemplates, page]);

    const displayTotal = isSearching ? searchResults.length : total;

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    return {
        displayList,
        displayTotal,
        isLoading: isLoading || isSearchPending,
        error,
        page,
        setPage,
        limit: PAGE_SIZE,
        searchQuery,
        handleSearchChange,
        isSearching,
    };
}
