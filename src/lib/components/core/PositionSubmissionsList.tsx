'use client';

import Link from 'next/link';
import { Chip } from '@/lib/components/ui/Chip';
import { ReviewerSelect } from '@/lib/components/core/ReviewerSelect';
import { Button } from '@/lib/components/ui/Button';
import { type ApplicationDisplayInfo } from '@/lib/types/position.types';
import { getAssessmentStatusLabel, getAssessmentStatusVariant } from '@/lib/utils/status.utils';

type PositionSubmissionsListProps = {
    positionId: string;
    candidates: ApplicationDisplayInfo[];
    reviewerOptions: { id: string; name: string }[];
    onAssignReviewers: (assessmentId: string, reviewerIds: string[]) => void;
};

const SUBMITTED_STATUSES = ['SUBMITTED', 'GRADED'];

function statusLabel(status: ApplicationDisplayInfo['assessmentStatus']) {
    // The shared helper labels NOT_STARTED "Sent"; the submissions list shows the candidate's progress
    return status === 'NOT_STARTED' ? 'Not Started' : getAssessmentStatusLabel(status);
}

export function PositionSubmissionsList({
    positionId,
    candidates,
    reviewerOptions,
    onAssignReviewers,
}: PositionSubmissionsListProps) {
    const rows = candidates.filter((c) => c.assessment);
    const submittedCount = rows.filter((c) =>
        SUBMITTED_STATUSES.includes(c.assessmentStatus)
    ).length;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <h2 className="text-label-l text-sarge-gray-800">Submissions</h2>
                <Chip variant="outline" className="text-label-xs px-2 py-1">
                    {submittedCount}/{rows.length} submitted
                </Chip>
            </div>
            <div className="pb-4">
                {rows.map((c) => {
                    const canView = SUBMITTED_STATUSES.includes(c.assessmentStatus);
                    const reviewers = c.assessment?.reviewers ?? [];
                    return (
                        <div
                            key={c.id}
                            className="border-sarge-gray-200 flex h-[76px] items-center justify-between gap-4 border-t px-5 py-4"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-label-s text-sarge-gray-800">
                                    {c.candidate.name}
                                </span>
                                <Chip variant={getAssessmentStatusVariant(c.assessmentStatus)}>
                                    {statusLabel(c.assessmentStatus)}
                                </Chip>
                            </div>
                            <div className="flex items-center gap-2">
                                <ReviewerSelect
                                    options={reviewerOptions}
                                    selected={reviewers}
                                    onChange={(ids) =>
                                        c.assessment && onAssignReviewers(c.assessment.id, ids)
                                    }
                                />
                                <Button
                                    asChild={canView}
                                    className="h-10 px-5 py-2"
                                    disabled={!canView}
                                >
                                    {canView ? (
                                        <Link
                                            href={`/crm/reviewing/position/${positionId}/application/${c.id}`}
                                        >
                                            View submission
                                        </Link>
                                    ) : (
                                        'View submission'
                                    )}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
