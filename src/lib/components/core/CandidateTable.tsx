'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { LinkButton } from '@/lib/components/ui/LinkButton';

import { DataTable } from '@/lib/components/ui/DataTable';
import type { ApplicationDisplayInfo } from '@/lib/types/position.types';
import { PositionAssessmentCard } from '@/lib/components/core/PositionAssessmentCard';
import { cn } from '@/lib/utils/cn.utils';
import { getStatusBadgeColor } from '@/lib/utils/status.utils';

interface CandidateTableProps {
    candidates: ApplicationDisplayInfo[];
}

const getAssessmentLabel = (status?: string) => {
    const s = (status ?? '').toUpperCase();
    if (s === 'GRADED') return 'Graded';
    if (s === 'SUBMITTED') return 'Submitted';
    if (s === 'NOT_STARTED') return 'Not started';
    if (s === 'NOT_ASSIGNED') return 'Not assigned';
    if (s === 'EXPIRED') return 'Expired';
    return status ?? 'N/A';
};

const formatDecisionLabel = (status?: string) => {
    if (!status) return 'Pending';
    return status
        .toLowerCase()
        .split('_')
        .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
        .join(' ');
};

const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

const getLinkLabel = (url: string, fallback: string) => {
    if (!url) return fallback;
    try {
        const cleaned = url.split('?')[0]?.split('#')[0] ?? '';
        const lastSegment = cleaned.split('/').filter(Boolean).pop();
        if (lastSegment) return decodeURIComponent(lastSegment);
        return fallback;
    } catch {
        return fallback;
    }
};

const HeaderLabel = ({ children }: { children: string }) => (
    <span className="text-body-s text-sarge-gray-700 font-normal tracking-[0.406px] normal-case">
        {children}
    </span>
);

const chipPaddingClass = 'px-2 py-1';

export function CandidateTable({ candidates }: CandidateTableProps) {
    const columns = useMemo<ColumnDef<ApplicationDisplayInfo>[]>(
        () => [
            {
                accessorKey: 'candidate.name',
                header: () => <HeaderLabel>NAME/MAJOR</HeaderLabel>,
                cell: ({ row }) => (
                    <div className="flex flex-col gap-1">
                        <span className="text-body-s text-sarge-gray-800 font-normal tracking-[0.406px]">
                            {row.original.candidate.name}
                        </span>
                        <span className="text-body-xs text-sarge-gray-800 font-normal tracking-[0.406px]">
                            {row.original.candidate.major ?? '—'}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'candidate.gradYear',
                header: () => <HeaderLabel>GRAD YEAR</HeaderLabel>,
                cell: ({ row }) => {
                    const grad = row.original.candidate.graduationDate ?? '—';
                    return (
                        <span className="text-body-s text-sarge-gray-800 font-normal tracking-[0.406px]">
                            {grad}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'assessmentStatus',
                header: () => <HeaderLabel>ASSESSMENT</HeaderLabel>,
                cell: ({ row }) => {
                    const hasAssessmentStatus = Boolean(row.original.assessmentStatus);
                    if (!hasAssessmentStatus) {
                        return <span className="text-body-s text-sarge-gray-600">N/A</span>;
                    }

                    const assessmentStatus = row.original.assessmentStatus;
                    const label = getAssessmentLabel(assessmentStatus);
                    return (
                        <PositionAssessmentCard
                            onClick={() => undefined}
                            className="border-sarge-gray-200 bg-sarge-gray-0 h-9 gap-2 rounded-md p-2"
                            iconClassName="h-4 w-4"
                        >
                            <span
                                className={cn(
                                    `inline-flex items-center rounded-md ${chipPaddingClass} text-xs font-medium`,
                                    getStatusBadgeColor(assessmentStatus)
                                )}
                            >
                                {label}
                            </span>
                        </PositionAssessmentCard>
                    );
                },
            },
            {
                accessorKey: 'candidate.resumeUrl',
                header: () => <HeaderLabel>RESUME</HeaderLabel>,
                cell: ({ row }) =>
                    row.original.candidate.resumeUrl ? (
                        <LinkButton
                            href={ensureAbsoluteUrl(row.original.candidate.resumeUrl)}
                            label={getLinkLabel(row.original.candidate.resumeUrl, 'resume')}
                        />
                    ) : (
                        <span className="text-body-s text-sarge-gray-600">—</span>
                    ),
            },
            {
                accessorKey: 'graderName',
                header: () => <HeaderLabel>GRADER</HeaderLabel>,
                cell: ({ row }) => (
                    <span className="text-sarge-gray-800 inline-flex items-center gap-1.5 text-sm">
                        {row.original.graderName ?? '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'decisionStatus',
                header: () => <HeaderLabel>DECISION</HeaderLabel>,
                cell: ({ row }) => {
                    const decision = row.original.decisionStatus ?? 'Pending';
                    const decisionLabel = formatDecisionLabel(decision);
                    return (
                        <span
                            className={cn(
                                `inline-flex items-center gap-1 rounded-md ${chipPaddingClass} text-xs font-medium`,
                                getStatusBadgeColor(decision)
                            )}
                        >
                            {decisionLabel}
                        </span>
                    );
                },
            },
        ],
        []
    );

    return (
        <div className="candidate-table border-sarge-gray-200 bg-sarge-gray-0 border">
            <DataTable columns={columns} data={candidates} />
            <style jsx>{`
                .candidate-table :global(thead) {
                    background: #f5f7fb;
                }
            `}</style>
        </div>
    );
}
