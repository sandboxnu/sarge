'use client';

import { use, useState } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import AddTaskModal from '@/lib/components/modal/AddTaskModal';
import AssessmentEditorSidebar from '@/lib/components/core/AssessmentEditorSidebar';
import AssessmentTaskPreviewPanel from '@/lib/components/core/AssessmentTaskPreviewPanel';
import Breadcrumbs from '@/lib/components/core/Breadcrumbs';
import useAssessmentTemplateEditPage from '@/lib/hooks/useAssessmentTemplateEditPage';
import { Combobox } from '@/lib/components/ui/Combobox';

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
        selectedPositionId,
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
        updateSelectedPosition,
        save,
    } = useAssessmentTemplateEditPage(id);

    const [addTaskOpen, setAddTaskOpen] = useState(false);

    const onSave = async () => {
        const success = await save();
        if (success) {
            toast.success('Assessment template saved');
        } else {
            toast.error('Failed to save assessment template');
        }
    };

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
                        value={selectedPositionId ?? undefined}
                        onChange={(value) => updateSelectedPosition((value as string) || null)}
                        placeholder="Assign to a position"
                        searchPlaceholder="Search positions..."
                        emptyText="No positions found."
                        showSearchIcon
                        triggerClassName="h-14 rounded-xl border px-4"
                        contentClassName="rounded-xl"
                        trigger={
                            <button
                                type="button"
                                className="border-sarge-gray-200 bg-sarge-gray-0 text-sarge-gray-800 flex h-14 w-full items-center gap-3 rounded-xl border px-4 text-left"
                            >
                                <Users className="text-sarge-gray-600 size-5 shrink-0" />
                                <span className="text-label-s min-w-0 flex-1 truncate">
                                    {positions.find(
                                        (position) => position.id === selectedPositionId
                                    )?.title ?? 'Assign to a position'}
                                </span>
                                <ChevronDown className="text-sarge-gray-600 size-5 shrink-0" />
                            </button>
                        }
                    />
                </div>
            </div>

            <div className="flex min-h-0 flex-1">
                <AssessmentEditorSidebar
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

                <AssessmentTaskPreviewPanel
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
