'use client';

import { Button } from '@/lib/components/ui/Button';
import { CandidateTable } from '@/lib/components/core/CandidateTable';
import { CandidateSelectionMenu } from '@/lib/components/core/CandidateSelectionMenu';
import CreateCandidateModal from '@/lib/components/modal/CreateCandidateModal';
import UploadCSVModal from '@/lib/components/modal/UploadCSVModal';
import { PositionSubmissionsList } from '@/lib/components/core/PositionSubmissionsList';
import SelectAssessmentModal from '@/lib/components/modal/SelectAssessmentModal';
import DeleteCandidatesModal from '@/lib/components/modal/DeleteCandidatesModal';
import { PositionAssessmentBox } from '@/lib/components/core/PositionAssessmentEmpty';
import useCandidates from '@/lib/hooks/useCandidates';
import useCandidateSelection from '@/lib/hooks/useCandidateSelection';
import { Search } from '@/lib/components/core/Search';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import { Plus, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { use, useCallback, useMemo, useState } from 'react';
import useSearch from '@/lib/hooks/useSearch';
import { type ApplicationDisplayInfo } from '@/lib/types/position.types';
import Breadcrumbs from '@/lib/components/core/Breadcrumbs';

export default function CandidatesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [isModalManualOpen, setIsModalManualOpen] = useState(false);
    const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
    const [isSelectAssessmentOpen, setIsSelectAssessmentOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // Snapshot of the rows being deleted, so the modal text doesn't change if the selection does
    const [pendingDelete, setPendingDelete] = useState<ApplicationDisplayInfo[]>([]);
    const {
        candidates,
        loading,
        error,
        positionTitle,
        createCandidate,
        batchCreateCandidates,
        deleteCandidates,
        isSendingAssessments,
        handleSendAssessments,
        reviewerOptions,
        assignReviewers,
        assignedAssessmentTitle,
        assignAssessment,
    } = useCandidates(id);
    const hasSentAssessments = candidates.some(
        (c) => c.assessmentStatus !== 'NOT_ASSIGNED' && c.assessmentStatus !== 'NOT_SENT'
    );
    const allSent =
        hasSentAssessments &&
        !candidates.some((c) => c.assessment && c.assessmentStatus === 'NOT_SENT');
    const { value: searchValue, onChange: onSearchChange } = useSearch('applications');

    const displayedCandidates = useMemo(
        () =>
            searchValue.trim().length
                ? candidates.filter((c) =>
                      c.candidate.name.toLowerCase().includes(searchValue.trim().toLowerCase())
                  )
                : candidates,
        [candidates, searchValue]
    );
    const { rowSelection, setRowSelection, selectedCandidates, selectedCount, clearSelection } =
        useCandidateSelection(displayedCandidates);

    const requestDelete = useCallback((toDelete: ApplicationDisplayInfo[]) => {
        setPendingDelete(toDelete);
        setIsDeleteModalOpen(true);
    }, []);
    // Stable reference so CandidateTable's memoized columns aren't rebuilt every render
    const handleRowDeleteRequest = useCallback(
        (candidate: ApplicationDisplayInfo) => requestDelete([candidate]),
        [requestDelete]
    );

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
                            <CandidateTable
                                positionId={id}
                                candidates={displayedCandidates}
                                rowSelection={rowSelection}
                                onRowSelectionChange={setRowSelection}
                                onDeleteRequest={handleRowDeleteRequest}
                            />
                            <CandidateSelectionMenu
                                selectedCount={selectedCount}
                                onDelete={() => requestDelete(selectedCandidates)}
                                onDeselectAll={clearSelection}
                            />
                            <br />
                        </TabsContent>

                        <TabsContent value="assessment">
                            <div className="flex flex-col gap-5">
                                <PositionAssessmentBox
                                    onSendAssessments={handleSendAssessments}
                                    isSending={isSendingAssessments}
                                    assignedTitle={assignedAssessmentTitle}
                                    hasSentAssessments={hasSentAssessments}
                                    allSent={allSent}
                                    onSelectAssessment={() => setIsSelectAssessmentOpen(true)}
                                />
                                {assignedAssessmentTitle && (
                                    <PositionSubmissionsList
                                        positionId={id}
                                        candidates={candidates}
                                        reviewerOptions={reviewerOptions}
                                        onAssignReviewers={assignReviewers}
                                    />
                                )}
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
            <SelectAssessmentModal
                open={isSelectAssessmentOpen}
                onOpenChange={setIsSelectAssessmentOpen}
                onAssign={assignAssessment}
            />
            <DeleteCandidatesModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                candidates={pendingDelete}
                onConfirm={() => deleteCandidates(pendingDelete.map((c) => c.candidate.id))}
            />
        </>
    );
}
