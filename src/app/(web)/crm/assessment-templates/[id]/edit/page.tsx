'use client';

import { use, useState } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/lib/components/ui/Button';
import AddTaskModal from '@/lib/components/modal/AddTaskModal';
import AssessmentEditorSidebar from '@/lib/components/core/AssessmentEditorSidebar';
import CandidatePreviewPanel from '@/lib/components/core/CandidatePreviewPanel';
import EditableBreadcrumb from '@/lib/components/core/EditableBreadcrumb';
import useAssessmentTemplateEditPage from '@/lib/hooks/useAssessmentTemplateEditPage';
import type { AssessmentSection } from '@/lib/types/assessment-section.types';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';

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
        setTitle,
        sections,
        setSections,
        internalNotes,
        setInternalNotes,
        selectedSection,
        setSelectedSection,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        isSaving,
        handleSave,
    } = useAssessmentTemplateEditPage(id);

    const [addTaskOpen, setAddTaskOpen] = useState(false);

    const handleAddTasks = (tasks: TaskTemplateListItemDTO[]) => {
        const newSections: AssessmentSection[] = tasks.map((task, i) => ({
            type: 'task',
            taskTemplateId: task.id,
            order: sections.length + i,
            taskTemplate: task,
        }));
        setSections((prev) => [...prev, ...newSections]);
        setHasUnsavedChanges(true);

        if (!selectedSection && newSections.length > 0) {
            setSelectedSection(newSections[0]);
        }
    };

    const handleDeleteSection = () => {
        if (!selectedSection) return;
        setSections((prev) =>
            prev.filter((s) => s.taskTemplateId !== selectedSection.taskTemplateId)
        );
        setSelectedSection(null);
        setHasUnsavedChanges(true);
    };

    const onSave = async () => {
        const success = await handleSave();
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
                <p className="text-body-m text-sarge-gray-500">
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

    return (
        <div className="flex h-full flex-col">
            <div className="border-sarge-gray-200 flex items-center justify-between border-b px-5 py-4">
                <EditableBreadcrumb
                    segments={[{ label: 'Assessment Templates', href: '/crm/templates' }]}
                    currentPage={title}
                    onCurrentPageChange={(newTitle) => {
                        setTitle(newTitle);
                        setHasUnsavedChanges(true);
                    }}
                />

                <Button variant="dropdown" className="shrink-0">
                    <Users className="size-5" />
                    Assign to position
                    <ChevronDown className="size-5" />
                </Button>
            </div>

            <div className="flex min-h-0 flex-1">
                <AssessmentEditorSidebar
                    sections={sections}
                    setSections={setSections}
                    selectedSection={selectedSection}
                    setSelectedSection={setSelectedSection}
                    internalNotes={internalNotes}
                    setInternalNotes={setInternalNotes}
                    hasUnsavedChanges={hasUnsavedChanges}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                    onSave={onSave}
                    isSaving={isSaving}
                    onOpenAddTaskModal={() => setAddTaskOpen(true)}
                />

                <CandidatePreviewPanel
                    selectedSection={selectedSection}
                    onDeleteSection={handleDeleteSection}
                />
            </div>

            <AddTaskModal
                open={addTaskOpen}
                onOpenChange={setAddTaskOpen}
                onAdd={handleAddTasks}
                alreadyAddedIds={alreadyAddedIds}
            />
        </div>
    );
}
