'use client';

import { cn } from '@/lib/utils/cn.utils';

type StatusVariant = 'success' | 'warning' | 'neutral';

export interface StatusBoxProps {
    label: string;
    status: string;
    variant?: StatusVariant;
}

const STATUS_STYLES: Record<StatusVariant, string> = {
    success: 'bg-sarge-success-100 text-sarge-success-800',
    warning: 'bg-sarge-warning-100 text-sarge-warning-700',
    neutral: 'bg-sarge-gray-100 text-sarge-gray-700',
};

export default function StatusBox({ label, status, variant = 'neutral' }: StatusBoxProps) {
    return (
        <div className="border-sarge-gray-200 bg-sarge-gray-0 flex flex-1 flex-col gap-2 rounded-lg border p-3">
            <span className="text-label-xs text-sarge-gray-500 leading-[18px]">{label}</span>
            <span
                className={cn('text-label-xs w-fit rounded-lg px-2 py-1', STATUS_STYLES[variant])}
            >
                {status}
            </span>
        </div>
    );
}
