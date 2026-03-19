'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const TOAST_COOLDOWN_MS = 5000; // 5 seconds
const HIGHLIGHT_MESSAGE = 'Highlighting is not allowed.';

function usePreventHighlight<T extends HTMLElement>() {
    const containerRef = useRef<T | null>(null);
    const lastToastAtRef = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

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
        };

        container.addEventListener('selectstart', handleSelectStart);
        document.addEventListener('selectionchange', handleSelectionChange);

        return () => {
            container.removeEventListener('selectstart', handleSelectStart);
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    return containerRef;
}

export { usePreventHighlight };
