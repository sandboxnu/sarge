'use client';

import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDueDate } from '@/lib/utils/date.utils';

type ReviewNavbarProps = {
    assessmentName: string;
    dueDate: Date | null;
    candidateName: string;
    // 1-based index of the task currently in view, and the total task count
    currentTask: number;
    totalTasks: number;
    onPrev: () => void;
    onNext: () => void;
};

export default function ReviewNavbar({
    assessmentName,
    dueDate,
    candidateName,
    currentTask,
    totalTasks,
    onPrev,
    onNext,
}: ReviewNavbarProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-0.5">
                <h1 className="text-sarge-gray-900 truncate text-lg font-bold tracking-tight">
                    {assessmentName}
                </h1>
                <p className="text-sarge-gray-500 font-semibold text-xs">Due: {formatDueDate(dueDate)}</p>
            </div>

            {/* right: candidate box with task navigation */}
            <div className="border-sarge-gray-200 flex shrink-0 items-center gap-3 rounded-xl border bg-white px-3 py-2">
                <div className="border-sarge-gray-200 text-sarge-gray-500 flex size-9 items-center justify-center rounded-lg border">
                    <User className="size-5" />
                </div>

                <div className="flex min-w-0 flex-col">
                    <div className="text-sarge-gray-900 flex items-center gap-1 font-semibold">
                        <span className="truncate">{candidateName}</span>
                        <ChevronDown className="text-sarge-gray-400 size-4 shrink-0" />
                    </div>
                    <span className="text-sarge-gray-500 text-xs">
                        {currentTask} of {totalTasks} tasks graded
                    </span>
                </div>

                <div className="ml-2 flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Previous task"
                        onClick={onPrev}
                        className="border-sarge-gray-200 text-sarge-gray-600 hover:bg-sarge-gray-100 flex size-8 items-center justify-center rounded-lg border"
                    >
                        <ChevronDown className="size-4" />
                    </button>
                    <button
                        type="button"
                        aria-label="Next task"
                        onClick={onNext}
                        className="border-sarge-gray-200 text-sarge-gray-600 hover:bg-sarge-gray-100 flex size-8 items-center justify-center rounded-lg border"
                    >
                        <ChevronUp className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
