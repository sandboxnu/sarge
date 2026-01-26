'use client';

import { Search } from '@/lib/components/core/Search';
import TaskTemplateCard from '@/lib/components/core/TaskTemplateCard';
import TaskTemplatePreview from '@/lib/components/core/TaskTemplatePreview';
import { useSearch } from '@/lib/hooks/useSearch';
import { useTaskTemplatesContent } from '@/lib/hooks/useTaskTemplatesContent';
import type { TaskTemplateListItem } from '@/lib/types/task-template.types';

interface TaskTemplatesContentProps {
    templates: TaskTemplateListItem[];
}

export default function TaskTemplatesContent({ templates }: TaskTemplatesContentProps) {
    const { selectedTemplateId, setSelectedTemplateId, selectedTemplate, isLoadingDetail, error } =
        useTaskTemplatesContent({ templates });

    const { query, setQuery, results } = useSearch({
        data: templates,
        keys: ['title', 'tags.name'],
        threshold: 0.3,
        minMatchCharLength: 2,
    });

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
                {error ? (
                    <div className="flex h-full items-center justify-center text-sarge-gray-500">
                        Error loading template: {error.message}
                    </div>
                ) : isLoadingDetail ? (
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
