'use client';

import { useEffect } from 'react';
import type { TaskWithReviewData } from '@/lib/types/position.types';
import { useActivityLog } from '@/lib/hooks/useActivityLog';
import {
    formatTimestamp,
    getEventColor,
    getEventLabel,
    isPointEvent,
} from '@/lib/utils/activity-log.utils';
import { cn } from '@/lib/utils/cn.utils';

type ActivityLogTaskSubmissionProps = {
    task: TaskWithReviewData | null;
    onPreviewContentChange?: (content: string | null) => void;
};

const POINT_EVENT_WIDTH_PX = 14;
const SELECTED_EVENT_WIDTH_PX = 22;

export default function ActivityLogTaskSubmission({
    task,
    onPreviewContentChange,
}: ActivityLogTaskSubmissionProps) {
    const { events, durationMs, selectedEvent, selectEvent, previewContent } = useActivityLog(
        task?.snapshots ?? [],
        task?.startedAt ?? new Date(),
        task?.submittedAt ?? null
    );

    // Lets the editor swap in the code as it looked at the scrubbed point in time
    useEffect(() => {
        onPreviewContentChange?.(previewContent);
    }, [previewContent, onPreviewContentChange]);

    if (!task || durationMs === 0) return null;

    function toPercent(ms: number) {
        return (ms / durationMs) * 100;
    }

    return (
        <div className="bg-sarge-gray-800 border-sarge-gray-700 flex shrink-0 items-center justify-between gap-2 border-t py-3 pr-3 pl-4">
            <div className="flex flex-1 items-center gap-2">
                <span className="text-label-xs tracking-design text-sarge-gray-100">00:00</span>
                <div className="relative h-[19px] min-w-0 flex-1">
                    <div className="bg-sarge-gray-700 absolute top-1/2 right-0 left-0 h-[10px] -translate-y-1/2 rounded-full" />
                    {events.map((event) => {
                        const isSelected = selectedEvent?.id === event.id;
                        const left = toPercent(event.startMs);
                        const width = isPointEvent(event.type)
                            ? isSelected
                                ? SELECTED_EVENT_WIDTH_PX
                                : POINT_EVENT_WIDTH_PX
                            : undefined;

                        const label = isPointEvent(event.type)
                            ? `${getEventLabel(event.type)} at ${formatTimestamp(event.startMs)}`
                            : `${getEventLabel(event.type)} — ${formatTimestamp(event.endMs - event.startMs)}`;

                        return (
                            <button
                                key={event.id}
                                type="button"
                                aria-label={label}
                                title={label}
                                onClick={() => selectEvent(event.id)}
                                className={cn(
                                    'absolute top-1/2 h-[10px] -translate-y-1/2 rounded-full transition-all',
                                    getEventColor(event.type),
                                    isSelected && 'border-sarge-warning-100 border-2'
                                )}
                                style={{
                                    left: `${left}%`,
                                    width: width
                                        ? `${width}px`
                                        : `${toPercent(event.endMs) - left}%`,
                                }}
                            />
                        );
                    })}
                </div>
                <span className="text-label-xs tracking-design text-sarge-gray-100">
                    {formatTimestamp(selectedEvent ? selectedEvent.startMs : durationMs)}
                </span>
            </div>
            {selectedEvent && (
                <div className="bg-sarge-gray-700 flex shrink-0 items-start rounded-[4px] px-1.5 py-[3px]">
                    <span className="text-[10px] font-medium tracking-[0.4px] text-[#fbd1b3]">
                        {getEventLabel(selectedEvent.type)}
                    </span>
                </div>
            )}
        </div>
    );
}
