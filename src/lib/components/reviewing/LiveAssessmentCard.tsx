import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Chip } from '@/lib/components/ui/Chip';
import SummaryCircle from '@/lib/components/reviewing/SummaryCircle';
import { cn } from '@/lib/utils/cn.utils';
import { getReviewProgress } from '@/lib/utils/reviewing.utils';
import { type LiveAssessmentStatus, type LiveAssessmentSummary } from '@/lib/types/reviewing.types';

export default function LiveAssessmentCard({ item }: { item: LiveAssessmentSummary }) {
    const { candidateCount } = item;

    return (
        <Link
            href={`/crm/reviewing/position/${item.positionId}/application/${item.reviewTargetApplicationId}`}
            aria-label={`Review ${item.positionTitle}: ${item.assessmentTemplateTitle}`}
            className="focus-visible:ring-sarge-primary-500 flex flex-col rounded-lg transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
        >
            <ReviewProgressBar
                status={item.status}
                progress={getReviewProgress(item.reviewedCount, item.remainingCount)}
            />

            <div className="border-sarge-gray-200 bg-sarge-gray-50 flex flex-1 flex-col gap-4 rounded-b-lg border-x border-b p-5">
                <div className="flex items-start gap-1 px-1">
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <h3
                            className="text-label-s text-sarge-gray-800 truncate"
                            title={item.positionTitle}
                        >
                            {item.positionTitle}
                        </h3>
                        <p className="text-label-xs text-sarge-gray-500">
                            {candidateCount} {candidateCount === 1 ? 'candidate' : 'candidates'}
                        </p>
                    </div>

                    <ReviewStatusTag
                        status={item.status}
                        reviewedCount={item.reviewedCount}
                        remainingCount={item.remainingCount}
                    />
                </div>

                <div className="flex items-end gap-2">
                    <div className="flex min-w-0 flex-1 items-center gap-2 self-start">
                        <FileText className="text-sarge-gray-700 size-5 shrink-0" />
                        <p
                            className="text-label-xs text-sarge-gray-700 truncate"
                            title={item.assessmentTemplateTitle}
                        >
                            {item.assessmentTemplateTitle}
                        </p>
                    </div>

                    <SummaryCircle />
                </div>
            </div>
        </Link>
    );
}

export function ReviewProgressBar({
    status,
    progress,
}: {
    status: LiveAssessmentStatus;
    progress: number;
}) {
    const fill = status === 'COMPLETED' ? 1 : status === 'NOT_STARTED' ? 0 : progress;

    return (
        <div
            role="progressbar"
            aria-label="Review progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(fill * 100)}
            className="bg-sarge-gray-200 h-[5px] w-full overflow-hidden rounded-t-lg"
        >
            <div
                className={cn(
                    'h-full transition-[width]',
                    status === 'COMPLETED' ? 'bg-sarge-success-500' : 'bg-sarge-gray-500'
                )}
                style={{ width: `${fill * 100}%` }}
            />
        </div>
    );
}

export function ReviewStatusTag({
    status,
    reviewedCount,
    remainingCount,
}: {
    status: LiveAssessmentStatus;
    reviewedCount: number;
    remainingCount: number;
}) {
    switch (status) {
        case 'COMPLETED':
            return (
                <Chip variant="success" className="shrink-0">
                    Complete
                </Chip>
            );
        case 'IN_PROGRESS':
            return (
                <Chip variant="neutral" className="text-sarge-gray-700 shrink-0">
                    {reviewedCount} reviewed / {remainingCount} remaining
                </Chip>
            );
        case 'NOT_STARTED':
            return (
                <Chip variant="neutral" className="shrink-0">
                    Not started
                </Chip>
            );
    }
}
