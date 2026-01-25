'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ExternalLink } from 'lucide-react';

import { DataTable } from '@/lib/components/ui/DataTable';
import type { ApplicationDisplayInfo } from '@/lib/types/position.types';
import { PositionAssessmentCard } from '@/lib/components/core/PositionAssessmentCard';
import { cn } from '@/lib/utils/cn.utils';

interface CandidateTableProps {
    candidates: ApplicationDisplayInfo[];
}

const getDecisionBadgeClasses = (status: string) => {
    const s = (status ?? '').toUpperCase();
    if (s === 'ACCEPTED') return 'bg-sarge-success-100 text-sarge-success-800';
    if (s === 'REJECTED') return 'bg-sarge-error-200 text-sarge-error-700';
    return 'bg-sarge-gray-200 text-sarge-gray-600';
};

const getAssessmentBadgeClasses = (status: string) => {
    const s = (status ?? '').toUpperCase();
    if (s === 'SUBMITTED') return 'bg-sarge-success-100 text-sarge-success-800';
    if (s === 'EXPIRED') return 'bg-sarge-error-200 text-sarge-error-700';
    if (s === 'GRADED') return 'bg-sarge-primary-200 text-sarge-primary-700';
    return 'bg-sarge-gray-200 text-sarge-gray-600'; // NOT_ASSIGNED or NOT_STARTED
};

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

const HeaderLabel = ({ children }: { children: string }) => (
    <span className="text-body-s text-sarge-gray-700 font-normal tracking-[0.406px] normal-case">
        {children}
    </span>
);

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
                    const grad =
                        (row.original.candidate as any).gradYear ??
                        (row.original.candidate as any).gradDate ??
                        (row.original.candidate as any).graduationDate ??
                        '—';
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

                    const label = getAssessmentLabel(row.original.assessmentStatus);
                    return (
                        <PositionAssessmentCard
                            onClick={() => undefined}
                            className="border-sarge-gray-200 bg-sarge-gray-0 h-9 gap-2 rounded-md p-2"
                            iconClassName="h-4 w-4"
                        >
                            <span
                                className={cn(
                                    'inline-flex items-center rounded-md px-3 py-1 text-xs font-medium',
                                    getAssessmentBadgeClasses(label)
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
                        <a
                            href={ensureAbsoluteUrl(row.original.candidate.resumeUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-label-s text-sarge-primary-500 hover:text-sarge-primary-600 inline-flex items-center gap-1.5 font-medium tracking-[0.406px]"
                        >
                            Link to resume <ExternalLink className="size-4" />
                        </a>
                    ) : (
                        <span className="text-body-s text-sarge-gray-600">—</span>
                    ),
            },
            {
                accessorKey: 'decisionMaker.name',
                header: () => <HeaderLabel>GRADER</HeaderLabel>,
                // TODO: add correct way to get grader name
                cell: ({ row }) => (
                    <span className="text-body-s text-sarge-gray-800 font-normal tracking-[0.406px]">
                        {'—'}
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
                                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
                                getDecisionBadgeClasses(decision)
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
