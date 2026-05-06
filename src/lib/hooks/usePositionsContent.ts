'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { type PositionWithCounts } from '@/lib/types/position.types';
import { useSession } from '@/lib/auth/auth-client';
import { archivePosition, deletePosition, getPositions } from '@/lib/api/positions';

function usePositionContent() {
    const { data: session } = useSession();
    const activeOrganizationId = session?.session.activeOrganizationId;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

                const positions = await getPositions();

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
        if (typeof window === 'undefined') {
            return;
        }

        window.open(`/crm/positions/${positionId}`, '_blank', 'noopener,noreferrer');
    }

    async function onArchive(positionId: string) {
        try {
            await archivePosition(positionId);
            setActive((prev) => {
                const target = prev.find((p) => p.id === positionId);
                if (target) {
                    setArchived((prevArchived) => [...prevArchived, { ...target, archived: true }]);
                }
                return prev.filter((p) => p.id !== positionId);
            });
        } catch (err) {
            toast.error(`Failed to archive position: ${(err as Error).message}`);
        }
    }

    async function onDelete(positionId: string) {
        try {
            await deletePosition(positionId);
            setActive((prev) => prev.filter((p) => p.id !== positionId));
            setArchived((prev) => prev.filter((p) => p.id !== positionId));
        } catch (err) {
            toast.error(`Failed to delete position: ${(err as Error).message}`);
        }
    }

    return {
        isCreateModalOpen,
        setIsCreateModalOpen,
        active,
        archived,
        setActive,
        setArchived,
        handlePositionClick,
        onArchive,
        onDelete,
        error,
        loading,
    };
}

export default usePositionContent;
