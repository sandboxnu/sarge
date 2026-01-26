'use client';

import Link from 'next/link';
import BlockNoteViewer from '@/lib/components/core/BlockNoteViewer';
import { Button } from '@/lib/components/ui/Button';
import { Pencil } from 'lucide-react';
import { type TaskTemplateDetail } from '@/lib/types/task-template.types';
import { getTagTextColor } from '@/lib/utils/color.utils';

interface TaskTemplatePreviewProps {
    template: TaskTemplateDetail | null;
}

export default function TaskTemplatePreview({ template }: TaskTemplatePreviewProps) {
    if (!template) {
        return (
            <div className="flex h-full items-center justify-center text-sarge-gray-500">
                Select a task template to preview
            </div>
        );
    }

    return (
        <div className="h-full space-y-6 overflow-y-auto p-6">
            <div>
                <div className="mb-2 flex items-start justify-between gap-4">
                    <h2 className="text-display-xs text-sarge-gray-900">{template.title}</h2>
                    <Link href={`/crm/task-templates/${template.id}/edit`}>
                        <Button variant="secondary" className="gap-2 px-3 py-2">
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>
                {template.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {template.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="rounded px-2 py-0.5 text-xs font-medium"
                                style={{
                                    backgroundColor: tag.colorHexCode ?? '#F1F1EF',
                                    color: getTagTextColor(tag.colorHexCode),
                                }}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <section>
                <BlockNoteViewer key={template.id} content={template.description} />
            </section>

            {template.publicTestCases.length > 0 && (
                <section>
                    <h3 className="text-label-s mb-3 text-sarge-gray-800">
                        Public Test Cases ({template.publicTestCases.length})
                    </h3>
                    <div className="space-y-3">
                        {template.publicTestCases.map((tc, idx) => (
                            <div key={idx} className="rounded-lg bg-sarge-gray-50 p-4">
                                <div className="mb-2">
                                    <span className="text-label-xs text-sarge-gray-600">
                                        Input:
                                    </span>
                                    <pre className="mt-1 font-mono text-sm">{tc.input}</pre>
                                </div>
                                <div>
                                    <span className="text-label-xs text-sarge-gray-600">
                                        Output:
                                    </span>
                                    <pre className="mt-1 font-mono text-sm">{tc.output}</pre>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {template.privateTestCases.length > 0 && (
                <section>
                    <h3 className="text-label-s mb-3 text-sarge-gray-800">
                        Private Test Cases ({template.privateTestCases.length})
                    </h3>
                    <div className="space-y-3">
                        {template.privateTestCases.map((tc, idx) => (
                            <div key={idx} className="rounded-lg bg-sarge-gray-50 p-4">
                                <div className="mb-2">
                                    <span className="text-label-xs text-sarge-gray-600">
                                        Input:
                                    </span>
                                    <pre className="mt-1 font-mono text-sm">{tc.input}</pre>
                                </div>
                                <div>
                                    <span className="text-label-xs text-sarge-gray-600">
                                        Output:
                                    </span>
                                    <pre className="mt-1 font-mono text-sm">{tc.output}</pre>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
