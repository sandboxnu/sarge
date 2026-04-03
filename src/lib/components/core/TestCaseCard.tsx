import { type TestCaseDTO } from '@/lib/schemas/task-template.schema';
import type { TestCaseResult } from '@/lib/types/candidate-assessment.types';
import {
    Loader2,
    CircleCheck,
    CircleX,
    AlarmClock,
    Lock,
    Trash,
    CopyPlus,
    Unlock,
} from 'lucide-react';
import { Input } from '@/lib/components/ui/Input';
import { Chip } from '@/lib/components/ui/Chip';
import { cn } from '@/lib/utils/cn.utils';

type TestCaseCardBaseProps = {
    index: number;
    test: TestCaseDTO;
};

type TestCaseCardSelectionProps = {
    selected: boolean;
    onSelect: () => void;
};

type TestCaseCardReadOnlyProps = TestCaseCardBaseProps &
    TestCaseCardSelectionProps & {
        variant: 'editor';
        readOnly: true;
        isPrivate: boolean;
        result?: TestCaseResult;
    };

type TestCaseCardEditableProps = TestCaseCardBaseProps &
    TestCaseCardSelectionProps & {
        variant: 'editor';
        readOnly?: false;
        isPrivate: boolean;
        isSaving?: boolean;
        onDuplicate: () => void;
        onRemove: () => void;
        onUpdate: (field: 'input' | 'output', value: string) => void;
        onToggleVisibility: () => void;
        result?: TestCaseResult;
    };

type TestCaseCardAssessmentProps = TestCaseCardBaseProps &
    TestCaseCardSelectionProps & {
        variant: 'assessment';
        result: TestCaseResult;
    };

export type TestCaseCardProps =
    | TestCaseCardReadOnlyProps
    | TestCaseCardEditableProps
    | TestCaseCardAssessmentProps;

function getResultFlags(result: TestCaseResult) {
    const isFailed = result.status === 'failed';
    const isPassed = result.status === 'passed';
    const isLoading = result.status === 'loading';
    const isRuntimeError = result.status === 'runtime_error';
    const hasRun = isFailed || isPassed || isRuntimeError;
    const isError = isFailed || isRuntimeError;
    return { isFailed, isPassed, isLoading, isRuntimeError, hasRun, isError };
}

function ResultStatusChips({ flags }: { flags: ReturnType<typeof getResultFlags> }) {
    return (
        <>
            {flags.isLoading && (
                <Loader2 className="text-sarge-gray-500 size-4.5 flex-shrink-0 animate-spin" />
            )}
            {flags.isFailed && (
                <Chip variant="error" className="flex flex-shrink-0 items-center gap-1">
                    <CircleX className="size-3.5" />
                    <span>Failed</span>
                </Chip>
            )}
            {flags.isPassed && (
                <Chip variant="success" className="flex flex-shrink-0 items-center gap-1">
                    <CircleCheck className="size-3.5" />
                    <span>Passed</span>
                </Chip>
            )}
            {flags.isRuntimeError && (
                <Chip variant="error" className="flex flex-shrink-0 items-center gap-1">
                    <AlarmClock className="size-3.5" />
                    <span>Runtime Error</span>
                </Chip>
            )}
        </>
    );
}

export default function TestCaseCard(props: TestCaseCardProps) {
    const isAssessment = props.variant === 'assessment';
    const isEditor = props.variant === 'editor' && !props.readOnly;
    const { test, index } = props;

    const isSaving = !isAssessment && !props.readOnly && props.isSaving;
    const showDetails = props.selected;

    const runResult = props.result;
    const resultFlags = runResult ? getResultFlags(runResult) : null;

    const showReadOnlyIo = isAssessment || props.readOnly;

    return (
        <div
            className={cn(
                'bg-background border-sarge-gray-200 w-full rounded-lg border p-5 shadow-xs',
                !isSaving && 'cursor-pointer',
                isSaving && 'cursor-not-allowed opacity-50'
            )}
            onClick={!isSaving ? props.onSelect : undefined}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    {resultFlags && <ResultStatusChips flags={resultFlags} />}
                    <span className="text-sarge-gray-800 text-sm font-medium">
                        Test Case {index + 1}
                    </span>
                </div>
                {isEditor && (
                    <div className="flex flex-shrink-0 items-center gap-2">
                        <button
                            disabled={isSaving}
                            className="text-muted-foreground hover:text-foreground p-1 hover:cursor-pointer disabled:cursor-not-allowed"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onToggleVisibility();
                            }}
                        >
                            {props.isPrivate ? (
                                <Lock className="size-4" />
                            ) : (
                                <Unlock className="size-4" />
                            )}
                        </button>
                        <button
                            disabled={isSaving}
                            className="text-muted-foreground hover:text-foreground p-1 hover:cursor-pointer disabled:cursor-not-allowed"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onDuplicate();
                            }}
                        >
                            <CopyPlus width={16} height={16} />
                        </button>
                        <button
                            disabled={isSaving}
                            className="text-sarge-error-400 hover:text-destructive p-1 hover:cursor-pointer disabled:cursor-not-allowed"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onRemove();
                            }}
                        >
                            <Trash width={16} height={16} />
                        </button>
                    </div>
                )}
            </div>

            {showDetails && (
                <div className="mt-4.5 space-y-4.5">
                    <div className="flex gap-4">
                        <div className="min-w-0 flex-1">
                            <p className="text-sarge-gray-800 mb-2 text-sm font-medium">Input</p>
                            {showReadOnlyIo ? (
                                <div className="bg-background border-sarge-gray-200 text-sarge-gray-500 flex h-10.5 items-center overflow-hidden rounded-md border px-3 py-2 text-sm">
                                    {test.input ?? ''}
                                </div>
                            ) : (
                                <Input
                                    type="text"
                                    placeholder="Placeholder"
                                    value={test.input ?? ''}
                                    onChange={(e) => props.onUpdate('input', e.target.value)}
                                    className="border-sarge-gray-200 bg-background text-sarge-gray-800 placeholder:text-sarge-gray-500 h-10.5 w-full rounded-md border px-3 py-2 text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={isSaving}
                                />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sarge-gray-800 mb-2 text-sm font-medium">
                                Expected Output
                            </p>
                            {showReadOnlyIo ? (
                                <div className="bg-background border-sarge-gray-200 text-sarge-gray-500 flex h-10.5 items-center overflow-hidden rounded-md border px-3 py-2 text-sm">
                                    {test.output ?? ''}
                                </div>
                            ) : (
                                <Input
                                    type="text"
                                    placeholder="Placeholder"
                                    value={test.output ?? ''}
                                    onChange={(e) => props.onUpdate('output', e.target.value)}
                                    className="border-sarge-gray-200 bg-background text-sarge-gray-800 placeholder:text-sarge-gray-500 h-10.5 w-full rounded-md border px-3 py-2 text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={isSaving}
                                />
                            )}
                        </div>
                    </div>

                    {resultFlags?.hasRun && runResult && (
                        <div>
                            <p className="text-sarge-gray-800 mb-2 text-sm font-medium">
                                Actual Output
                            </p>
                            <div
                                className={cn(
                                    'flex h-10.5 items-center overflow-hidden rounded-md border px-3 py-2 text-sm font-medium',
                                    resultFlags.isError
                                        ? 'border-sarge-error-400 bg-sarge-error-50 text-sarge-error-500'
                                        : 'bg-background border-sarge-gray-200 text-sarge-gray-500'
                                )}
                            >
                                {runResult.actualOutput ?? ''}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
