import Link from 'next/link';
import { UserRoundCheck } from 'lucide-react';
import { Chip } from '@/lib/components/ui/Chip';
import { Skeleton } from '@/lib/components/ui/Skeleton';
import { formatTimeAgo } from '@/lib/utils/date.utils';
import { formatFinishedReviewers } from '@/lib/utils/reviewing.utils';
import {
    type AwaitingYourReviewItem,
    type ContinueGradingItem,
    type LiveAssessmentSummary,
} from '@/lib/types/reviewing.types';

interface SidePanelSectionProps {
    liveAssessments: LiveAssessmentSummary[];
    loading: boolean;
}

function reviewHref(item: { positionId: string; applicationId: string }) {
    return `/crm/reviewing/position/${item.positionId}/application/${item.applicationId}`;
}

const ROW_CLASSES =
    'hover:bg-sarge-gray-50 focus-visible:ring-sarge-primary-500 flex flex-col gap-2 px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset';

function CaughtUp() {
    return (
        <div className="text-body-m text-sarge-gray-800 flex flex-1 items-center justify-center py-8">
            You are all caught up!
        </div>
    );
}

function RowsSkeleton() {
    return (
        <div className="flex flex-col gap-3 px-4 py-2" aria-busy="true" aria-label="Loading">
            {Array.from({ length: 2 }, (_, i) => (
                <Skeleton key={i} className="h-[52px] rounded-lg" />
            ))}
        </div>
    );
}

function SectionHeading({ children }: { children: string }) {
    return <h2 className="text-label-s text-sarge-gray-600 px-4">{children}</h2>;
}

function ContinueGradingRow({ item }: { item: ContinueGradingItem }) {
    return (
        <li>
            <Link href={reviewHref(item)} className={ROW_CLASSES}>
                <div className="flex min-w-0 items-center gap-2">
                    <h3
                        className="text-label-s text-sarge-gray-800 truncate"
                        title={item.positionTitle}
                    >
                        {item.positionTitle}
                    </h3>
                    <Chip variant="neutral" className="shrink-0">
                        {item.tasksLeft}/{item.taskCount} left to review
                    </Chip>
                </div>
                <p className="text-body-s text-sarge-gray-500">
                    Last edited {formatTimeAgo(item.lastEditedAt)}
                </p>
            </Link>
        </li>
    );
}

function AwaitingYourReviewRow({ item }: { item: AwaitingYourReviewItem }) {
    const detail = item.lastFinishedAt
        ? `${formatFinishedReviewers(item.finishedReviewerNames)} ${formatTimeAgo(item.lastFinishedAt)}`
        : item.submittedAt
          ? `Submitted ${formatTimeAgo(item.submittedAt)}`
          : 'Submitted';

    return (
        <li>
            <Link href={reviewHref(item)} className={ROW_CLASSES}>
                <h3
                    className="text-label-s text-sarge-gray-800 truncate"
                    title={item.positionTitle}
                >
                    {item.positionTitle}
                </h3>
                <div className="flex min-w-0 items-center gap-2">
                    <UserRoundCheck className="text-sarge-gray-500 size-5 shrink-0" />
                    <p className="text-body-s text-sarge-gray-500 truncate" title={detail}>
                        {detail}
                    </p>
                </div>
            </Link>
        </li>
    );
}

function activePositions(liveAssessments: LiveAssessmentSummary[]) {
    return liveAssessments.filter((item) => !item.archived);
}

export function ContinueGradingSection({ liveAssessments, loading }: SidePanelSectionProps) {
    const items = activePositions(liveAssessments)
        .flatMap((position) => position.continueGrading)
        .sort((a, b) => b.lastEditedAt.localeCompare(a.lastEditedAt));

    return (
        <section className="flex h-[250px] shrink-0 flex-col gap-2 pt-4 pb-2">
            <SectionHeading>Continue Grading</SectionHeading>
            {loading ? (
                <RowsSkeleton />
            ) : items.length === 0 ? (
                <CaughtUp />
            ) : (
                <ul className="flex min-h-0 flex-col overflow-y-auto">
                    {items.map((item) => (
                        <ContinueGradingRow key={item.applicationId} item={item} />
                    ))}
                </ul>
            )}
        </section>
    );
}

export function AwaitingReviewSection({ liveAssessments, loading }: SidePanelSectionProps) {
    // most recent activity (someone finishing, else the candidate submitting) first
    const activityAt = (item: AwaitingYourReviewItem) =>
        item.lastFinishedAt ?? item.submittedAt ?? '';
    const items = activePositions(liveAssessments)
        .flatMap((position) => position.awaitingYourReview)
        .sort((a, b) => activityAt(b).localeCompare(activityAt(a)));

    return (
        <section className="border-sarge-gray-200 flex min-h-0 flex-1 flex-col gap-2 border-t pt-4">
            <SectionHeading>Awaiting Your Review</SectionHeading>
            {loading ? (
                <RowsSkeleton />
            ) : items.length === 0 ? (
                <CaughtUp />
            ) : (
                <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto pb-4">
                    {items.map((item) => (
                        <AwaitingYourReviewRow key={item.applicationId} item={item} />
                    ))}
                </ul>
            )}
        </section>
    );
}
