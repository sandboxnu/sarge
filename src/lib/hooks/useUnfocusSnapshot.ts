'use client';

import { useEffect, useRef } from 'react';
import { SnapshotType } from '@/generated/prisma';
import { createCandidateSnapshot } from '@/lib/api/candidate-assessment';

type UseUnfocusSnapshotArgs = {
    assessmentId: string;
    taskId: string | null;
    isWindowUnfocused: boolean;
    isModalOpen: boolean;
};

// Fires one UNFOCUS snapshot per focused→unfocused transition. Suppressed
// while the modal is open so repeated alt-tabs don't pile up snapshots
// until the candidate acknowledges.
export function useUnfocusSnapshot({
    assessmentId,
    taskId,
    isWindowUnfocused,
    isModalOpen,
}: UseUnfocusSnapshotArgs) {
    const wasUnfocusedRef = useRef(false);

    useEffect(() => {
        const prevWasUnfocused = wasUnfocusedRef.current;
        wasUnfocusedRef.current = isWindowUnfocused;
        if (!isWindowUnfocused || prevWasUnfocused) return;
        if (isModalOpen) return;
        if (!taskId) return;
        createCandidateSnapshot(assessmentId, taskId, SnapshotType.UNFOCUS);
    }, [assessmentId, taskId, isWindowUnfocused, isModalOpen]);
}
