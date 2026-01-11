'use client';

import { useState, useEffect } from 'react';
import { Search } from '@/lib/components/core/Search';
import TaskTemplateCard from '@/lib/components/core/TaskTemplateCard';
import TaskTemplatePreview from '@/lib/components/core/TaskTemplatePreview';
import { useSearch } from '@/lib/hooks/useSearch';
import type { TaskTemplateListItem, TaskTemplateDetail } from '@/lib/types/task-template.types';

interface TaskTemplatesContentProps {
    templates: TaskTemplateListItem[];
}

export default function TaskTemplatesContent({ templates }: TaskTemplatesContentProps) {
    const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id ?? null);
    const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplateDetail | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const { query, setQuery, results } = useSearch({
        data: templates,
        keys: ['title', 'tags.name'],
        threshold: 0.3,
        minMatchCharLength: 2,
    });

    useEffect(() => {
        if (!selectedTemplateId) return;

        setIsLoadingDetail(true);
        fetch(`/api/task-templates/${selectedTemplateId}`)
            .then((r) => r.json())
            .then((result) => setSelectedTemplate(result.data))
            .catch((error) => console.error('Failed to fetch template detail:', error))
            .finally(() => setIsLoadingDetail(false));
    }, [selectedTemplateId]);

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4">
            <div className="flex w-1/3 flex-col">
                <div className="mb-4 flex-shrink-0">
                    <Search
                        placeholder="Search task templates..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                    {results.length > 0 ? (
                        results.map((template) => (
                            <TaskTemplateCard
                                key={template.id}
                                template={template}
                                isSelected={selectedTemplateId === template.id}
                                onClick={() => setSelectedTemplateId(template.id)}
                            />
                        ))
                    ) : (
                        <div className="py-8 text-center text-sm text-sarge-gray-500">
                            No task templates found
                        </div>
                    )}
                </div>

                {query && (
                    <div className="py-2 text-center text-xs text-sarge-gray-600">
                        {results.length} of {templates.length} templates
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-hidden rounded-lg border border-sarge-gray-200 bg-white">
                {isLoadingDetail ? (
                    <div className="flex h-full items-center justify-center text-sarge-gray-500">
                        Loading...
                    </div>
                ) : (
                    <TaskTemplatePreview template={selectedTemplate} />
                )}
            </div>
        </div>
    );
}
