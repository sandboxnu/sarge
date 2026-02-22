'use client';

import { useState } from 'react';
import { AlarmClock, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';
import { Button } from '@/lib/components/ui/Button';
import {
    Sortable,
    SortableContent,
    SortableItem,
    SortableOverlay,
} from '@/lib/components/ui/sortable';
import AssessmentItem from '@/lib/components/core/AssessmentItem';
import BlockNoteEditor from '@/lib/components/core/BlockNoteEditor';
import type { AssessmentSection } from '@/lib/types/assessment-section.types';
import type { BlockNoteContent } from '@/lib/types/task-template.types';

interface AssessmentEditorSidebarProps {
    sections: AssessmentSection[];
    setSections: React.Dispatch<React.SetStateAction<AssessmentSection[]>>;
    selectedSection: AssessmentSection | null;
    setSelectedSection: (section: AssessmentSection | null) => void;
    internalNotes: BlockNoteContent;
    setInternalNotes: (notes: BlockNoteContent) => void;
    hasUnsavedChanges: boolean;
    setHasUnsavedChanges: (changed: boolean) => void;
    onSave: () => void;
    isSaving: boolean;
    onOpenAddTaskModal: () => void;
}

export default function AssessmentEditorSidebar({
    sections,
    setSections,
    selectedSection,
    setSelectedSection,
    internalNotes,
    setInternalNotes,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    onSave,
    isSaving,
    onOpenAddTaskModal,
}: AssessmentEditorSidebarProps) {
    const [isNotesExpanded, setIsNotesExpanded] = useState(false);

    const totalMinutes = sections.reduce((sum, s) => {
        if (s.type === 'task') {
            return sum + s.taskTemplate.timeLimitMinutes;
        }
        return sum;
    }, 0);

    const formatTotalTime = (minutes: number): string => {
        if (minutes === 0) return '0 min';
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hrs === 0) return `${mins} min`;
        if (mins === 0) return `${hrs} hr`;
        return `${hrs} hr ${mins} min`;
    };

    const handleReorder = (reordered: AssessmentSection[]) => {
        setSections(reordered);
        setHasUnsavedChanges(true);
    };

    return (
        <div className="border-border bg-background flex h-full w-[258px] shrink-0 flex-col border-r">
            <div className="shrink-0 px-5 pt-5 pb-3">
                <div className="flex w-full gap-2">
                    <Button
                        variant="primary"
                        className="h-9 flex-1 gap-2 px-4"
                        onClick={onOpenAddTaskModal}
                    >
                        <Plus className="size-5" />
                        Task
                    </Button>
                    <Button
                        variant="secondary"
                        className="h-9 flex-1 gap-2 px-4"
                        onClick={() => {
                            // TODO: Text sections are not yet supported
                        }}
                        title="Coming soon"
                    >
                        <Plus className="size-5" />
                        Text
                    </Button>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto">
                    {sections.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2 px-5 py-8">
                            <p className="text-body-xs text-muted-foreground text-center">
                                Add a task to get started.
                            </p>
                        </div>
                    ) : (
                        <Sortable
                            value={sections}
                            onValueChange={handleReorder}
                            getItemValue={(item) => item.taskTemplateId}
                        >
                            <SortableContent className="flex flex-col">
                                {sections.map((section) => (
                                    <SortableItem
                                        key={section.taskTemplateId}
                                        value={section.taskTemplateId}
                                        className="opacity-100"
                                    >
                                        <AssessmentItem
                                            section={section}
                                            isSelected={
                                                selectedSection?.taskTemplateId ===
                                                section.taskTemplateId
                                            }
                                            onSelect={() => setSelectedSection(section)}
                                        />
                                    </SortableItem>
                                ))}
                            </SortableContent>
                            <SortableOverlay />
                        </Sortable>
                    )}
                </div>

                <div className="border-border flex shrink-0 items-center justify-between border-t px-5 py-3">
                    <div className="flex items-center gap-2">
                        <AlarmClock className="text-foreground size-5" />
                        <span className="text-label-xs">Total time</span>
                    </div>
                    <span className="text-label-xs">{formatTotalTime(totalMinutes)}</span>
                </div>
            </div>

            <div className="shrink-0">
                <div className="border-border border-t border-b">
                    <button
                        className={cn(
                            'flex w-full cursor-pointer items-center gap-1 px-5 py-3',
                            isNotesExpanded && 'pb-2'
                        )}
                        onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                    >
                        <ChevronDown
                            className={cn(
                                'text-foreground size-5 transition-transform',
                                isNotesExpanded && 'rotate-180'
                            )}
                        />
                        <span className="text-label-s">Internal notes</span>
                    </button>

                    {isNotesExpanded && (
                        <div className="px-5 pb-3">
                            <div
                                className="bg-card border-border h-[187px] overflow-y-auto rounded-b-lg border p-3"
                                data-blocknote-editor-bg="muted"
                            >
                                <BlockNoteEditor
                                    description={internalNotes}
                                    setDescription={(notes) => {
                                        setInternalNotes(notes);
                                        setHasUnsavedChanges(true);
                                    }}
                                    compact
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-5 py-3">
                    <Button
                        variant="primary"
                        className="h-9 w-full"
                        disabled={!hasUnsavedChanges || isSaving}
                        onClick={onSave}
                    >
                        {isSaving ? 'Saving...' : 'Save changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
