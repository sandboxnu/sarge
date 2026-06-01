import { useEffect, useState } from 'react';
import { getApplicationForReview } from '@/lib/api/applications';
import { type ApplicationWithReviewData } from '@/lib/types/position.types';

interface UseApplicationReviewReturn {
    application: ApplicationWithReviewData | null;
    loading: boolean;
    error: string | null;
}

/**
 * Fetches a single application's full review tree (assessment + tasks + reviews + snapshots)
 * for the reviewing page.
 */
export default function useApplicationReview(
    applicationId: string | null
): UseApplicationReviewReturn {
    const [application, setApplication] = useState<ApplicationWithReviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!applicationId) {
            setError('Missing application id');
            setLoading(false);
            return;
        }

        async function fetchApplicationReview() {
            try {
                setLoading(true);
                setError(null);
                const data = await getApplicationForReview(applicationId as string);
                setApplication(data);
            } catch (err) {
                setError((err as Error).message);
                setApplication(null);
            } finally {
                setLoading(false);
            }
        }

        fetchApplicationReview();
    }, [applicationId]);

    return { application, loading, error };
}
