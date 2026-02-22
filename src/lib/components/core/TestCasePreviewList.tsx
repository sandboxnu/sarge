import TestCaseListShell from '@/lib/components/core/TestCaseListShell';
import type { TestCaseDTO } from '@/lib/schemas/task-template.schema';

interface TestCasePreviewListProps {
    publicTestCases: TestCaseDTO[];
    privateTestCases: TestCaseDTO[];
}

export default function TestCasePreviewList({
    publicTestCases,
    privateTestCases,
}: TestCasePreviewListProps) {
    return (
        <TestCaseListShell
            publicTestCases={publicTestCases}
            privateTestCases={privateTestCases}
            readOnly
        />
    );
}
