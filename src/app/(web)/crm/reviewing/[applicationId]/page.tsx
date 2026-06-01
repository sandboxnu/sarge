'use client';
import { use } from 'react';
import useApplicationReview from '@/lib/hooks/useApplicationReview';

export default function ReviewingPage({ params }: { params: Promise<{ applicationId: string }> }) {
    const { applicationId } = use(params);
    const { application, loading, error } = useApplicationReview(applicationId);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <div>{application?.id}</div>;
}
