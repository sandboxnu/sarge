'use client';

import Link from 'next/link';
import { Copy, MoreVertical, SquarePen, Trash2 } from 'lucide-react';
import { Chip } from '@/lib/components/ui/Chip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { Button } from '@/lib/components/ui/Button';
import MarkdownViewer from '@/lib/components/core/Markdown';
import type { TaskTemplatePreviewDTO } from '@/lib/schemas/task-template.schema';

export interface TaskTemplatePreviewPanelProps {
    taskTemplatePreview: TaskTemplatePreviewDTO;
    onDuplicate?: (taskTemplateId: string) => void;
    onDelete?: (taskTemplateId: string) => void;
}

export function TaskTemplatePreviewPanel({
    taskTemplatePreview,
    onDuplicate,
    onDelete,
}: TaskTemplatePreviewPanelProps) {
    const tags = taskTemplatePreview.tags ?? [];
    const supportedLanguages = taskTemplatePreview.supportedLanguages ?? [];

    return (
        <div className="flex h-full w-full flex-col overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-0 pt-0 pb-6">
                <div className="min-w-0 flex-1">
                    <h2 className="text-display-xs text-sarge-gray-800 truncate">
                        {taskTemplatePreview.title}
                    </h2>
                    {taskTemplatePreview.taskType && (
                        <p className="text-body-m text-sarge-gray-600 mt-0.5">
                            {taskTemplatePreview.taskType}
                        </p>
                    )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <Button variant="secondary" className="px-4 py-2" asChild>
                        <Link
                            href={`/crm/task-templates/${taskTemplatePreview.id}/edit`}
                            aria-label="Edit task template"
                        >
                            <SquarePen className="size-5" />
                            Edit details
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="icon"
                                className="h-10 w-10 p-0"
                                aria-label="More options"
                            >
                                <MoreVertical className="size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onSelect={() => onDuplicate?.(taskTemplatePreview.id)}
                                disabled={!onDuplicate}
                            >
                                <Copy className="size-4" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => onDelete?.(taskTemplatePreview.id)}
                                disabled={!onDelete}
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-0">
                <section className="mb-6">
                    <p className="text-label-xs text-sarge-gray-500 tracking-wide uppercase">
                        Tags
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                            <Chip
                                key={tag.id}
                                className="rounded-md px-2 py-1 text-xs"
                                style={{ backgroundColor: tag.colorHexCode }}
                            >
                                {tag.name}
                            </Chip>
                        ))}
                    </div>
                </section>

                <section className="mb-6">
                    <p className="text-label-xs text-sarge-gray-500 tracking-wide uppercase">
                        Description
                    </p>
                    <div className="border-sarge-gray-200 bg-background mt-2 rounded-lg border p-4">
                        <div className="text-body-m text-sarge-gray-800">
                            <MarkdownViewer content={taskTemplatePreview.content ?? ''} />
                        </div>
                    </div>
                </section>

                <section className="mb-6">
                    <p className="text-label-xs text-sarge-gray-500 tracking-wide uppercase">
                        Languages
                    </p>
                    <div className="border-sarge-gray-200 bg-background mt-2 rounded-lg border p-4">
                        <div className="flex flex-wrap gap-1.5">
                            {supportedLanguages.map((language) => (
                                <Chip key={language} variant="outline">
                                    {language}
                                </Chip>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="mb-0">
                    <p className="text-body-s text-sarge-gray-500">
                        Created by {taskTemplatePreview.creator?.name ?? '—'}
                    </p>
                    <Link
                        href="#"
                        className="text-body-s text-sarge-primary-500 hover:text-sarge-primary-600 mt-1 inline-block underline"
                    >
                        Used in {taskTemplatePreview.assessmentTemplatesCount} assessment
                        {taskTemplatePreview.assessmentTemplatesCount !== 1 ? 's' : ''}
                    </Link>
                </div>
            </div>
        </div>
    );
}
