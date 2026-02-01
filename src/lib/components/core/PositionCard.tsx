'use client';
import { MoreVertical } from 'lucide-react';
import { PositionAssessmentCard } from '@/lib/components/core/PositionAssessmentCard';
import { cn } from '@/lib/utils/cn.utils';
import { Chip } from '@/lib/components/ui/Chip';
import { getSubmissionVariant } from '@/lib/utils/status.utils';

type PositionCardProps = {
    title: string;
    candidateCount: number;
    assessmentName?: string;
    assignedCount?: number;
    submittedCount?: number;
    totalAssigned?: number;
    className?: string;
    onClick?: () => void;
    onAssessmentClick?: () => void;
};

export default function PositionCard({
    title,
    candidateCount,
    assignedCount = 0,
    submittedCount = 0,
    totalAssigned = 0,
    className,
    onClick,
    onAssessmentClick,
}: PositionCardProps) {
    const submissionVariant = getSubmissionVariant(submittedCount, totalAssigned);

    return (
        <div
            className={cn(
                'min-h-[160px] w-[384px]',
                'border-sarge-gray-200 bg-sarge-gray-50 rounded-md border p-4',
                onClick && 'cursor-pointer transition-shadow hover:shadow-md',
                className
            )}
            onClick={(e) => {
                if ((e.target as HTMLElement).closest('[data-menu-button]')) {
                    return;
                }
                onClick?.();
            }}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onClick();
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

                <button
                    data-menu-button
                    className="text-sarge-gray-800 grid min-h-[44px] min-w-[44px] place-items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreVertical className="h-5 w-5" />
                </button>
            </div>
            <PositionAssessmentCard
                className="mt-4 w-full"
                onClick={(event) => {
                    event.stopPropagation();
                    onAssessmentClick?.();
                }}
            >
                <Chip variant="neutral">{assignedCount} sent</Chip>
                <Chip variant={submissionVariant}>
                    {submittedCount}/{totalAssigned} submitted
                </Chip>
            </PositionAssessmentCard>
        </div>
    );
}
