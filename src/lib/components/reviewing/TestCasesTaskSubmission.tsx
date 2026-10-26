'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { Chip } from '@/lib/components/ui/Chip';
import { applySargeDarkTheme } from '@/lib/utils/monaco.utils';
import { getLanguageLabel, getLanguageFileExtension } from '@/lib/utils/language.utils';
import type { TaskWithReviewData } from '@/lib/types/position.types';
import type { TaskTestResult } from '@/generated/prisma';
import type { TestCaseDTO } from '@/lib/schemas/task-template.schema';
import { selectionToLineRange, type LineRange } from '@/lib/utils/comment.utils';
import TestCasePanel from '@/lib/components/core/TestCasePanel';
import FloatingComment from '@/lib/components/reviewing/FloatingComment';
import type { TestCaseResult } from '@/lib/types/candidate-assessment.types';

// Matches the floating comment's rendered height, used to keep it inside the editor
const FLOATING_COMMENT_HEIGHT = 140;

const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.Editor), {
    ssr: false,
});

type ReviewTaskSubmissionProps = {
    task: TaskWithReviewData | null;
    selectedLines: LineRange | null;
    onSelectLines: (lines: LineRange | null) => void;
    commentText: string;
    onCommentChange: (value: string) => void;
    onSubmitComment: () => void;
    submitDisabled: boolean;
};

export default function ReviewTaskSubmission({
    task,
    selectedLines,
    onSelectLines,
    commentText,
    onCommentChange,
    onSubmitComment,
    submitDisabled,
}: ReviewTaskSubmissionProps) {
    const language = task?.language ?? null;
    const fileName = `main.${getLanguageFileExtension(language ?? '')}`;
    const submission = task?.submission ?? '';
    const testResults = task?.testResults ?? [];
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const selectedLinesRef = useRef(selectedLines);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

    // Anchors the floating comment just under the last selected line, following editor scroll
    const updatePopupPosition = useCallback(() => {
        const editorInstance = editorRef.current;
        const lines = selectedLinesRef.current;
        if (!editorInstance || !lines) {
            setPopupPosition(null);
            return;
        }
        const { contentLeft, height } = editorInstance.getLayoutInfo();
        const top =
            editorInstance.getBottomForLineNumber(lines.endLine) - editorInstance.getScrollTop();
        setPopupPosition({
            top: Math.max(0, Math.min(top, height - FLOATING_COMMENT_HEIGHT)),
            left: contentLeft,
        });
    }, []);

    useEffect(() => {
        selectedLinesRef.current = selectedLines;
        updatePopupPosition();
    }, [selectedLines, updatePopupPosition]);

    // Clear the selection when switching tasks
    useEffect(() => () => onSelectLines(null), [task?.id, onSelectLines]);

    // Remove the editor highlight once the lines are cleared (chip removed, comment posted)
    useEffect(() => {
        const position = editorRef.current?.getPosition();
        if (!selectedLines && position) editorRef.current?.setPosition(position);
    }, [selectedLines]);

    function toTestCase(result: TaskTestResult): TestCaseDTO {
        return { input: result.input, output: result.expectedOutput };
    }

    // Cards show what the candidate's submission actually produced
    const results: TestCaseResult[] = [
        ...testResults.filter((r) => r.visibility === 'PUBLIC'),
        ...testResults.filter((r) => r.visibility === 'PRIVATE'),
    ].map((r) => ({
        status: r.passed ? 'passed' : 'failed',
        actualOutput: r.actualOutput ?? '',
    }));

    const publicTestCases = testResults.filter((r) => r.visibility === 'PUBLIC').map(toTestCase);
    const privateTestCases = testResults.filter((r) => r.visibility === 'PRIVATE').map(toTestCase);

    function handleEditorMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        editorRef.current = editorInstance;
        applySargeDarkTheme(editorInstance, monaco);
        editorInstance.onDidScrollChange(updatePopupPosition);
        editorInstance.onDidChangeCursorSelection(({ selection }) =>
            onSelectLines(selection.isEmpty() ? null : selectionToLineRange(selection))
        );
    }

    return (
        <>
            <div className="bg-sarge-gray-700 flex min-h-0 basis-[60%] flex-col">
                <div className="text-sarge-gray-0 flex flex-shrink-0 items-stretch text-xs">
                    <div className="border-sarge-gray-600 flex flex-shrink-0 items-center border-r px-2.5 py-2">
                        <span className="tracking-design font-medium">{fileName}</span>
                    </div>
                    <div className="border-sarge-gray-600 flex flex-1 items-center justify-end gap-1.5 border-b px-2.5">
                        <span className="tracking-design text-xs font-medium">Language</span>
                        <Chip className="bg-sarge-primary-500 tracking-design text-primary-foreground rounded-sm px-2.5 py-0.5 text-xs font-medium">
                            {language ? getLanguageLabel(language) : 'txt'}
                        </Chip>
                    </div>
                </div>
                <div className="relative min-h-0 flex-1">
                    <Editor
                        height="100%"
                        language={language ?? 'plaintext'}
                        value={submission}
                        onMount={handleEditorMount}
                        theme="sargeDark"
                        options={{
                            readOnly: true,
                            fontSize: 14,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                        }}
                    />
                    {selectedLines && popupPosition && (
                        <FloatingComment
                            selectedLines={selectedLines}
                            value={commentText}
                            onChange={onCommentChange}
                            onSubmit={onSubmitComment}
                            onClearLines={() => onSelectLines(null)}
                            submitDisabled={submitDisabled}
                            style={popupPosition}
                        />
                    )}
                </div>
            </div>
            <TestCasePanel
                publicTestCases={publicTestCases}
                privateTestCases={privateTestCases}
                results={results}
                readOnly
            />
        </>
    );
}
