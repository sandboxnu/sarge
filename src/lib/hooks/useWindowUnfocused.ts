'use client';

import { useEffect, useRef, useState } from 'react';
import { SnapshotType } from '@/generated/prisma';
import { createCandidateSnapshot } from '@/lib/api/candidate-assessment';

export function useWindowUnfocused(assessmentId: string, taskId: string | null): boolean {
    const [isWindowUnfocused, setIsWindowUnfocused] = useState(false);
    const taskIdRef = useRef(taskId);
    useEffect(() => {
        taskIdRef.current = taskId;
    }, [taskId]);

    useEffect(() => {
        const getIsUnfocused = () => document.hidden || !document.hasFocus();

        const reportUnfocus = () => {
            const currentTaskId = taskIdRef.current;
            if (!currentTaskId) return;
            createCandidateSnapshot(assessmentId, currentTaskId, SnapshotType.UNFOCUS);
        };

        let wasUnfocused = getIsUnfocused();
        setIsWindowUnfocused(wasUnfocused);

        const handleChange = (next: boolean) => {
            if (next && !wasUnfocused) reportUnfocus();
            wasUnfocused = next;
            setIsWindowUnfocused(next);
        };

        const handleFocus = () => handleChange(getIsUnfocused());
        const handleBlur = () => handleChange(true);
        const handleVisibilityChange = () => handleChange(getIsUnfocused());

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [assessmentId]);

    return isWindowUnfocused;
}
