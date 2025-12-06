'use client';

import { DataTable } from '@/lib/components/DataTable';
import useCandidatesForPosition from '@/lib/hooks/useCandidatesForPosition';
import type { CandidatePoolDisplayInfo } from '@/lib/types/position.types';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useMemo, useState } from 'react';

const getStatusBadgeColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'accepted' || statusLower === 'submitted') {
        return 'bg-sarge-success-100 text-sarge-success-800';
    }
    if (statusLower === 'rejected') {
        return 'bg-sarge-error-200 text-sarge-error-700';
    }
    if (statusLower === 'graded') {
        return 'bg-sarge-primary-200 text-sarge-primary-700';
    }
    return 'bg-sarge-gray-200 text-sarge-gray-600';
};

export default function CandidatesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { candidates, loading, error } = useCandidatesForPosition(id);
    const [positionTitle, setPositionTitle] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosition = async () => {
            const response = await fetch(`/api/position/${id}`);
            if (response.ok) {
                const data = await response.json();
                setPositionTitle(data.data?.title ?? null);
            }
        };
        fetchPosition();
    }, [id]);

    const columns = useMemo<ColumnDef<CandidatePoolDisplayInfo>[]>(
        () => [
            {
                accessorKey: 'candidate.name',
                header: 'NAME/MAJOR',
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="text-lg text-sarge-gray-800">{row.original.candidate.name}</span>
                        <span className="text-sm text-sarge-gray-600">
                            {row.original.candidate.major ?? 'N/A'}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'decisionStatus',
                header: 'OA STATUS',
                cell: ({ row }) => {
                    const status = row.original.assessmentStatus === 'NOT_ASSIGNED' ? 'Not started' : row.original.assessmentStatus;
                    return (
                        <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(status)}`}>
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
                            rel={isDisabled ? undefined : 'noopener noreferrer'}
                            onClick={(e) => isDisabled && e.preventDefault()}
                            className={`inline-flex items-center gap-1.5 ${
                                isDisabled
                                    ? 'cursor-not-allowed text-sarge-gray-300'
                                    : 'text-sarge-primary-500 hover:text-sarge-primary-600'
                            }`}
                        >
                            Link to assessment <ExternalLink className="size-4" />
                        </a>
                    );
                },
            },
            {
                accessorKey: 'candidate.resumeUrl',
                header: 'RESUME',
                cell: ({ row }) => (
                    row.original.candidate.resumeUrl ? (
                        <a
                            href={row.original.candidate.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sarge-primary-500 hover:text-sarge-primary-600"
                        >
                            Link to Resume <ExternalLink className="size-4" />
                        </a>
                    ) : (
                        'N/A'
                    )
                ),
            },
            {
                accessorKey: 'decisionMaker.name',
                header: 'DECISION',
                cell: ({ row }) => (
                    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(row.original.decisionStatus)}`}>
                        {row.original.decisionStatus}
                    </span>
                ),
            },
        ],
        []
    );

    return (
        <div className="flex flex-col gap-8 px-8 py-7">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="rounded-lg p-2 hover:bg-sarge-gray-100"
                >
                    <ChevronLeft className="size-5" />
                </button>
                <h1 className="text-2xl font-semibold">All Positions</h1>
            </div>

            <hr/>
            <div className="space-y-0">
                <h1 className="font-semibold text-lg">{positionTitle} Candidates</h1>
                <h3 className="text-sm">{candidates.length} {candidates.length === 1 ? "candidate" : "candidates"}</h3>
            </div>

            {loading && <p>Loading candidates...</p>}
            {error && <p className="text-sarge-error-700">Error: {error}</p>}
            {!loading && !error && (
                <DataTable columns={columns} data={candidates} />
            )}
        </div>
    );
}
