'use client';

import { Button } from '@/lib/components/ui/Button';
import { CandidateTable } from '@/lib/components/core/CandidateTable';
import CreateCandidateModal from '@/lib/components/modal/CreateCandidateModal';
import UploadCSVModal from '@/lib/components/modal/UploadCSVModal';
import useCandidates from '@/lib/hooks/useCandidates';
import { Search } from '@/lib/components/core/Search';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import { Plus, ArrowUpDown, SlidersHorizontal, Mail } from 'lucide-react';
import { use, useState } from 'react';
import useSearch from '@/lib/hooks/useSearch';
import Breadcrumbs from '@/lib/components/core/Breadcrumbs';

export default function CandidatesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [isModalManualOpen, setIsModalManualOpen] = useState(false);
    const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
    const {
        candidates,
        loading,
        error,
        positionTitle,
        createCandidate,
        batchCreateCandidates,
        isSendingAssessments,
        handleSendAssessments,
    } = useCandidates(id);
    const { value: searchValue, onChange: onSearchChange } = useSearch('applications');

    const displayedCandidates = searchValue.trim().length
        ? candidates.filter((c) =>
              c.candidate.name.toLowerCase().includes(searchValue.trim().toLowerCase())
          )
        : candidates;

    return (
        <>
            <div className="flex max-h-screen flex-col gap-8 px-8 py-7 pb-20">
                <div className="sticky flex items-center gap-2">
                    <Breadcrumbs
                        segments={[{ label: 'Positions', href: '/crm/positions' }]}
                        currentPage={`${positionTitle} Candidates`}
                    />
                </div>
                <hr />
                <div className="sticky flex items-center gap-4">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="max-w-[680px] flex-1">
                            <Search
                                value={searchValue}
                                onChange={onSearchChange}
                                placeholder="Type to search for a candidate"
                            />
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
                        <TabsList className="h-auto gap-5 rounded-none bg-transparent p-0">
                            <UnderlineTabsTrigger value="candidates">
                                Candidates ({displayedCandidates.length})
                            </UnderlineTabsTrigger>
                            <UnderlineTabsTrigger value="assessment">
                                Assessment
                            </UnderlineTabsTrigger>
                        </TabsList>

                        <TabsContent value="candidates">
                            <CandidateTable candidates={displayedCandidates} />
                            <br />
                        </TabsContent>

                        <TabsContent value="assessment">
                            <div className="flex w-full justify-end">
                                <Button
                                    className="px-4 py-3"
                                    onClick={handleSendAssessments}
                                    disabled={isSendingAssessments}
                                >
                                    <Mail className="size-5" />
                                    {isSendingAssessments ? 'Sending...' : 'Send to all candidates'}
                                </Button>
                            </div>
                        </TabsContent>
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
            />
        </>
    );
}
