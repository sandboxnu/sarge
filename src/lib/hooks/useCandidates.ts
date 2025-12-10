import { useEffect, useState } from 'react';
import type { CandidatePoolDisplayInfo } from '@/lib/types/position.types';

interface UseCandidatesReturn {
    candidates: CandidatePoolDisplayInfo[];
    loading: boolean;
    error: string | null;
    positionTitle: string | null;
    ensureAbsoluteUrl: (url: string) => string;
    createCandidate: (
        fullName: string,
        email: string,
        major: string,
        graduationYear: string,
        resume: string,
        linkedin: string,
        github: string
    ) => Promise<void>;
}

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

    const createCandidate = async (
        fullName: string,
        major: string,
        email: string,
        graduationDate: string,
        resume: string,
        linkedin: string,
        github: string
    ) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/position/${positionId}/candidates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fullName,
                    email,
                    major,
                    graduationDate,
                    resumeUrl: resume,
                    linkedinUrl: linkedin,
                    githubUrl: github,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create candidate');
            }
            const data = await response.json();
            setCandidates((prev) => [...prev, data.data]);
            setError(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        candidates,
        loading,
        error,
        positionTitle,
        getStatusBadgeColor,
        ensureAbsoluteUrl,
        createCandidate,
    };
}
