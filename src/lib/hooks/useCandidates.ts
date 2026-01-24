import { useEffect, useState } from 'react';
import { type ApplicationDisplayInfo } from '@/lib/types/position.types';
import { type AddApplicationWithCandidateDataDTO } from '@/lib/schemas/application.schema';
import { toast } from 'sonner';
import {
    getCandidates,
    getPosition,
    createCandidate as createCandidateApi,
    batchCreateCandidates as batchCreateCandidatesApi,
} from '@/lib/api/positions';

interface UseCandidatesReturn {
    candidates: ApplicationDisplayInfo[];
    loading: boolean;
    error: string | null;
    positionTitle: string | null;
    createCandidate: (candidate: AddApplicationWithCandidateDataDTO) => Promise<void>;
    batchCreateCandidates: (candidates: AddApplicationWithCandidateDataDTO[]) => Promise<void>;
}

export default function useCandidates(positionId: string): UseCandidatesReturn {
    const [candidates, setCandidates] = useState<ApplicationDisplayInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [positionTitle, setPositionTitle] = useState<string | null>(null);

    useEffect(() => {
        if (!positionId) return;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const [candidatesData, positionData] = await Promise.all([
                    getCandidates(positionId),
                    getPosition(positionId),
                ]);

                setCandidates(candidatesData);
                setPositionTitle(positionData.title);
            } catch (err) {
                const message = (err as Error).message;
                setError(message);
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [positionId]);

    const createCandidate = async (candidate: AddApplicationWithCandidateDataDTO) => {
        try {
            setLoading(true);
            setError(null);

            const created = await createCandidateApi(positionId, candidate);

            setCandidates((prev) => [...prev, created]);
            toast.success('Candidate created successfully');
        } catch (err) {
            const message = (err as Error).message;
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const batchCreateCandidates = async (candidates: AddApplicationWithCandidateDataDTO[]) => {
        try {
            setLoading(true);
            setError(null);

            const created = await batchCreateCandidatesApi(positionId, candidates);

            setCandidates((prev) => [...prev, ...created.candidates]);
            toast.success('Candidates created successfully');
        } catch (err) {
            const message = (err as Error).message;
            // TODO (design question): do we want to toast here?
            setError(message);
            toast.error(message);
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
