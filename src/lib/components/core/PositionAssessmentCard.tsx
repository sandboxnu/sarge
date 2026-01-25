'use client';

import * as React from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';

type PositionAssessmentCardProps = {
    children: React.ReactNode;
    className?: string;
    iconClassName?: string;
    onClick?: () => void;
};

export function PositionAssessmentCard({
    children,
    className,
    iconClassName,
    onClick,
}: PositionAssessmentCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'border-sarge-gray-200 bg-sarge-gray-0',
                'inline-flex items-center gap-2.5 rounded-lg border p-2',
                'overflow-hidden',
                'transition-colors',
                className
            )}
        >
            <FileText className={cn('text-sarge-gray-600 h-5 w-5 shrink-0', iconClassName)} />
            <div className="flex min-w-0 items-center gap-1.5">{children}</div>
        </button>
    );
}
