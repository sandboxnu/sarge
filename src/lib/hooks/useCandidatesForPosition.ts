import { useEffect, useState } from 'react';
import type { CandidatePoolDisplayInfo } from '@/lib/types/position.types';

interface UseCandidatesReturn {
    candidates: CandidatePoolDisplayInfo[];
    loading: boolean;
    error: string | null;
}

export default function useCandidates(
    positionId: string
): UseCandidatesReturn {
    const [candidates, setCandidates] = useState<CandidatePoolDisplayInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `/api/position/${positionId}/candidates`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch candidates');
                }
                const data = await response.json();
                setCandidates(data.data ?? []);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        };

        if (positionId) {
            fetchCandidates();
        }
    }, [positionId]);

    return { candidates, loading, error };
}
