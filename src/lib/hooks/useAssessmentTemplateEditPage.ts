import { useState, useEffect } from 'react';
import {
    getAssessmentTemplate,
    updateAssessmentTemplate,
    updateAssessmentTemplateTasks,
} from '@/lib/api/assessment-templates';
import type { AssessmentSection } from '@/lib/types/assessment-section.types';
import type { BlockNoteContent } from '@/lib/types/task-template.types';

export default function useAssessmentTemplateEditPage(assessmentTemplateId: string) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sections, setSections] = useState<AssessmentSection[]>([]);
    const [internalNotes, setInternalNotes] = useState<BlockNoteContent>([]);
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
                setDescription(template.description);
                setInternalNotes(template.internalNotes as BlockNoteContent);

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

    async function handleSave(): Promise<boolean> {
        setIsSaving(true);
        try {
            await Promise.all([
                updateAssessmentTemplate(assessmentTemplateId, {
                    title,
                    description,
                    internalNotes,
                }),
                updateAssessmentTemplateTasks(
                    assessmentTemplateId,
                    sections.map((s) => ({ taskTemplateId: s.taskTemplateId }))
                ),
            ]);
            setHasUnsavedChanges(false);
            return true;
        } catch (err) {
            console.error('Save failed:', err);
            return false;
        } finally {
            setIsSaving(false);
        }
    }

    return {
        isLoading,
        error,
        title,
        setTitle,
        description,
        setDescription,
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
    };
}
