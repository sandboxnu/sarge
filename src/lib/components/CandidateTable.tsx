'use client';

import { DataTable } from '@/lib/components/DataTable';
import type { CandidatePoolDisplayInfo } from '@/lib/types/position.types';
import type { ColumnDef } from '@tanstack/react-table';
import { ExternalLink } from 'lucide-react';
import { useMemo } from 'react';

interface CandidateTableProps {
    candidates: CandidatePoolDisplayInfo[];
}

const getStatusBadgeColor = (status: string) => {
    if (status === 'ACCEPTED' || status === 'SUBMITTED') {
        return 'bg-sarge-success-100 text-sarge-success-800';
    }
    if (status === 'REJECTED' || status === 'EXPIRED') {
        return 'bg-sarge-error-200 text-sarge-error-700';
    }
    if (status === 'ASSIGNED') {
        return 'bg-sarge-warning-100 text-sarge-warning-500';
    }
    if (status === 'GRADED') {
        return 'bg-sarge-primary-200 text-sarge-primary-700';
    }
    return 'bg-sarge-gray-200 text-sarge-gray-600';
};

const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

export function CandidateTable({ candidates }: CandidateTableProps) {
    const columns = useMemo<ColumnDef<CandidatePoolDisplayInfo>[]>(
        () => [
            {
                accessorKey: 'candidate.name',
                header: 'NAME/MAJOR',
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="text-sarge-gray-800 text-lg">
                            {row.original.candidate.name}
                        </span>
                        <span className="text-sarge-gray-600 text-sm">
                            {row.original.candidate.major ?? 'N/A'}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'decisionStatus',
                header: 'OA STATUS',
                cell: ({ row }) => {
                    const status =
                        row.original.assessmentStatus === 'NOT_ASSIGNED'
                            ? 'Not started'
                            : row.original.assessmentStatus;
                    return (
                        <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(status)}`}
                        >
                            {status}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'assessmentStatus',
                header: 'ASSESSMENT',
                cell: ({ row }) => {
                    const isDisabled = row.original.assessmentStatus === 'NOT_ASSIGNED';
                    return (
                        <a
                            href={isDisabled ? '#' : (row.original.assessment?.uniqueLink ?? '#')}
                            target={isDisabled ? undefined : '_blank'}
                            onClick={(e) => isDisabled && e.preventDefault()}
                            className={`inline-flex items-center gap-1.5 ${
                                isDisabled
                                    ? 'text-sarge-primary-300 cursor-not-allowed'
                                    : 'text-sarge-primary-500 hover:text-sarge-primary-600'
                            }`}
                        >
                            Link to Assessment <ExternalLink className="size-4" />
                        </a>
                    );
                },
            },
            {
                accessorKey: 'candidate.resumeUrl',
                header: 'RESUME',
                cell: ({ row }) =>
                    row.original.candidate.resumeUrl ? (
                        <a
                            href={ensureAbsoluteUrl(row.original.candidate.resumeUrl)}
                            target="_blank"
                            className="text-sarge-primary-500 hover:text-sarge-primary-600 inline-flex items-center gap-1.5"
                        >
                            Link to Resume <ExternalLink className="size-4" />
                        </a>
                    ) : (
                        'N/A'
                    ),
            },
            {
                accessorKey: 'decisionMaker.name',
                header: 'DECISION',
                cell: ({ row }) => (
                    <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(row.original.decisionStatus)}`}
                    >
                        {row.original.decisionStatus}
                    </span>
                ),
            },
        ],
        [getStatusBadgeColor, ensureAbsoluteUrl]
    );

    return <DataTable columns={columns} data={candidates} />;
}
