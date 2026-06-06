'use client';

import type { TaskWithReviewData } from '@/lib/types/position.types';

type ActivityLogTaskSubmissionProps = {
    task: TaskWithReviewData | null;
};

// TODO: render the proctoring snapshot timeline from task.snapshots
export default function ActivityLogTaskSubmission(_props: ActivityLogTaskSubmissionProps) {
    return <div>TODO</div>;
}
