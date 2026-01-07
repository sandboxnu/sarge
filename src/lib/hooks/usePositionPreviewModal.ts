'use client';

import { useEffect, useState, useTransition } from 'react';
import { getPositionPreview } from '@/lib/api/positions';

export type PositionPreviewData = Awaited<ReturnType<typeof getPositionPreview>>;

interface UsePositionPreviewModalArgs {
    open: boolean;
    positionId: string | null;
}

export function usePositionPreviewModal({ open, positionId }: UsePositionPreviewModalArgs) {
    const [position, setPosition] = useState<PositionPreviewData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!open || !positionId) {
            setPosition(null);
            setError(null);
            return;
        }

        startTransition(async () => {
            try {
                const data = await getPositionPreview(positionId);
                setPosition(data);
                setError(null);
            } catch {
                setError('Failed to load position details');
            }
        });
    }, [open, positionId]);

    const openFullPosition = () => {
        if (positionId) {
            window.open(`/crm/positions/${positionId}`, '_blank');
        }
    };

    return {
        position,
        error,
        isPending,
        openFullPosition,
    };
}
