import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function usePositionApplications(
    positionId: string | null,
    currentApplicationId: string
) {
    const router = useRouter();
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

    const goToApplication = (applicationId: string) =>
        router.push(`/crm/reviewing/position/${positionId}/application/${applicationId}`);

    const currentIndex = applications.findIndex((a) => a.id === currentApplicationId);
    const total = applications.length;

    // NOTE(laith): just like in go[Prev/Next]Task, this is also a ring buffer implementation for now
    const goPrevApplication = () => {
        if (total === 0 || currentIndex < 0) return;
        goToApplication(applications[(currentIndex - 1 + total) % total].id);
    };
    const goNextApplication = () => {
        if (total === 0 || currentIndex < 0) return;
        goToApplication(applications[(currentIndex + 1) % total].id);
    };

    return { applications, loading, error, goToApplication, goPrevApplication, goNextApplication };
}
