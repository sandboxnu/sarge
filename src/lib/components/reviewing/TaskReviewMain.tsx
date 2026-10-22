'use client';

import TestCasesTaskSubmission from '@/lib/components/reviewing/TestCasesTaskSubmission';
import type { TaskWithReviewData } from '@/lib/types/position.types';
import type { LineRange } from '@/lib/utils/comment.utils';

type TaskReviewMainProps = {
    task: TaskWithReviewData | null;
    selectedLines: LineRange | null;
    onSelectLines: (lines: LineRange | null) => void;
};

export default function TaskReviewMain({
    task,
    selectedLines,
    onSelectLines,
}: TaskReviewMainProps) {
    return (
        <div className="flex min-w-0 basis-[70%] flex-col gap-4 overflow-hidden pr-4">
            <TestCasesTaskSubmission
                task={task}
                selectedLines={selectedLines}
                onSelectLines={onSelectLines}
            />
        </div>
    );
}
