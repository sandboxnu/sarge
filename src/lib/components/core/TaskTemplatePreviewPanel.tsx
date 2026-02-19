'use client';

import Link from 'next/link';
import { CopyPlus, MoreVertical, SquarePen, Trash2 } from 'lucide-react';
import { Chip } from '@/lib/components/ui/Chip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { Button } from '@/lib/components/ui/Button';
import { BlockNoteViewer } from '@/lib/components/core/BlockNoteViewer';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';
import type { BlockNoteContent } from '@/lib/types/task-template.types';

export interface TaskTemplatePreviewPanelProps {
    taskTemplatePreview: TaskTemplateListItemDTO;
    onDuplicate?: (taskTemplateId: string) => void;
    onDelete?: (taskTemplateId: string) => void;
}

export function TaskTemplatePreviewPanel({
    taskTemplatePreview,
    onDuplicate,
    onDelete,
}: TaskTemplatePreviewPanelProps) {
    const tags = taskTemplatePreview.tags ?? [];
    const languages = taskTemplatePreview.languages?.map((l) => l.language) ?? [];

    return (
        <div className="flex h-full w-full flex-col overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-0 pt-0 pb-6">
                <div className="min-w-0 flex-1">
                    <h2 className="text-display-xs text-foreground truncate">
                        {taskTemplatePreview.title}
                    </h2>
                    {taskTemplatePreview.taskType && (
                        <p className="text-body-m text-muted-foreground mt-0.5">
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
                                className="border-sarge-gray-200 hover:bg-sarge-gray-50 h-10 w-10 border bg-white p-0"
                                aria-label="More options"
                            >
                                <MoreVertical className="size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="border-sarge-gray-200 w-48 border bg-white"
                        >
                            <DropdownMenuItem
                                onSelect={() => {
                                    onDuplicate?.(taskTemplatePreview.id);
                                }}
                                disabled={!onDuplicate}
                                className="text-sarge-gray-700 hover:bg-sarge-gray-50 focus:bg-sarge-gray-50 bg-white"
                            >
                                <CopyPlus className="size-4" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={(event) => {
                                    event.preventDefault();
                                    onDelete?.(taskTemplatePreview.id);
                                }}
                                disabled={!onDelete}
                                className="text-sarge-gray-700 hover:bg-sarge-gray-50 focus:bg-sarge-gray-50 bg-white"
                            >
                                <Trash2 className="text-destructive size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-0">
                <section className="mb-6">
                    <p className="text-label-xs text-muted-foreground tracking-wide uppercase">
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
                    <p className="text-label-xs text-muted-foreground tracking-wide uppercase">
                        Description
                    </p>
                    <div className="border-border bg-background mt-2 rounded-lg border p-4">
                        <BlockNoteViewer
                            key={taskTemplatePreview.id}
                            content={taskTemplatePreview.description as BlockNoteContent}
                        />
                    </div>
                </section>
                <section className="mb-6">
                    <p className="text-label-xs text-muted-foreground tracking-wide uppercase">
                        Languages
                    </p>
                    <div className="border-border bg-background mt-2 rounded-lg border p-4">
                        <div className="flex flex-wrap gap-1.5">
                            {languages.map((language) => (
                                <Chip key={language} variant="outline">
                                    {language}
                                </Chip>
                            ))}
                        </div>
                    </div>
                </section>
                <div className="mb-0">
                    <p className="text-body-s text-muted-foreground">
                        Authored by{' '}
                        <span className="text-label-xs text-muted-foreground font-bold">
                            {taskTemplatePreview.author?.name ?? '-'}
                        </span>
                    </p>
                    <Link
                        href="#"
                        className="text-body-s text-sarge-primary-500 hover:text-sarge-primary-600 mt-1 inline-block underline underline-offset-4"
                    >
                        Used in {taskTemplatePreview.assessmentTemplatesCount} assessment
                        {taskTemplatePreview.assessmentTemplatesCount !== 1 ? 's' : ''}
                    </Link>
                </div>
            </div>
        </div>
    );
}
