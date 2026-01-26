'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Copy, Trash2, Lock, Unlock } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/lib/components/ui/Tooltip';
import { cn } from '@/lib/utils/cn.utils';
import type { EditableTestCase } from '@/lib/types/task-template.types';

export interface TestCaseAccordionProps {
    testCase: EditableTestCase;
    index: number;
    onUpdate: (field: 'input' | 'output', value: string) => void;
    onToggleVisibility: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    shouldAutoFocus: boolean;
    onAutoFocusComplete: () => void;
}

export function TestCaseAccordion({
    testCase,
    index,
    onUpdate,
    onToggleVisibility,
    onDuplicate,
    onDelete,
    shouldAutoFocus,
    onAutoFocusComplete,
}: TestCaseAccordionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (shouldAutoFocus) {
            setIsExpanded(true);
        }
    }, [shouldAutoFocus]);

    useEffect(() => {
        if (shouldAutoFocus && isExpanded) {
            inputRef.current?.focus();
            onAutoFocusComplete();
        }
    }, [shouldAutoFocus, isExpanded, onAutoFocusComplete]);

    return (
        <div
            className={cn(
                'shrink-0 rounded-lg border border-border bg-background transition-colors'
            )}
        >
            <div
                role="button"
                tabIndex={0}
                onClick={() => {
                    setIsExpanded(!isExpanded);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsExpanded(!isExpanded);
                    }
                }}
                className="flex w-full cursor-pointer items-center justify-between rounded-t-lg px-4 py-3 text-left transition-colors hover:bg-sarge-gray-50 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
                aria-expanded={isExpanded}
            >
                <div className="text-label-s flex items-center gap-2 text-foreground">
                    <ChevronDown
                        className={cn('size-4 transition-transform', isExpanded && 'rotate-180')}
                    />
                    Test Case {index + 1}
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleVisibility();
                                }}
                                className="rounded-md p-2 text-sarge-gray-500 transition-colors hover:bg-sarge-gray-200 hover:text-foreground"
                            >
                                {testCase.isPublic ? (
                                    <Unlock className="size-4" />
                                ) : (
                                    <Lock className="size-4" />
                                )}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {testCase.isPublic ? 'Visible to candidates' : 'Hidden from candidates'}
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDuplicate();
                                }}
                                className="rounded-md p-2 text-sarge-gray-500 transition-colors hover:bg-sarge-gray-200 hover:text-foreground"
                            >
                                <Copy className="size-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Duplicate test case</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="rounded-md p-2 text-sarge-gray-500 transition-colors hover:bg-sarge-gray-200 hover:text-foreground"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Delete test case</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {isExpanded && (
                <div className="space-y-4 border-t border-border px-4 py-4">
                    <div>
                        <label className="text-label-s mb-2 block text-sarge-gray-600">Input</label>
                        <textarea
                            ref={inputRef}
                            value={testCase.input}
                            onChange={(e) => onUpdate('input', e.target.value)}
                            className="text-body-s min-h-24 w-full resize-y rounded-lg border border-border bg-background p-3 font-mono text-foreground focus:border-primary focus:outline-none"
                            placeholder="Enter input..."
                        />
                    </div>
                    <div>
                        <label className="text-label-s mb-2 block text-sarge-gray-600">
                            Expected Output
                        </label>
                        <textarea
                            value={testCase.output}
                            onChange={(e) => onUpdate('output', e.target.value)}
                            className="text-body-s min-h-24 w-full resize-y rounded-lg border border-border bg-background p-3 font-mono text-foreground focus:border-primary focus:outline-none"
                            placeholder="Enter expected output..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
