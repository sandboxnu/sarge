'use client';

import { type PropsWithChildren } from 'react';
import { usePreventHighlight } from '@/lib/hooks/usePreventHighlight';

type HighlightGuardProps = PropsWithChildren<{
    assessmentId: string;
    taskId: string | null;
    className?: string;
}>;

export function HighlightGuard({
    children,
    className,
    assessmentId,
    taskId,
}: HighlightGuardProps) {
    const containerRef = usePreventHighlight<HTMLDivElement>(assessmentId, taskId);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
