'use client';

import { AlarmClock, ExternalLink, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { BlockNoteViewer } from '@/lib/components/core/BlockNoteViewer';
import type { AssessmentTaskTemplatePreviewDTO } from '@/lib/schemas/assessment-template.schema';

interface TaskDescriptionPreviewProps {
    taskTemplate: AssessmentTaskTemplatePreviewDTO;
    onGoToTaskTemplate: () => void;
    onDeleteSection: () => void;
}

export default function TaskDescriptionPreview({
    taskTemplate,
    onGoToTaskTemplate,
    onDeleteSection,
}: TaskDescriptionPreviewProps) {
    return (
        <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-6 pt-6">
            <div className="flex w-full flex-col gap-1">
                <div className="flex w-full items-center justify-between">
                    <h2 className="text-display-xs">{taskTemplate.title}</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="icon"
                                className="h-8 w-8 p-0"
                                aria-label="More options"
                            >
                                <MoreVertical className="size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="border-border bg-background w-52 border"
                        >
                            <DropdownMenuItem
                                onSelect={onGoToTaskTemplate}
                                className="text-sarge-gray-700 hover:bg-card focus:bg-card bg-background hover:cursor-pointer"
                            >
                                <ExternalLink className="size-4" />
                                Go to Task Template
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    onDeleteSection();
                                }}
                                className="text-destructive hover:text-destructive focus:text-destructive hover:bg-card focus:bg-card bg-background hover:cursor-pointer"
                            >
                                <Trash2 className="text-destructive size-4" />
                                Delete Section
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {taskTemplate.timeLimitMinutes > 0 && (
                    <div className="flex w-full items-center gap-2">
                        <AlarmClock className="text-foreground size-5" />
                        <span className="text-label-s">{taskTemplate.timeLimitMinutes}:00</span>
                    </div>
                )}
            </div>

            <BlockNoteViewer key={taskTemplate.id} content={taskTemplate.description} />
        </div>
    );
}
