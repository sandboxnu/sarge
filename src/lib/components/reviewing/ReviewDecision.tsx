'use client';

import type { TaskWithReviewData } from '@/lib/types/position.types';

type ReviewDecisionProps = {
    task: TaskWithReviewData | null;
};

// TODO: accept/reject decision panel
export default function ReviewDecision(_props: ReviewDecisionProps) {
    return <div>TODO</div>;
}
