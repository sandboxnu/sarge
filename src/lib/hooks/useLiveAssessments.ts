'use client';

import { useCallback, useEffect, useState } from 'react';
import { getLiveAssessments } from '@/lib/api/positions';
import { useSession } from '@/lib/auth/auth-client';
import { type LiveAssessmentSummary } from '@/lib/types/reviewing.types';

/**
 * Fetches every position in the active org that has an assessment attached, with its review
 * progress rolled up, for the Live Assessments dashboard.
 */
export default function useLiveAssessments() {
    const { data: session } = useSession();
    const activeOrganizationId = session?.session.activeOrganizationId;

    const [liveAssessments, setLiveAssessments] = useState<LiveAssessmentSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLiveAssessments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setLiveAssessments(await getLiveAssessments());
        } catch (err) {
            setError((err as Error).message);
            setLiveAssessments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!activeOrganizationId) return;
        fetchLiveAssessments();
    }, [activeOrganizationId, fetchLiveAssessments]);

    return { liveAssessments, loading, error, refetch: fetchLiveAssessments };
}
