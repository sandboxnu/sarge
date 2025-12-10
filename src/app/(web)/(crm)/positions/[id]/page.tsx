'use client';

import { Button } from '@/lib/components/Button';
import { DataTable } from '@/lib/components/DataTable';
import { Chip } from '@/lib/components/Chip';
import CreateCandidateModal from '@/lib/components/modal/CreateCandidateModal';
import UploadCSVModal from '@/lib/components/modal/UploadCSVModal';
import useCandidates from '@/lib/hooks/useCandidates';
import type { CandidatePoolDisplayInfo } from '@/lib/types/position.types';
import {
    getAssessmentStatusVariant,
    getAssessmentStatusLabel,
    getDecisionStatusVariant,
    getDecisionStatusLabel,
} from '@/lib/utils/status.utils';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronLeft, ExternalLink, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useMemo, useState } from 'react';

export default function CandidatesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isModalManualOpen, setIsModalManualOpen] = useState(false);
    const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
    const {
        candidates,
        loading,
        error,
        positionTitle,
        getStatusBadgeColor,
        ensureAbsoluteUrl,
        createCandidate,
        batchCreateCandidates,
    } = useCandidates(id);

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
                accessorKey: 'assessmentStatus',
                header: 'ASSESSMENT',
                cell: ({ row }) => (
                    <Chip variant={getAssessmentStatusVariant(row.original.assessmentStatus)}>
                        {getAssessmentStatusLabel(row.original.assessmentStatus)}
                    </Chip>
                ),
            },
            {
                accessorKey: 'assessment.uniqueLink',
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
                header: 'GRADER',
                cell: ({ row }) => (
                    <span className="text-sarge-gray-800">
                        {row.original.decisionMaker?.name ?? 'N/A'}
                    </span>
                ),
            },
            {
                accessorKey: 'decisionStatus',
                header: 'DECISION',
                cell: ({ row }) => (
                    <Chip variant={getDecisionStatusVariant(row.original.decisionStatus)}>
                        {getDecisionStatusLabel(row.original.decisionStatus)}
                    </Chip>
                ),
            },
        ],
        [ensureAbsoluteUrl]
    );

    return (
        <>
            <div className="flex max-h-screen flex-col gap-8 px-8 py-7">
                <div className="sticky flex items-center gap-4">
                    <button
                        onClick={() => router.push('/positions')}
                        className="hover:bg-sarge-gray-100 rounded-lg p-2"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <h1 className="text-2xl font-semibold">All Positions</h1>
                </div>

                <hr />
                <div className="sticky flex justify-between">
                    <div className="space-y-0">
                        <h1 className="text-lg font-semibold">{positionTitle} Candidates</h1>
                        <h3 className="text-sm">
                            {candidates.length}{' '}
                            {candidates.length === 1 ? 'candidate' : 'candidates'}
                        </h3>
                    </div>
                    <div className="flex gap-x-4">
                        <Button
                            variant="secondary"
                            className="px-4 py-2"
                            onClick={() => setIsModalManualOpen(true)}
                        >
                            <Plus className="size-5" />
                            Manual Add
                        </Button>
                        <Button className="px-4 py-2" onClick={() => setIsCSVModalOpen(true)}>
                            <Plus className="size-5" />
                            Import CSV
                        </Button>
                    </div>
                </div>

                {loading && <p>Loading candidates...</p>}
                {error && <p className="text-sarge-error-700">Error: {error}</p>}
                {!loading && !error && <DataTable columns={columns} data={candidates} />}
            </div>

            <CreateCandidateModal
                open={isModalManualOpen}
                onOpenChange={setIsModalManualOpen}
                onCreate={createCandidate}
            />
            <UploadCSVModal
                open={isCSVModalOpen}
                positionId={'cmiz82dgh00016ly5vie2b1a6'}
                onOpenChange={setIsCSVModalOpen}
                onCreate={batchCreateCandidates}
            />
        </>
    );
}
