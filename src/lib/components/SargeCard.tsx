'use client';

import * as React from 'react';
import { FileText, MoreVertical } from 'lucide-react';

type SargeCardProps = {
    title: string;
    candidateCount: number;
    assessmentName: string;
    assignedCount?: number;
    submittedCount?: number;
    totalAssigned?: number;
    className?: string;
};

export default function SargeCard({
    title,
    candidateCount,
    assessmentName,
    assignedCount = 0,
    submittedCount = 0,
    totalAssigned = 0,
    className = '',
}: SargeCardProps) {
    return (
        <div
            role="region"
            aria-label={`${title} card`}
            className={`min-h-[160px] w-fit min-w-[367px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--card-foreground)] shadow-sm ${className} `}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 className="truncate font-sans text-[14px] leading-[18px] font-medium tracking-[0.406px] text-[var(--sarge-gray-800)]">
                        {title}
                    </h3>
                    <p className="font-sans text-[14px] leading-[18px] font-normal tracking-[0.406px] text-[var(--sarge-gray-600)]">
                        {candidateCount} {candidateCount === 1 ? 'candidate' : 'candidates'}
                    </p>
                </div>
                <div
                    aria-hidden
                    className="grid h-8 w-8 place-items-center text-[var(--sarge-gray-800)]"
                >
                    <MoreVertical className="h-5 w-5" />
                </div>
            </div>
            <div className="mt-4 w-full rounded-[8px] border border-[var(--sarge-gray-200)] bg-[var(--sarge-gray-0)] p-3">
                <div className="flex flex-col items-start gap-[10px]">
                    <div className="flex items-start gap-3">
                        <FileText
                            className="h-5 w-5 shrink-0 text-[var(--sarge-gray-600)]"
                            aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                            <div
                                className="truncate font-sans text-[14px] leading-[18px] font-medium tracking-[0.406px] text-[var(--sarge-gray-800)]"
                                title={assessmentName}
                            >
                                {assessmentName}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Chip>{assignedCount} assigned</Chip>
                        <Chip>
                            {submittedCount}/{totalAssigned} submissions
                        </Chip>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Chip({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-[6px] bg-[var(--sarge-gray-200)] px-2 py-1 text-[14px] leading-[18px] tracking-[0.406px] text-[var(--sarge-gray-600)]">
            {children}
        </span>
    );
}
