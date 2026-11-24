import { DashboardEmptyState } from '@/lib/components/dashboard/DashboardEmptyState';
import { DashboardPanel, DashboardPanelHeader } from '@/lib/components/dashboard/DashboardPanel';
import { cn } from '@/lib/utils/cn.utils';

export function ReadyForReviewPanel({
    candidateCount = 0,
    className,
}: {
    candidateCount?: number;
    className?: string;
}) {
    return (
        <DashboardPanel className={cn('items-center justify-center', className)}>
            <DashboardPanelHeader
                title="Ready for Review"
                subtitle="Candidates fully graded and waiting on your decision"
                trailing={
                    // Figma sets this count in Inter rather than Satoshi.
                    <span className="font-inter text-sarge-gray-600 shrink-0 text-xs leading-4 font-normal">
                        {candidateCount} {candidateCount === 1 ? 'candidate' : 'candidates'}
                    </span>
                }
                className="px-1"
            />
            <DashboardEmptyState message="There are no candidates ready for review." />
        </DashboardPanel>
    );
}
