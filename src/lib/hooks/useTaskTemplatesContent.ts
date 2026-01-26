'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TaskTemplateDetail, TaskTemplateListItem } from '@/lib/types/task-template.types';
import { getTaskTemplate } from '@/lib/api/task-templates';

interface UseTaskTemplatesContentProps {
    templates: TaskTemplateListItem[];
}

interface UseTaskTemplatesContentReturn {
    selectedTemplateId: string | null;
    setSelectedTemplateId: (id: string) => void;
    selectedTemplate: TaskTemplateDetail | null;
    isLoadingDetail: boolean;
    error: Error | null;
}

export function useTaskTemplatesContent({
    templates,
}: UseTaskTemplatesContentProps): UseTaskTemplatesContentReturn {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
        templates[0]?.id ?? null
    );
    const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplateDetail | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (templates.length === 0) {
            setSelectedTemplateId(null);
            setSelectedTemplate(null);
            return;
        }

        const stillExists = selectedTemplateId
            ? templates.some((t) => t.id === selectedTemplateId)
            : false;

        if (!stillExists && templates.length > 0) {
            setSelectedTemplateId(templates[0].id);
        }
    }, [templates, selectedTemplateId]);

    useEffect(() => {
        if (!selectedTemplateId) {
            setSelectedTemplate(null);
            setError(null);
            return;
        }

        const templateId = selectedTemplateId;
        let cancelled = false;

        async function fetchDetail() {
            setIsLoadingDetail(true);
            setError(null);

            try {
                const data = await getTaskTemplate(templateId);
                if (!cancelled) {
                    setSelectedTemplate(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err as Error);
                    setSelectedTemplate(null);
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingDetail(false);
                }
            }
        }

        fetchDetail();

        return () => {
            cancelled = true;
        };
    }, [selectedTemplateId]);

    const handleSetSelectedTemplateId = useCallback((id: string) => {
        setSelectedTemplateId(id);
    }, []);

    return {
        selectedTemplateId,
        setSelectedTemplateId: handleSetSelectedTemplateId,
        selectedTemplate,
        isLoadingDetail,
        error,
    };
}
