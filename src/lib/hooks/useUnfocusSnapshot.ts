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

// NOTE(laith): Creates an UNFOCUS snapshot only once, and waits till the candidate acknowledges the modal before
// sending another snapshot. This means that the candidate can unfocus their window multiple times and only get
// detected once.
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
