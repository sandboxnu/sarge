'use client';

import { Button } from '@/lib/components/ui/Button';
import { CandidateTable } from '@/lib/components/core/CandidateTable';
import CreateCandidateModal from '@/lib/components/modal/CreateCandidateModal';
import UploadCSVModal from '@/lib/components/modal/UploadCSVModal';
import useCandidates from '@/lib/hooks/useCandidates';
import { Search } from '@/lib/components/core/Search';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import { ChevronLeft, Plus, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
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
                    <h1 className="text-2xl font-semibold">{positionTitle} Candidates</h1>
                </div>
                <hr />
                <div className="sticky flex items-center gap-4">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="max-w-[680px] flex-1">
                            <Search placeholder="Type to search for a position" />
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="border-sarge-gray-200 text-sarge-gray-600 hover:bg-sarge-gray-100 flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5">
                                <ArrowUpDown className="size-5" />
                                <span className="text-label-s">Sort</span>
                            </button>
                            <button className="border-sarge-gray-200 text-sarge-gray-600 hover:bg-sarge-gray-100 flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5">
                                <SlidersHorizontal className="size-5" />
                                <span className="text-label-s">Filter</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-x-4">
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
                {!loading && !error && (
                    <Tabs defaultValue="candidates" className="flex flex-col gap-3">
                        <TabsList className="h-auto gap-5 bg-transparent p-0">
                            <UnderlineTabsTrigger value="candidates">
                                Candidates ({candidates.length})
                            </UnderlineTabsTrigger>
                            <UnderlineTabsTrigger value="assessment">
                                Assessment
                            </UnderlineTabsTrigger>
                        </TabsList>

                        <TabsContent value="candidates">
                            <CandidateTable candidates={candidates} />
                        </TabsContent>

                        <TabsContent value="assessment">{/* No content yet */}</TabsContent>
                    </Tabs>
                )}
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
