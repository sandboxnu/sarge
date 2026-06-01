'use client';
import { use } from 'react';
import useApplicationReview from '@/lib/hooks/useApplicationReview';

export default function ReviewApplication({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { application, loading, error } = useApplicationReview(id);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <div>{application?.id}</div>;
}
