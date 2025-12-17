import { useState } from 'react';
import { type PositionWithCounts } from '@/lib/types/position.types';

function usePositionContent() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);

    const archived: PositionWithCounts[] = [];

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
        archived,
        handlePositionClick,
    };
}

export default usePositionContent;
