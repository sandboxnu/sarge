'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/lib/components/ui/Select';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/lib/components/ui/Resizable';
import { JUDGE0_LANGUAGE_NAME_MAP } from '@/lib/constants/judge0-languages';
import { MONACO_EDITOR_DEFAULT_OPTIONS } from '@/lib/constants/monaco-editor.config';
import { TestsPanel } from '@/lib/components/core/task-editor/TestsPanel';
import type { EditableTestCase } from '@/lib/types/task-template.types';
import type { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { ImperativePanelHandle } from 'react-resizable-panels';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const PANEL_AUTOSAVE_ID = 'task-editor.solution-tests-layout';
const DEFAULT_TESTS_PANEL_PERCENT = 45;
const MIN_TESTS_PANEL_PERCENT = 10;
const MAX_TESTS_PANEL_PERCENT = 70;

interface SolutionTestsSectionProps {
    selectedLanguages: string[];
    currentLanguage: string;
    onLanguageChange: (language: string) => void;
    onEditorMount: OnMount;
    editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
    testCases: EditableTestCase[];
    selectedTestCaseId: string | null;
    onSelectTestCase: (id: string) => void;
    onAddTestCase: (seed?: Pick<EditableTestCase, 'input' | 'output' | 'isPublic'>) => string;
    onDeleteTestCase: (id: string) => void;
    onUpdateTestCase: (id: string, field: 'input' | 'output', value: string) => void;
    onToggleTestCaseVisibility: (id: string) => void;
    onRunCode: () => void;
    isRunning: boolean;
    testOutput: string;
}

export function SolutionTestsSection({
    selectedLanguages,
    currentLanguage,
    onLanguageChange,
    onEditorMount,
    testCases,
    selectedTestCaseId,
    onSelectTestCase,
    onAddTestCase,
    onDeleteTestCase,
    onUpdateTestCase,
    onToggleTestCaseVisibility,
    onRunCode,
    isRunning,
    testOutput,
}: SolutionTestsSectionProps) {
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);
    const panelRef = useRef<ImperativePanelHandle | null>(null);
    const hasInitialized = useRef(false);

    const monacoLanguage = currentLanguage === 'cpp' ? 'cpp' : currentLanguage;

    const hasLanguages = selectedLanguages.length > 0;

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const savedState = localStorage.getItem(`react-resizable-panels:${PANEL_AUTOSAVE_ID}`);
        if (!savedState && panelRef.current) {
            panelRef.current.collapse();
        }
    }, []);

    const handleExpandedChange = useCallback((expanded: boolean) => {
        if (expanded) {
            panelRef.current?.expand();
        } else {
            panelRef.current?.collapse();
        }
    }, []);

    if (!hasLanguages) {
        return (
            <div className="flex min-h-0 flex-1 items-center justify-center p-4">
                <div className="rounded-lg border border-dashed border-border bg-muted/30">
                    <div className="max-w-md text-center">
                        <p className="text-label-m text-foreground">No languages selected</p>
                        <p className="text-body-s mt-2 text-muted-foreground">
                            Add supported languages in the Languages section to write and test
                            reference solutions.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-border bg-sarge-gray-0 px-4 py-4">
                <h3 className="text-label-m text-foreground">Solution & Tests</h3>
                <p className="text-body-xs mt-1 text-muted-foreground">
                    Write a reference solution and define test cases to validate candidate
                    submissions.
                </p>
            </div>

            <div className="flex min-h-11 shrink-0 items-center gap-3 border-b border-border bg-sarge-gray-0 px-4">
                <span className="text-label-s text-sarge-gray-800">Language:</span>
                <Select value={currentLanguage} onValueChange={onLanguageChange}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        {selectedLanguages.map((slug) => (
                            <SelectItem key={slug} value={slug}>
                                {JUDGE0_LANGUAGE_NAME_MAP[slug] ?? slug}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <ResizablePanelGroup
                direction="vertical"
                autoSaveId={PANEL_AUTOSAVE_ID}
                className="min-h-0 flex-1"
            >
                <ResizablePanel
                    defaultSize={100 - DEFAULT_TESTS_PANEL_PERCENT}
                    minSize={100 - MAX_TESTS_PANEL_PERCENT}
                >
                    <MonacoEditor
                        height="100%"
                        language={monacoLanguage}
                        theme="light"
                        onMount={onEditorMount}
                        options={MONACO_EDITOR_DEFAULT_OPTIONS}
                    />
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel
                    ref={panelRef}
                    defaultSize={DEFAULT_TESTS_PANEL_PERCENT}
                    minSize={MIN_TESTS_PANEL_PERCENT}
                    maxSize={MAX_TESTS_PANEL_PERCENT}
                    collapsible
                    collapsedSize={0}
                    onCollapse={() => setIsPanelExpanded(false)}
                    onExpand={() => setIsPanelExpanded(true)}
                >
                    <TestsPanel
                        testCases={testCases}
                        selectedTestCaseId={selectedTestCaseId}
                        onSelectTestCase={onSelectTestCase}
                        onAddTestCase={onAddTestCase}
                        onDeleteTestCase={onDeleteTestCase}
                        onUpdateTestCase={onUpdateTestCase}
                        onToggleTestCaseVisibility={onToggleTestCaseVisibility}
                        onRunCode={onRunCode}
                        isRunning={isRunning}
                        testOutput={testOutput}
                        isExpanded={isPanelExpanded}
                        onExpandedChange={handleExpandedChange}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>

            {!isPanelExpanded && (
                <TestsPanel
                    testCases={testCases}
                    selectedTestCaseId={selectedTestCaseId}
                    onSelectTestCase={onSelectTestCase}
                    onAddTestCase={onAddTestCase}
                    onDeleteTestCase={onDeleteTestCase}
                    onUpdateTestCase={onUpdateTestCase}
                    onToggleTestCaseVisibility={onToggleTestCaseVisibility}
                    onRunCode={onRunCode}
                    isRunning={isRunning}
                    testOutput={testOutput}
                    isExpanded={false}
                    onExpandedChange={handleExpandedChange}
                    showHeaderOnly
                />
            )}
        </div>
    );
}
