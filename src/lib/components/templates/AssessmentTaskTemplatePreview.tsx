'use client';

import * as React from 'react';
import { AlarmClock } from 'lucide-react';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';
import { TaskTemplatePreview } from './TaskTemplatePreview';

export interface AssessmentTaskTemplatePreviewProps {
    taskTemplatePreview: TaskTemplateListItemDTO;
}

export function AssessmentTaskTemplatePreview({
    taskTemplatePreview,
}: AssessmentTaskTemplatePreviewProps) {
    const { title, estimatedTime } = taskTemplatePreview;
    return (
        <div className="flex h-full w-full flex-col gap-2 px-6 py-4">
            <div className="inline-flex flex-col items-start gap-1 self-stretch pl-3">
                <h2 className="text-display-xs justify-start font-medium text-neutral-800">
                    {title}
                </h2>
                <div className="inline-flex items-center justify-start gap-2 self-stretch">
                    <AlarmClock className="h-5 w-5 text-neutral-700" />
                    <p className="text-body-s font-medium text-neutral-800">
                        {estimatedTime} minutes
                    </p>
                </div>
            </div>
            <div>
                <TaskTemplatePreview
                    removeHeader={true}
                    taskTemplatePreview={taskTemplatePreview}
                />
            </div>
        </div>
    );
}
