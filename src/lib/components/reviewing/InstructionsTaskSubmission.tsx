'use client';

import type { TaskWithReviewData } from '@/lib/types/position.types';

type InstructionsTaskSubmissionProps = {
    task: TaskWithReviewData | null;
};

// TODO: render the task's instructions (needs the TaskTemplate description in the review query)
export default function InstructionsTaskSubmission(_props: InstructionsTaskSubmissionProps) {
    return <div>TODO</div>;
}
