import { useMemo, useState } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';

export interface UseSearchConfig<T> {
    data: T[];
    keys: (keyof T | string)[];
    threshold?: number;
    minMatchCharLength?: number;
}

export interface UseSearchResult<T> {
    query: string;
    setQuery: (query: string) => void;
    results: T[];
    resultCount: number;
    totalCount: number;
}

export function useSearch<T>({
    data,
    keys,
    threshold = 0.3,
    minMatchCharLength = 1,
}: UseSearchConfig<T>): UseSearchResult<T> {
    const [query, setQuery] = useState('');

    const fuse = useMemo(() => {
        const options: IFuseOptions<T> = {
            keys: keys as string[],
            threshold,
            minMatchCharLength,
            includeScore: true,
            ignoreLocation: true,
        };
        return new Fuse(data, options);
    }, [data, keys, threshold, minMatchCharLength]);

    const results = useMemo(() => {
        if (!query.trim()) {
            return data;
        }
        const fuseResults = fuse.search(query);
        return fuseResults.map((result) => result.item);
    }, [query, fuse, data]);

    return {
        query,
        setQuery,
        results,
        resultCount: results.length,
        totalCount: data.length,
    };
}
