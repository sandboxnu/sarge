'use client';

import { use } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import Image from 'next/image';
import AddTaskModal from '@/lib/components/modal/AddTaskModal';
import AssessmentTemplateEditorSidebar from '@/lib/components/templates/AssessmentTemplateEditorSidebar';
import AssessmentTaskTemplatePreviewPanel from '@/lib/components/templates/AssessmentTaskTemplatePreviewPanel';
import Breadcrumbs from '@/lib/components/core/Breadcrumbs';
import useAssessmentTemplateEditPage from '@/lib/hooks/useAssessmentTemplateEditPage';
import { Combobox } from '@/lib/components/ui/Combobox';
import { RemovableChip } from '@/lib/components/ui/RemovableChip';

export default function AssessmentTemplateEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const {
        isLoading,
        error,
        title,
        positions,
        selectedPositionIds,
        sections,
        notes,
        selectedSection,
        hasUnsavedChanges,
        isSaving,
        updateTitle,
        updateNotes,
        addSections,
        deleteSection,
        reorderSections,
        selectSection,
        updateSelectedPositions,
        onSave,
        addTaskOpen,
        setAddTaskOpen
    } = useAssessmentTemplateEditPage(id);


    if (isLoading) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <Image
                    src="/CreateOrgLoading.gif"
                    alt="Loading"
                    width={66}
                    height={66}
                    unoptimized
                />
                <p className="text-sarge-gray-800 text-base leading-tight font-medium tracking-wide">
                    Opening assessment template editor...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <p className="text-body-m text-sarge-error-700">
                    Failed to load assessment template
                </p>
            </div>
        );
    }

    const alreadyAddedIds = new Set(sections.map((s) => s.taskTemplateId));
    const positionOptions = positions.map((position) => ({
        value: position.id,
        label: position.title,
    }));

    return (
        <div className="flex h-full flex-col">
            <div className="border-sarge-gray-200 flex items-center justify-between border-b px-5 py-4">
                <Breadcrumbs
                    segments={[{ label: 'Assessment Templates', href: '/crm/templates' }]}
                    currentPage={title}
                    editable
                    onCurrentPageChange={updateTitle}
                />

                <div className="w-full max-w-[320px] shrink-0">
                    <Combobox
                        options={positionOptions}
                        value={selectedPositionIds}
                        onChange={(value) => updateSelectedPositions(value as string[])}
                        multiple
                        variant="checkbox"
                        showSelectAll
                        placeholder="Assign to position(s)"
                        searchPlaceholder="Search positions..."
                        emptyText="No positions found."
                        showSearchIcon
                        triggerClassName="rounded-xl border px-4"
                        contentClassName="rounded-xl"
                        trigger={
                            <button
                                type="button"
                                className="border-sarge-gray-200 bg-sarge-gray-0 text-sarge-gray-800 flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 text-left"
                            >
                                <Users className="text-sarge-gray-600 size-5 shrink-0" />
                                <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-hidden py-2">
                                    {selectedPositionIds.length > 0 ? (
                                        <>
                                            {selectedPositionIds.slice(0, 2).map((id) => {
                                                const pos = positions.find((p) => p.id === id);
                                                if (!pos) return null;
                                                return (
                                                    <RemovableChip
                                                        key={id}
                                                        label={pos.title}
                                                        onRemove={() =>
                                                            updateSelectedPositions(
                                                                selectedPositionIds.filter(
                                                                    (x) => x !== id
                                                                )
                                                            )
                                                        }
                                                    />
                                                );
                                            })}
                                            {selectedPositionIds.length > 2 && (
                                                <span className="text-label-s text-sarge-gray-500 shrink-0">
                                                    ...
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-label-s text-sarge-gray-500">
                                            Assign to position(s)
                                        </span>
                                    )}
                                </div>
                                <ChevronDown className="text-sarge-gray-600 size-5 shrink-0" />
                            </button>
                        }
                    />
                </div>
            </div>

            <div className="flex min-h-0 flex-1">
                <AssessmentTemplateEditorSidebar
                    sections={sections}
                    selectedSection={selectedSection}
                    notes={notes}
                    hasUnsavedChanges={hasUnsavedChanges}
                    isSaving={isSaving}
                    onReorder={reorderSections}
                    onSelectSection={selectSection}
                    onNotesChange={updateNotes}
                    onSave={onSave}
                    onOpenAddTaskModal={() => setAddTaskOpen(true)}
                />

                <AssessmentTaskTemplatePreviewPanel
                    selectedSection={selectedSection}
                    onDeleteSection={deleteSection}
                />
            </div>

            <AddTaskModal
                open={addTaskOpen}
                onOpenChange={setAddTaskOpen}
                onAdd={addSections}
                alreadyAddedIds={alreadyAddedIds}
            />
        </div>
    );
}
