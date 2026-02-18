import { useEffect, useState } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { searchTaskTemplates } from '@/lib/api/task-templates';
import { searchAssessmentTemplates } from '@/lib/api/assessment-templates';
import { searchApplications } from '@/lib/api/applications';
import { searchPositions } from '@/lib/api/positions';
import { type Application } from '@/generated/prisma';
import { type PositionWithCounts } from '@/lib/types/position.types';
import { type TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';
import { type AssessmentTemplateListItemDTO } from '@/lib/schemas/assessment-template.schema';

export type SearchType = 'task-templates' | 'assessment-templates' | 'positions' | 'applications';

type SearchTypeFunctionMap = {
    'task-templates': TaskTemplateListItemDTO;
    'assessment-templates': AssessmentTemplateListItemDTO;
    positions: PositionWithCounts;
    applications: Application;
};

const SEARCH_FUNCTION_MAP: {
    [K in keyof SearchTypeFunctionMap]: (query: string) => Promise<SearchTypeFunctionMap[K][]>;
} = {
    'task-templates': searchTaskTemplates,
    'assessment-templates': searchAssessmentTemplates,
    positions: searchPositions,
    applications: searchApplications,
};

export default function useSearch<T extends SearchType>(type: T) {
    const [query, setQuery] = useState('');
    const [data, setData] = useState<SearchTypeFunctionMap[T][]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const debouncedQuery = useDebounce(query, 500);

    const isSearchPending = query.trim().length >= 1 && query !== debouncedQuery;

    useEffect(() => {
        if (debouncedQuery.length < 1) {
            setData([]);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        SEARCH_FUNCTION_MAP[type](debouncedQuery)
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [debouncedQuery, type]);

    return {
        value: query,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
        data,
        loading: loading || isSearchPending,
        error,
    };
}
