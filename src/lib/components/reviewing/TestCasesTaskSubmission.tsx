'use client';

import type { TaskWithReviewData } from '@/lib/types/position.types';

type TestCasesTaskSubmissionProps = {
    task: TaskWithReviewData | null;
};

// TODO: render per-test-case detail from task.testResults
export default function TestCasesTaskSubmission(_props: TestCasesTaskSubmissionProps) {
    return <div>TODO</div>;
}
