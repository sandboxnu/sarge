'use client';

import { useEffect, useState } from 'react';
import { AssessmentTemplateListItemDTO } from '@/lib/schemas/assessment-template.schema';
import { TaskPreview } from './AssessmentTaskPreview';
import { Button } from '@/lib/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { ChevronLeft, ChevronRight, SquarePen } from 'lucide-react';
import Link from 'next/link';

type AssessmentTemplateTaskOrder = {
    taskTemplateId: string;
    order: number;
};

type TaskTemplatePreview = {
    id: string;
    title: string;
    description: unknown;
};

export interface AssessmentTemplatePreviewProps {
    assessmentTemplatePreview: AssessmentTemplateListItemDTO;
}

export function AssessmentTemplatePreview({
    assessmentTemplatePreview,
}: AssessmentTemplatePreviewProps) {
    const [tasks, setTasks] = useState<AssessmentTemplateTaskOrder[]>([]);
    const [taskTemplates, setTaskTemplates] = useState<TaskTemplatePreview[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setCurrentIndex(0);

        const load = async () => {
            const tasksRes = await fetch(
                `/api/assessment-templates/${assessmentTemplatePreview.id}/tasks`
            );
            const tasksJson = await tasksRes.json();
            if (!tasksRes.ok) {
                throw new Error(tasksJson.message ?? 'Failed to load tasks');
            }

            const orderedTasks = (tasksJson.data as AssessmentTemplateTaskOrder[]) ?? [];
            const templates = await Promise.all(
                orderedTasks.map(async (task) => {
                    const res = await fetch(`/api/task-templates/${task.taskTemplateId}`);
                    const json = await res.json();
                    if (!res.ok) {
                        throw new Error(json.message ?? 'Failed to load task template');
                    }

                    return {
                        id: json.data.id as string,
                        title: json.data.title as string,
                        description: json.data.description as unknown,
                    } satisfies TaskTemplatePreview;
                })
            );

            if (!isMounted) return;
            setTasks(orderedTasks);
            setTaskTemplates(templates);
        };

        load()
            .catch(() => {
                if (!isMounted) return;
                setTasks([]);
                setTaskTemplates([]);
            })
            .finally(() => {
                if (!isMounted) return;
                setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [assessmentTemplatePreview.id]);

    const currentTask = taskTemplates[currentIndex];
    const totalTasks = tasks.length;

    if (isLoading) {
        return (
            <div className="text-body-m text-muted-foreground flex h-full items-center justify-center">
                Loading tasks...
            </div>
        );
    }

    if (totalTasks === 0) {
        return (
            <div className="text-body-m text-muted-foreground flex h-full items-center justify-center">
                No tasks in this assessment template
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col">
            <div className="border-border flex w-full flex-row items-center justify-between border-b px-6 py-5">
                <div className="flex w-full flex-col gap-1">
                    <h1 className="text-display-xs text-foreground truncate font-medium">
                        {assessmentTemplatePreview.title}
                    </h1>
                    <div className="flex flex-row items-center gap-0.5">
                        <p className="text-body-s font-medium text-gray-400">Assigned to</p>
                        <p className="text-label-s text-sarge-primary-600 underline">
                            {assessmentTemplatePreview.positions.length > 0
                                ? assessmentTemplatePreview.positions
                                      .map((position) => position.title)
                                      .join(', ')
                                : '0 positions'}
                        </p>
                    </div>
                </div>
                <Button variant="secondary" className="h-fit px-4 py-2" asChild>
                    <Link aria-label="Edit assessment template" href={''}>
                        <SquarePen className="size-5" />
                        Edit details
                    </Link>
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {currentTask ? (
                    <TaskPreview taskTemplatePreview={currentTask} />
                ) : (
                    <div className="text-body-m text-muted-foreground flex h-full items-center justify-center">
                        Select a task to preview
                    </div>
                )}
            </div>

            <div className="border-border flex w-full items-center justify-between border-t px-6 py-3">
                <div className="flex flex-row items-center gap-0.5">
                    <p className="text-body-s font-medium text-gray-400">Created by</p>
                    <p className="text-body-s font-bold text-gray-400">
                        {assessmentTemplatePreview.author?.name ?? 'Unknown'}
                    </p>
                </div>

                <div className="bg-sarge-gray-0 border-sarge-gray-200 flex items-center rounded-lg border-1">
                    <div className="flex-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="bg-sarge-gray-0 hover:bg-sarge-gray-100 border-sarge-gray-200 flex cursor-pointer items-center gap-2 rounded-l-lg border-r-1 px-3 py-2">
                                    <span className="text-sarge-gray-800 text-sm font-medium">
                                        {currentTask?.title ?? 'Select task'}
                                    </span>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {tasks.map((task, index) => (
                                    <DropdownMenuItem
                                        key={`${task.taskTemplateId}-${task.order}`}
                                        onSelect={() => setCurrentIndex(index)}
                                    >
                                        {taskTemplates[index]?.title ?? 'Task'}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="bg-sarge-gray-0 flex rounded-r-lg">
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                            disabled={currentIndex === 0}
                            className="bg-sarge-gray-0 size-9 rounded-lg border-none"
                        >
                            <ChevronLeft className="size-4 !text-black" />
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                setCurrentIndex((prev) => Math.min(prev + 1, totalTasks - 1))
                            }
                            disabled={currentIndex === totalTasks - 1}
                            className="bg-sarge-gray-0 size-9 border-none"
                        >
                            <ChevronRight className="size-4 !text-black" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
