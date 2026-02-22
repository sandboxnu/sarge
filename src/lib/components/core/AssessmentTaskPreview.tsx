'use client';

import * as React from 'react';
import { AlarmClock } from 'lucide-react';

export interface TaskPreviewProps {
    taskTemplatePreview: {
        id: string;
        title: string;
        description: unknown;
    };
}

export function TaskPreview({ taskTemplatePreview }: TaskPreviewProps) {
    const { title, description } = taskTemplatePreview;
    const hasDescription = Array.isArray(description)
        ? description.length > 0
        : Boolean(description);
    return (
        <div className="flex h-full w-full flex-col gap-2 overflow-hidden px-6 pt-4">
            <div className="inline-flex flex-col items-start gap-1 self-stretch">
                <h2 className="text-display-xs justify-start font-['Satoshi_Variable'] font-medium text-neutral-800">
                    {title}
                </h2>
                <div className="inline-flex items-center justify-start gap-2 self-stretch">
                    <AlarmClock className="h-5 w-5 text-neutral-700" />
                    <p className="text-body-s font-medium text-neutral-800"> 30:00 </p>
                </div>
            </div>
            <div>
                {hasDescription ? (
                    <div>
                        <pre className="text-body-s break-words whitespace-pre-wrap text-neutral-800">
                            {JSON.stringify(description, null, 2)}
                        </pre>
                    </div>
                ) : (
                    <div className="text-body-s text-muted-foreground">No description provided</div>
                )}
            </div>
        </div>
    );
}
