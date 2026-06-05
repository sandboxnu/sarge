'use client';

import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { formatDueDate } from '@/lib/utils/date.utils';

type ReviewNavbarProps = {
    assessmentName: string;
    dueDate: Date | null;
    candidateName: string;
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
        <div className="flex items-center border-b py-2 px-4">
            <div className="flex flex-[7] min-w-0 flex-col gap-0.5 pr-4">
                <h1 className="text-sarge-gray-900 truncate text-lg font-bold tracking-tight">
                    {assessmentName}
                </h1>
                <p className="text-sarge-gray-500 text-xs">Due: {formatDueDate(dueDate)}</p>
            </div>

            <div className="w-px" />

            <div className="flex flex-[3] ml-4">
                <div className="border-sarge-gray-200 flex w-full items-center justify-between rounded-md border bg-white px-3 py-2">
                    <div className="flex items-center">
                        <div className="border-sarge-gray-200 text-sarge-gray-800 mr-2 flex size-7 items-center justify-center rounded-md border">
                            <User className="size-4" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <div className="text-sarge-gray-900 flex items-center gap-1 font-semibold">
                                <span className="truncate">{candidateName}</span>
                                <ChevronDown className="text-sarge-gray-400 size-4 shrink-0" />
                            </div>
                            <span className="text-sarge-gray-500 text-xs">
                                {currentTask} of {totalTasks} tasks
                            </span>
                        </div>
                    </div>

                    <div className="ml-2 flex items-center gap-1">
                        <Button
                            variant="icon"
                            onClick={onPrev}
                            className="border-sarge-gray-200 border border-solid [&_svg]:text-sarge-gray-800"
                        >
                            <ChevronDown className="size-4" />
                        </Button>
                        <Button
                            variant="icon"
                            onClick={onNext}
                            className="border-sarge-gray-200 border border-solid [&_svg]:text-sarge-gray-800"
                        >
                            <ChevronUp className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
