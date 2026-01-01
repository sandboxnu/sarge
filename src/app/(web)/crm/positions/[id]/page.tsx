'use client';

import { Button } from '@/lib/components/ui/Button';
import { CandidateTable } from '@/lib/components/core/CandidateTable';
import CreateCandidateModal from '@/lib/components/modal/CreateCandidateModal';
import UploadCSVModal from '@/lib/components/modal/UploadCSVModal';
import useCandidates from '@/lib/hooks/useCandidates';
import { ChevronLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

export default function CandidatesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isModalManualOpen, setIsModalManualOpen] = useState(false);
    const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
    const { candidates, loading, error, positionTitle, createCandidate, batchCreateCandidates } =
        useCandidates(id);

    return (
        <>
            <div className="flex max-h-screen flex-col gap-8 px-8 py-7 pb-20">
                <div className="sticky flex items-center gap-4">
                    <button
                        onClick={() => router.push('/crm/positions')}
                        className="hover:bg-sarge-gray-100 rounded-lg p-2 hover:cursor-pointer"
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
                {!loading && !error && <CandidateTable candidates={candidates} />}
            </div>

            <CreateCandidateModal
                open={isModalManualOpen}
                onOpenChange={setIsModalManualOpen}
                onCreate={createCandidate}
                onSwitchModal={() => {
                    setIsModalManualOpen(false);
                    setIsCSVModalOpen(true);
                }}
            />
            <UploadCSVModal
                open={isCSVModalOpen}
                positionId={id}
                onOpenChange={setIsCSVModalOpen}
                onCreate={batchCreateCandidates}
                onSwitchModal={() => {
                    setIsCSVModalOpen(false);
                    setIsModalManualOpen(true);
                }}
            />
        </>
    );
}
