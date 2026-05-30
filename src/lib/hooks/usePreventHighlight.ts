'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { SnapshotType } from '@/generated/prisma';
import { createCandidateSnapshot } from '@/lib/api/candidate-assessment';

const TOAST_COOLDOWN_MS = 5000; // 5 seconds
const HIGHLIGHT_MESSAGE = 'Highlighting is not allowed.';

function usePreventHighlight<T extends HTMLElement>(assessmentId: string, taskId: string | null) {
    const containerRef = useRef<T | null>(null);
    const lastToastAtRef = useRef(0);
    const taskIdRef = useRef(taskId);
    useEffect(() => {
        taskIdRef.current = taskId;
    }, [taskId]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const snapshotHighlight = () => {
            const currentTaskId = taskIdRef.current;
            if (!currentTaskId) return;
            createCandidateSnapshot(assessmentId, currentTaskId, SnapshotType.HIGHLIGHT);
        };

        const showToast = () => {
            const now = Date.now();
            if (now - lastToastAtRef.current < TOAST_COOLDOWN_MS) return;

            lastToastAtRef.current = now;

            toast.error(HIGHLIGHT_MESSAGE);
        };

        const clearSelection = () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) return;

            selection.removeAllRanges();
        };

        const handleSelectStart = (event: Event) => {
            event.preventDefault();
            clearSelection();
            showToast();
            snapshotHighlight();
        };

        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const startNode = range.startContainer;
            const endNode = range.endContainer;

            if (!container.contains(startNode) && !container.contains(endNode)) return;

            clearSelection();
            showToast();
            snapshotHighlight();
        };

        container.addEventListener('selectstart', handleSelectStart);
        document.addEventListener('selectionchange', handleSelectionChange);

        return () => {
            container.removeEventListener('selectstart', handleSelectStart);
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [assessmentId]);

    return containerRef;
}

export { usePreventHighlight };
