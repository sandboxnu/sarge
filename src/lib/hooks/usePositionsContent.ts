'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { type PositionWithCounts } from '@/lib/types/position.types';
import { useSession } from '@/lib/auth/auth-client';
import {
    archivePosition,
    deletePosition,
    getPositions,
    unarchivePosition,
} from '@/lib/api/positions';

export type PositionSortBy = 'title-asc' | 'title-desc' | 'created-desc' | 'created-asc';

function usePositionContent() {
    const { data: session } = useSession();
    const activeOrganizationId = session?.session.activeOrganizationId;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [active, setActive] = useState<PositionWithCounts[]>([]);
    const [archived, setArchived] = useState<PositionWithCounts[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [sortBy, setSortBy] = useState<PositionSortBy | null>(null);

    function applySort(items: PositionWithCounts[]): PositionWithCounts[] {
        if (!sortBy) return items;
        const sortedPositions = [...items];
        switch (sortBy) {
            case 'title-asc':
                sortedPositions.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                sortedPositions.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'created-desc':
                sortedPositions.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                break;
            case 'created-asc':
                sortedPositions.sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
                break;
        }
        return sortedPositions;
    }

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
            const target = active.find((p) => p.id === positionId);
            if (target) {
                setActive((prev) => prev.filter((p) => p.id !== positionId));
                setArchived((prev) => [...prev, { ...target, archived: true }]);
            }
            toast.success('Position archived successfully');
        } catch (err) {
            toast.error(`Position failed to archive: ${(err as Error).message}`);
        }
    }

    async function onUnarchive(positionId: string) {
        try {
            await unarchivePosition(positionId);
            const target = archived.find((p) => p.id === positionId);
            if (target) {
                setArchived((prev) => prev.filter((p) => p.id !== positionId));
                setActive((prev) => [...prev, { ...target, archived: false }]);
            }
            toast.success('Position unarchived successfully');
        } catch (err) {
            toast.error(`Position failed to unarchive: ${(err as Error).message}`);
        }
    }

    async function onDelete(positionId: string) {
        try {
            await deletePosition(positionId);
            const target = active.find((p) => p.id === positionId);
            if (target) {
                setActive((prev) => prev.filter((p) => p.id !== positionId));
                setArchived((prev) => prev.filter((p) => p.id !== positionId));
            }
            toast.success('Position deleted successfully');
        } catch (err) {
            toast.error(`Position failed to delete: ${(err as Error).message}`);
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
        onUnarchive,
        onDelete,
        error,
        loading,
        sortBy,
        setSortBy,
        applySort,
    };
}

export default usePositionContent;
