'use client';

import { type PropsWithChildren } from 'react';
import { usePreventHighlight } from '@/lib/hooks/usePreventHighlight';

type HighlightGuardProps = PropsWithChildren<{
    className?: string;
}>;

export function HighlightGuard({ children, className }: HighlightGuardProps) {
    const containerRef = usePreventHighlight<HTMLDivElement>();

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
