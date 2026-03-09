'use client';

import * as React from 'react';
import { AlarmClock } from 'lucide-react';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';
import { TaskTemplatePreviewPanel } from './TaskTemplatePreviewPanel';

export interface TaskPreviewProps {
    taskTemplatePreview: TaskTemplateListItemDTO;
}

export function TaskAssessmentPreview({ taskTemplatePreview }: TaskPreviewProps) {
    const { title } = taskTemplatePreview;
    return (
        <div className="flex h-full w-full flex-col gap-2 px-6 py-4">
            <div className="inline-flex flex-col items-start gap-1 self-stretch">
                <h2 className="text-display-xs justify-start font-medium text-neutral-800">
                    {title}
                </h2>
                <div className="inline-flex items-center justify-start gap-2 self-stretch">
                    <AlarmClock className="h-5 w-5 text-neutral-700" />
                    {/* TODO: add task template time limit field here */}
                    <p className="text-body-s font-medium text-neutral-800"> Coming Soon... </p>
                </div>
            </div>
            <div>
                <TaskTemplatePreviewPanel
                    removeHeader={true}
                    taskTemplatePreview={taskTemplatePreview}
                />
            </div>
        </div>
    );
}
