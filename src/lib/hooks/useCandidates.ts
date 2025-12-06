import { useEffect, useState } from 'react';
import type { CandidatePoolDisplayInfo } from '@/lib/types/position.types';

interface UseCandidatesReturn {
    candidates: CandidatePoolDisplayInfo[];
    loading: boolean;
    error: string | null;
    positionTitle: string | null;
    getStatusBadgeColor: (status: string) => string;
    ensureAbsoluteUrl: (url: string) => string;
}

const getStatusBadgeColor = (status: string) => {
    if (status === 'ACCEPTED' || status === 'SUBMITTED') {
        return 'bg-sarge-success-100 text-sarge-success-800';
    }
    if (status === 'REJECTED' || status === 'EXPIRED') {
        return 'bg-sarge-error-200 text-sarge-error-700';
    }
    if (status === 'ASSIGNED') {
        return 'bg-sarge-warning-100 text-sarge-warning-500';
    }
    if (status === 'GRADED') {
        return 'bg-sarge-primary-200 text-sarge-primary-700';
    }
    return 'bg-sarge-gray-200 text-sarge-gray-600';
};

const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

export default function useCandidates(positionId: string): UseCandidatesReturn {
    const [candidates, setCandidates] = useState<CandidatePoolDisplayInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [positionTitle, setPositionTitle] = useState<string | null>(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/position/${positionId}/candidates`);
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

    useEffect(() => {
        const fetchPosition = async () => {
            const response = await fetch(`/api/position/${positionId}`);
            if (response.ok) {
                const data = await response.json();
                setPositionTitle(data.data?.title ?? null);
            }
        };

        if (positionId) {
            fetchPosition();
        }
    }, [positionId]);

    return { candidates, loading, error, positionTitle, getStatusBadgeColor, ensureAbsoluteUrl };
}
