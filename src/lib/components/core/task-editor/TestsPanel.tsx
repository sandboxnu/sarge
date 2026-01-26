'use client';

import { useCallback, useState } from 'react';
import { ChevronUp, Play, Plus } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { cn } from '@/lib/utils/cn.utils';
import type { EditableTestCase } from '@/lib/types/task-template.types';
import { TestCaseAccordion } from '@/lib/components/core/task-editor/TestCaseAccordion';

export interface TestsPanelProps {
    testCases: EditableTestCase[];
    onAddTestCase: (seed?: Pick<EditableTestCase, 'input' | 'output' | 'isPublic'>) => string;
    onDeleteTestCase: (id: string) => void;
    onUpdateTestCase: (id: string, field: 'input' | 'output', value: string) => void;
    onToggleTestCaseVisibility: (id: string) => void;
    onRunCode: () => void;
    isRunning: boolean;
    testOutput: string;
    isExpanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
    showHeaderOnly?: boolean;
}

export function TestsPanel({
    testCases,
    onAddTestCase,
    onDeleteTestCase,
    onUpdateTestCase,
    onToggleTestCaseVisibility,
    onRunCode,
    isRunning,
    testOutput,
    isExpanded,
    onExpandedChange,
    showHeaderOnly = false,
}: TestsPanelProps) {
    const [activeTab, setActiveTab] = useState<'results' | 'cases'>('cases');
    const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);

    const handleAddTestCase = useCallback(() => {
        const newTestCaseId = onAddTestCase();
        setPendingFocusId(newTestCaseId);
        setActiveTab('cases');
        onExpandedChange(true);
    }, [onAddTestCase, onExpandedChange]);

    const handleDuplicateTestCase = useCallback(
        (testCase: EditableTestCase) => {
            const newTestCaseId = onAddTestCase({
                input: testCase.input,
                output: testCase.output,
                isPublic: testCase.isPublic,
            });
            setPendingFocusId(newTestCaseId);
            setActiveTab('cases');
            onExpandedChange(true);
        },
        [onAddTestCase, onExpandedChange]
    );

    const handleRunTests = useCallback(() => {
        setActiveTab('results');
        onExpandedChange(true);
        onRunCode();
    }, [onRunCode, onExpandedChange]);

    const handleTogglePanel = useCallback(() => {
        onExpandedChange(!isExpanded);
    }, [isExpanded, onExpandedChange]);

    if (showHeaderOnly) {
        return (
            <div className="flex h-11 shrink-0 items-center justify-between border-t border-border bg-sarge-gray-50 px-4">
                <button
                    type="button"
                    onClick={handleTogglePanel}
                    className="text-label-s flex items-center gap-2 text-sarge-gray-800"
                >
                    <ChevronUp className="size-4 rotate-180 transition-transform" />
                    Test Results
                </button>

                <Button
                    variant="success-outline"
                    size="sm"
                    onClick={handleRunTests}
                    disabled={isRunning}
                    className="gap-2"
                >
                    <Play className="size-3.5" />
                    {isRunning ? 'Running...' : 'Run Code'}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col border-t border-border bg-sarge-gray-50">
            <div className="flex h-11 shrink-0 items-center justify-between px-4">
                <button
                    type="button"
                    onClick={handleTogglePanel}
                    className="text-label-s flex items-center gap-2 text-sarge-gray-800"
                >
                    <ChevronUp
                        className={cn(
                            'size-4 transition-transform',
                            isExpanded ? 'rotate-0' : 'rotate-180'
                        )}
                    />
                    Test Results
                </button>

                <Button
                    variant="success-outline"
                    size="sm"
                    onClick={handleRunTests}
                    disabled={isRunning}
                    className="gap-2"
                >
                    <Play className="size-3.5" />
                    {isRunning ? 'Running...' : 'Run Code'}
                </Button>
            </div>

            {isExpanded && (
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-t border-border px-4 py-3">
                    <div className="text-label-s relative flex shrink-0 items-center gap-6 border-b border-border">
                        <div className="relative -mb-px">
                            <button
                                type="button"
                                onClick={() => setActiveTab('results')}
                                className={cn(
                                    'pb-2 transition-colors',
                                    activeTab === 'results'
                                        ? 'text-sarge-primary-500'
                                        : 'text-sarge-gray-600 hover:text-foreground'
                                )}
                            >
                                Test Results
                            </button>
                            {activeTab === 'results' && (
                                <div className="absolute right-0 bottom-0 -left-4 h-0.5 bg-sarge-primary-500" />
                            )}
                        </div>
                        <div className="relative -mb-px">
                            <button
                                type="button"
                                onClick={() => setActiveTab('cases')}
                                className={cn(
                                    'pb-2 transition-colors',
                                    activeTab === 'cases'
                                        ? 'text-sarge-primary-500'
                                        : 'text-sarge-gray-600 hover:text-foreground'
                                )}
                            >
                                Test Cases
                            </button>
                            {activeTab === 'cases' && (
                                <div className="absolute right-0 bottom-0 -left-4 h-0.5 bg-sarge-primary-500" />
                            )}
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden pt-3">
                        {activeTab === 'results' && (
                            <div className="h-full overflow-auto">
                                {testOutput ? (
                                    <pre className="text-body-s font-mono whitespace-pre-wrap text-foreground">
                                        {testOutput}
                                    </pre>
                                ) : (
                                    <p className="text-body-s text-sarge-gray-600">
                                        Click on &quot;Run&quot; to run the test cases.
                                    </p>
                                )}
                            </div>
                        )}
                        {activeTab === 'cases' && (
                            <div className="flex h-full flex-col gap-3 overflow-auto">
                                <button
                                    type="button"
                                    onClick={handleAddTestCase}
                                    className="text-label-s flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-3 text-sarge-primary-600 transition-colors hover:bg-sarge-primary-100"
                                >
                                    <Plus className="size-4" />
                                    Add Test Case
                                </button>

                                {testCases.map((testCase, index) => (
                                    <TestCaseAccordion
                                        key={testCase.id}
                                        testCase={testCase}
                                        index={index}
                                        onUpdate={(field, value) =>
                                            onUpdateTestCase(testCase.id, field, value)
                                        }
                                        onToggleVisibility={() =>
                                            onToggleTestCaseVisibility(testCase.id)
                                        }
                                        onDuplicate={() => handleDuplicateTestCase(testCase)}
                                        onDelete={() => onDeleteTestCase(testCase.id)}
                                        shouldAutoFocus={pendingFocusId === testCase.id}
                                        onAutoFocusComplete={() => setPendingFocusId(null)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
