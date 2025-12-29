import { useEffect, useState } from 'react';
import type { CandidatePoolDisplayInfo } from '@/lib/types/position.types';
import type { AddCandidateWithDataDTO } from '@/lib/schemas/candidate-pool.schema';
import { toast } from 'sonner';

interface UseCandidatesReturn {
    candidates: CandidatePoolDisplayInfo[];
    loading: boolean;
    error: string | null;
    positionTitle: string | null;
    createCandidate: (candidate: AddCandidateWithDataDTO) => Promise<void>;
    batchCreateCandidates: (candidates: AddCandidateWithDataDTO[]) => Promise<void>;
}

export default function useCandidates(positionId: string): UseCandidatesReturn {
    const [candidates, setCandidates] = useState<CandidatePoolDisplayInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [positionTitle, setPositionTitle] = useState<string | null>(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/positions/${positionId}/candidates`);
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
            const response = await fetch(`/api/positions/${positionId}`);
            if (response.ok) {
                const data = await response.json();
                setPositionTitle(data.data?.title ?? null);
            }
        };

        if (positionId) {
            fetchPosition();
        }
    }, [positionId]);

    const createCandidate = async (candidate: AddCandidateWithDataDTO) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/positions/${positionId}/candidates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(candidate),
            });

            if (!response.ok) {
                throw new Error('Failed to create candidate');
            }
            const data = await response.json();
            setCandidates((prev) => [...prev, data.data]);
            toast.success('Candidate created successfully');
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            toast.error('Candidate creation failed');
        } finally {
            setLoading(false);
        }
    };

    const batchCreateCandidates = async (candidates: AddCandidateWithDataDTO[]) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/positions/${positionId}/candidates/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidates }),
            });

            if (!response.ok) {
                setError('Failed to batch create candidates');
                return;
            }
            const data = await response.json();
            setCandidates((prev) => [...prev, ...data.data.candidates]);
            toast.success('Candidates created successfully');
            setError(null);
        } catch {
            setError('Failed to batch create candidates');
            toast.error('Batch creation failed');
        } finally {
            setLoading(false);
        }
    };

    return {
        candidates,
        loading,
        error,
        positionTitle,
        createCandidate,
        batchCreateCandidates,
    };
}
