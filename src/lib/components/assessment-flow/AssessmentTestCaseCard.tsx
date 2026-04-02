import { Loader2, CircleCheck, CircleX, AlarmClock } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';
import { Chip } from '@/lib/components/ui/Chip';
import type { TestCaseDTO } from '@/lib/schemas/task-template.schema';
import type { TestCaseResult } from '@/lib/hooks/useAssessment';

type AssessmentTestCaseCardProps = {
    index: number;
    testCase: TestCaseDTO;
    result: TestCaseResult;
    isExpanded: boolean;
    onToggle: () => void;
};

export default function AssessmentTestCaseCard({
    index,
    testCase,
    result,
    isExpanded,
    onToggle,
}: AssessmentTestCaseCardProps) {
    const isFailed = result.status === 'failed';
    const isPassed = result.status === 'passed';
    const isLoading = result.status === 'loading';
    const isRuntimeError = result.status === 'runtime_error';
    const hasRun = isFailed || isPassed || isRuntimeError;
    const isError = isFailed || isRuntimeError;

    return (
        <div className="border-sarge-gray-200 bg-background w-full rounded-lg border p-5 shadow-xs">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center gap-3 text-left"
            >
                {isLoading && (
                    <Loader2 className="text-sarge-gray-500 size-4.5 flex-shrink-0 animate-spin" />
                )}
                {isFailed && (
                    <Chip variant="error" className="flex flex-shrink-0 items-center gap-1">
                        <CircleX className="size-3.5" />
                        <span>Failed</span>
                    </Chip>
                )}
                {isPassed && (
                    <Chip variant="success" className="flex flex-shrink-0 items-center gap-1">
                        <CircleCheck className="size-3.5" />
                        <span>Passed</span>
                    </Chip>
                )}
                {isRuntimeError && (
                    <Chip variant="error" className="flex flex-shrink-0 items-center gap-1">
                        <AlarmClock className="size-3.5" />
                        <span>Runtime Error</span>
                    </Chip>
                )}
                <span className="text-sarge-gray-800 text-sm font-medium">
                    Test Case {index + 1}
                </span>
            </button>

            {isExpanded && (
                <div className="mt-4.5 space-y-4.5">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <p className="text-sarge-gray-800 mb-2 text-sm font-medium">Input</p>
                            <div className="bg-background border-sarge-gray-200 text-sarge-gray-500 flex h-10.5 items-center overflow-hidden rounded-md border px-3 py-2 text-sm">
                                {String(testCase.input ?? '')}
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sarge-gray-800 mb-2 text-sm font-medium">
                                Expected Output
                            </p>
                            <div className="bg-background border-sarge-gray-200 text-sarge-gray-500 flex h-10.5 items-center overflow-hidden rounded-md border px-3 py-2 text-sm">
                                {String(testCase.output ?? '')}
                            </div>
                        </div>
                    </div>
                    {hasRun && (
                        <div>
                            <p className="text-sarge-gray-800 mb-2 text-sm font-medium">
                                Actual Output
                            </p>
                            <div
                                className={cn(
                                    'flex h-10.5 items-center overflow-hidden rounded-lg border px-3 py-2 text-sm font-medium',
                                    isError
                                        ? 'bg-sarge-error-50 border-sarge-error-400 text-sarge-error-500'
                                        : 'bg-background border-sarge-gray-200 text-sarge-gray-500'
                                )}
                            >
                                {result.actualOutput ?? ''}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
