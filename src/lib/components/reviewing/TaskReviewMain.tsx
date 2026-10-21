'use client';

import TestCasesTaskSubmission from '@/lib/components/reviewing/TestCasesTaskSubmission';
import type { TaskWithReviewData } from '@/lib/types/position.types';

type TaskReviewMainProps = {
    task: TaskWithReviewData | null;
};

export default function TaskReviewMain({ task }: TaskReviewMainProps) {
    return (
        <div className="flex min-w-0 basis-[70%] flex-col gap-4 overflow-hidden pr-4">
            <TestCasesTaskSubmission task={task} />
        </div>
    );
}
