'use client';

import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, CircleCheck, CircleX, Play, ChevronRight } from 'lucide-react';
import OATestCaseCard from '@/lib/components/assessment-flow/OATestCaseCard';
import type { TestCaseDTO } from '@/lib/schemas/task-template.schema';
import type { TestCaseResult } from '@/lib/hooks/useAssessment';

type OATestCasesPanelProps = {
    testCases: TestCaseDTO[];
    results: TestCaseResult[];
    onRunTests: () => void;
    onSubmit: () => void;
};

// if we have dynamic screens then this might need to be adjusted to breakpoints
const PANEL_DEFAULT_HEIGHT = 280;
const PANEL_MIN_HEIGHT = 160;
const PANEL_MAX_HEIGHT = 600;
const PANEL_CLOSED_HEIGHT = 60;

export default function OATestCasesPanel({
    testCases,
    results,
    onRunTests,
    onSubmit,
}: OATestCasesPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [panelHeight, setPanelHeight] = useState(PANEL_DEFAULT_HEIGHT);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);

    const passCount = results.filter((r) => r.status === 'passed').length;
    const failCount = results.filter((r) => r.status === 'failed' || r.status === 'runtime_error').length;
    const hasResults = results.some((r) => r.status === 'passed' || r.status === 'failed' || r.status === 'runtime_error');

    function toggleCard(i: number) {
        setExpandedIndex((prev) => (prev === i ? null : i));
    }

    // this is the dragging handle for when the panel is open and we want to resize it 
    function handleDragStart(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        dragRef.current = { startY: e.clientY, startHeight: panelHeight };

        const onMouseMove = (e: MouseEvent) => {
            if (!dragRef.current) return;
            const delta = dragRef.current.startY - e.clientY;
            const newHeight = Math.max(
                PANEL_MIN_HEIGHT,
                Math.min(PANEL_MAX_HEIGHT, dragRef.current.startHeight + delta)
            );
            setPanelHeight(newHeight);
        };

        const onMouseUp = () => {
            dragRef.current = null;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    return (
        <div
            className="border-sarge-gray-200 bg-background flex flex-shrink-0 flex-col border-t"
            style={{ height: isOpen ? panelHeight : PANEL_CLOSED_HEIGHT }}
        >
            {isOpen && (
                <div
                    className="hover:bg-sarge-primary-300/60 h-1.5 flex-shrink-0 cursor-ns-resize transition-colors"
                    onMouseDown={handleDragStart}
                />
            )}

            <div className="flex h-15 flex-shrink-0 items-center justify-between px-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setIsOpen((v) => !v)}
                            className="text-sarge-gray-700"
                        >
                            {isOpen ? (
                                <ChevronDown className="size-5" />
                            ) : (
                                <ChevronUp className="size-5" />
                            )}
                        </button>
                        <span className="text-sarge-gray-700 text-sm font-medium">Test Cases</span>
                    </div>
                    {hasResults && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <CircleCheck className="text-sarge-success-500 size-4" />
                                <span className="text-sarge-success-500 text-xs font-medium">
                                    {passCount}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CircleX className="text-sarge-error-400 size-4" />
                                <span className="text-sarge-error-400 text-xs font-medium">
                                    {failCount}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onRunTests}
                        className="bg-sarge-gray-50 border-sarge-primary-500 text-sarge-primary-500 flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-medium"
                    >
                        <Play className="size-4" />
                        Run Tests
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        className="bg-sarge-primary-500 text-primary-foreground flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium"
                    >
                        Submit
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="bg-sarge-gray-50 border-sarge-gray-200 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto border-t p-4">
                    {testCases.map((tc, i) => (
                        <OATestCaseCard
                            key={i}
                            index={i}
                            testCase={tc}
                            result={results[i] ?? { status: 'default' }}
                            isExpanded={expandedIndex === i}
                            onToggle={() => toggleCard(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
