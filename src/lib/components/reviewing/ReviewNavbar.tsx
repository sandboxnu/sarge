'use client';

import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/lib/components/ui/Dropdown';
import { cn } from '@/lib/utils/cn.utils';
import { formatDeadline } from '@/lib/utils/date.utils';
import type { ReviewableApplication } from '@/lib/hooks/usePositionApplications';

type ReviewNavbarProps = {
    assessmentName: string;
    dueDate: Date | null;
    candidateName: string;
    applications: ReviewableApplication[];
    currentApplicationId: string;
    onPrev: () => void;
    onNext: () => void;
    onSelectApplication: (applicationId: string) => void;
};

export default function ReviewNavbar({
    assessmentName,
    dueDate,
    candidateName,
    applications,
    currentApplicationId,
    onPrev,
    onNext,
    onSelectApplication,
}: ReviewNavbarProps) {
    const currentIndex = applications.findIndex((a) => a.id === currentApplicationId);
    const total = applications.length;
    const position = currentIndex >= 0 ? currentIndex + 1 : 0;

    return (
        <div className="flex items-center border-b px-4 py-2">
            <div className="flex min-w-0 basis-[70%] flex-col gap-0.5 pr-4">
                <h1 className="text-sarge-gray-900 truncate text-lg font-bold tracking-tight">
                    {assessmentName}
                </h1>
                <p className="text-sarge-gray-500 text-xs">Due: {formatDeadline(dueDate)}</p>
            </div>

            <div className="ml-4 flex basis-[30%]">
                <div className="border-sarge-gray-200 flex w-full items-center justify-between rounded-md border bg-white px-3 py-2">
                    <div className="flex min-w-0 items-center">
                        <div className="border-sarge-gray-200 text-sarge-gray-800 mr-2 flex size-7 shrink-0 items-center justify-center rounded-md border">
                            <User className="size-4" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="text-sarge-gray-900 flex min-w-0 items-center gap-1 font-semibold"
                                    >
                                        <span className="truncate">{candidateName}</span>
                                        <ChevronDown className="text-sarge-gray-400 size-4 shrink-0" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="max-h-64">
                                    {applications.map((application) => (
                                        <DropdownMenuItem
                                            key={application.id}
                                            onClick={() => onSelectApplication(application.id)}
                                            className={cn(
                                                application.id === currentApplicationId &&
                                                'bg-sarge-gray-50'
                                            )}
                                        >
                                            {application.candidateName}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <span className="text-sarge-gray-500 text-xs">
                                {position} of {total} submissions
                            </span>
                        </div>
                    </div>

                    <div className="ml-2 flex items-center gap-1">
                        <Button
                            variant="icon"
                            aria-label="Previous submission"
                            onClick={onPrev}
                            className="border-sarge-gray-200 [&_svg]:text-sarge-gray-800 border border-solid"
                        >
                            <ChevronDown className="size-4" />
                        </Button>
                        <Button
                            variant="icon"
                            aria-label="Next submission"
                            onClick={onNext}
                            className="border-sarge-gray-200 [&_svg]:text-sarge-gray-800 border border-solid"
                        >
                            <ChevronUp className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
