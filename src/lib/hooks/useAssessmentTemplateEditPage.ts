import { useState, useEffect } from 'react';
import {
    getAssessmentTemplate,
    updateAssessmentTemplate,
    updateAssessmentTemplateTasks,
} from '@/lib/api/assessment-templates';
import type { AssessmentSection } from '@/lib/types/assessment-section.types';
import type { BlockNoteContent } from '@/lib/types/task-template.types';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';

export default function useAssessmentTemplateEditPage(assessmentTemplateId: string) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const [title, setTitle] = useState('');
    const [sections, setSections] = useState<AssessmentSection[]>([]);
    const [notes, setNotes] = useState<BlockNoteContent>([]);
    const [selectedSection, setSelectedSection] = useState<AssessmentSection | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);
                const template = await getAssessmentTemplate(assessmentTemplateId);

                if (cancelled) return;

                setTitle(template.title);
                setNotes(template.notes);

                const initialSections: AssessmentSection[] = template.tasks.map((t) => ({
                    type: 'task' as const,
                    taskTemplateId: t.taskTemplateId,
                    order: t.order,
                    taskTemplate: t.taskTemplate,
                }));
                setSections(initialSections);

                if (initialSections.length > 0) {
                    setSelectedSection(initialSections[0]);
                }
            } catch (err) {
                if (!cancelled) setError(err as Error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        fetchData();
        return () => {
            cancelled = true;
        };
    }, [assessmentTemplateId]);

    function updateTitle(newTitle: string) {
        setTitle(newTitle);
        setHasUnsavedChanges(true);
    }

    function updateNotes(newNotes: BlockNoteContent) {
        setNotes(newNotes);
        setHasUnsavedChanges(true);
    }

    function addSections(tasks: TaskTemplateListItemDTO[]) {
        const newSections: AssessmentSection[] = tasks.map((task, i) => ({
            type: 'task' as const,
            taskTemplateId: task.id,
            order: sections.length + i,
            taskTemplate: task,
        }));
        setSections((prev) => [...prev, ...newSections]);
        setHasUnsavedChanges(true);

        if (!selectedSection && newSections.length > 0) {
            setSelectedSection(newSections[0]);
        }
    }

    function deleteSection() {
        if (!selectedSection) return;

        const currentIndex = sections.findIndex(
            (s) => s.taskTemplateId === selectedSection.taskTemplateId
        );
        const remaining = sections.filter(
            (s) => s.taskTemplateId !== selectedSection.taskTemplateId
        );

        setSections(remaining);
        setHasUnsavedChanges(true);

        if (remaining.length === 0) {
            setSelectedSection(null);
        } else {
            const nextIndex = Math.min(currentIndex, remaining.length - 1);
            setSelectedSection(remaining[nextIndex]);
        }
    }

    function reorderSections(reordered: AssessmentSection[]) {
        setSections(reordered);
        setHasUnsavedChanges(true);
    }

    function selectSection(section: AssessmentSection | null) {
        setSelectedSection(section);
    }

    async function save(): Promise<boolean> {
        setIsSaving(true);
        try {
            await Promise.all([
                updateAssessmentTemplate(assessmentTemplateId, {
                    title,
                    notes,
                }),
                updateAssessmentTemplateTasks(
                    assessmentTemplateId,
                    sections.map((s) => ({ taskTemplateId: s.taskTemplateId }))
                ),
            ]);
            setHasUnsavedChanges(false);
            return true;
        } catch {
            return false;
        } finally {
            setIsSaving(false);
        }
    }

    return {
        isLoading,
        error,
        title,
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
        save,
    };
}
