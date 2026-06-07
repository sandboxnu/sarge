import { useEffect, useState } from 'react';
import { getCandidates } from '@/lib/api/positions';
import { AssessmentStatus } from '@/generated/prisma';

export type ReviewableApplication = {
    id: string;
    candidateName: string;
};

const REVIEWABLE_STATUSES: AssessmentStatus[] = [
    AssessmentStatus.SUBMITTED,
    AssessmentStatus.GRADED,
];

export default function usePositionApplications(positionId: string | null) {
    const [applications, setApplications] = useState<ReviewableApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!positionId) {
            setError('Missing position id');
            setLoading(false);
            return;
        }

        async function fetchPositionApplications() {
            try {
                setLoading(true);
                setError(null);
                const all = await getCandidates(positionId as string);
                const reviewable = all
                    .filter((application) =>
                        REVIEWABLE_STATUSES.includes(application.assessmentStatus)
                    )
                    .map((application) => ({
                        id: application.id,
                        candidateName: application.candidate.name,
                    }));
                setApplications(reviewable);
            } catch (err) {
                setError((err as Error).message);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPositionApplications();
    }, [positionId]);

    return { applications, loading, error };
}
