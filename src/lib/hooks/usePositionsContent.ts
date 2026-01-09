'use client';

import { useState, useEffect } from 'react';
import { type PositionWithCounts } from '@/lib/types/position.types';
import { useSession } from '@/lib/auth/auth-client';
import { getPositionsByOrgId } from '@/lib/api/positions';

function usePositionContent() {
    const { data: session } = useSession();
    const activeOrganizationId = session?.session.activeOrganizationId;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
    const [active, setActive] = useState<PositionWithCounts[]>([]);
    const [archived, setArchived] = useState<PositionWithCounts[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchPositions() {
            try {
                if (!activeOrganizationId) {
                    return;
                }

                setLoading(true);

                const positions = await getPositionsByOrgId(activeOrganizationId);

                const activePositions = positions.filter((pos) => !pos.archived);
                const archivedPositions = positions.filter((pos) => pos.archived);

                setActive(activePositions);
                setArchived(archivedPositions);
            } catch (err) {
                const message = err as Error;
                setError(message);
            } finally {
                setLoading(false);
            }
        }

        fetchPositions();
    }, [activeOrganizationId]);

    function handlePositionClick(positionId: string) {
        setSelectedPositionId(positionId);
        setIsPreviewModalOpen(true);
    }

    return {
        isCreateModalOpen,
        setIsCreateModalOpen,
        isPreviewModalOpen,
        setIsPreviewModalOpen,
        selectedPositionId,
        setSelectedPositionId,
        active,
        archived,
        setActive,
        setArchived,
        handlePositionClick,
        error,
        loading,
    };
}

export default usePositionContent;
