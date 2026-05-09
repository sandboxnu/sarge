'use client';
import { Archive, ArchiveRestore, MoreVertical, Trash2 } from 'lucide-react';
import { PositionAssessmentCard } from '@/lib/components/core/PositionAssessmentCard';
import { cn } from '@/lib/utils/cn.utils';
import { Chip } from '@/lib/components/ui/Chip';
import { Button } from '@/lib/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { getSubmissionVariant } from '@/lib/utils/status.utils';

type PositionCardProps = {
    title: string;
    candidateCount: number;
    sentCount?: number;
    submittedCount?: number;
    archived?: boolean;
    className?: string;
    onPositionClick?: () => void;
    onAssessmentClick?: () => void;
    onArchive: () => void;
    onUnarchive: () => void;
    onDelete: () => void;
};

export default function PositionCard({
    title,
    candidateCount,
    sentCount = 0,
    submittedCount = 0,
    archived = false,
    className,
    onPositionClick,
    onAssessmentClick,
    onArchive,
    onUnarchive,
    onDelete,
}: PositionCardProps) {
    const submissionVariant = getSubmissionVariant(submittedCount, sentCount);

    return (
        <div
            className={cn(
                'min-h-[160px] w-[384px]',
                'border-sarge-gray-200 bg-sarge-gray-50 rounded-md border p-4',
                onPositionClick && 'cursor-pointer transition-shadow hover:shadow-md',
                className
            )}
            onClick={(e) => {
                // checks whether click came from inside menu button, on which we should return
                // since this should trigger onAssessmentClick only
                if ((e.target as HTMLElement).closest('[data-menu-button]')) {
                    return;
                }
                onPositionClick?.();
            }}
            role={onPositionClick ? 'button' : undefined}
            tabIndex={onPositionClick ? 0 : undefined}
            onKeyDown={
                onPositionClick
                    ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onPositionClick();
                          }
                      }
                    : undefined
            }
        >
            <div className={cn('-mr-4 flex items-start justify-between gap-2')}>
                <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-1 px-1">
                    <h3 className="text-label-s text-sarge-gray-800 line-clamp-2" title={title}>
                        {title}
                    </h3>

                    <p className="text-body-s text-sarge-gray-600">
                        {candidateCount} {candidateCount === 1 ? 'candidate' : 'candidates'}
                    </p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            data-menu-button
                            variant="icon"
                            className="text-sarge-gray-800 grid min-h-[44px] min-w-[44px] place-items-center bg-transparent p-0"
                            aria-label="More options"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="border-sarge-gray-200 w-48 border bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DropdownMenuItem
                            onSelect={() => (archived ? onUnarchive() : onArchive())}
                            className="text-sarge-gray-700 hover:bg-sarge-gray-50 focus:bg-sarge-gray-50 bg-white hover:cursor-pointer"
                        >
                            {archived ? (
                                <ArchiveRestore className="size-4" />
                            ) : (
                                <Archive className="size-4" />
                            )}
                            {archived ? 'Unarchive' : 'Archive'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault();
                                onDelete();
                            }}
                            className="text-destructive hover:text-destructive focus:text-destructive hover:bg-sarge-gray-50 focus:bg-sarge-gray-50 bg-white hover:cursor-pointer"
                        >
                            <Trash2 className="text-destructive size-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <PositionAssessmentCard
                className="mt-4 w-full"
                onClick={(event) => {
                    event.stopPropagation();
                    onAssessmentClick?.();
                }}
            >
                <Chip variant="neutral">{sentCount} assigned</Chip>
                <Chip variant={submissionVariant}>
                    {submittedCount}/{sentCount} submitted
                </Chip>
            </PositionAssessmentCard>
        </div>
    );
}
