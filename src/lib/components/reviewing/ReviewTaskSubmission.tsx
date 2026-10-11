'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { Chip } from '@/lib/components/ui/Chip';
import { applySargeDarkTheme } from '@/lib/utils/monaco.utils';
import { getLanguageLabel, getLanguageFileExtension } from '@/lib/utils/language.utils';
import type { TaskWithReviewData } from '@/lib/types/position.types';
import CommentInput from '@/lib/components/reviewing/CommentInput';
import { selectionToLineRange, type LineRange } from '@/lib/utils/comment.utils';

const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.Editor), {
    ssr: false,
});

const POPOVER_WIDTH = 300;

type ReviewTaskSubmissionProps = {
    task: TaskWithReviewData | null;
    onAddComment: (content: string, lines: LineRange) => Promise<void>;
};

export default function ReviewTaskSubmission({ task, onAddComment }: ReviewTaskSubmissionProps) {
    const language = task?.language ?? null;
    const fileName = `main.${getLanguageFileExtension(language ?? '')}`;
    const submission = task?.submission ?? '';

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const [lines, setLines] = useState<LineRange | null>(null);
    const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);

    // Anchors the comment popover just below the first character of the selection's last line
    function positionPopover(range: LineRange | null) {
        const editorInstance = editorRef.current;
        const model = editorInstance?.getModel();
        const position =
            editorInstance && model && range
                ? editorInstance.getScrolledVisiblePosition({
                      lineNumber: range.endLine,
                      column: model.getLineFirstNonWhitespaceColumn(range.endLine) || 1,
                  })
                : null;

        if (!editorInstance || !position) {
            setPopoverPos(null);
            return;
        }

        const maxLeft = editorInstance.getLayoutInfo().width - POPOVER_WIDTH - 8;
        setPopoverPos({
            top: position.top + position.height + 4,
            left: Math.max(8, Math.min(position.left, maxLeft)),
        });
    }

    function clearSelection() {
        const editorInstance = editorRef.current;
        const position = editorInstance?.getPosition();
        if (editorInstance && position) editorInstance.setPosition(position);
        setLines(null);
        setPopoverPos(null);
    }

    function handleEditorMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        applySargeDarkTheme(editorInstance, monaco);
        editorRef.current = editorInstance;

        let current: LineRange | null = null;
        editorInstance.onDidChangeCursorSelection(({ selection }) => {
            current = selection.isEmpty() ? null : selectionToLineRange(selection);
            setLines(current);
            positionPopover(current);
        });
        editorInstance.onDidScrollChange(() => positionPopover(current));
    }

    return (
        <div className="bg-sarge-gray-700 flex min-h-0 flex-1 flex-col">
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
            <div className="relative min-h-0 flex-1 overflow-hidden">
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
                {lines && popoverPos && (
                    <CommentInput
                        key={`${lines.startLine}-${lines.endLine}`}
                        label="Comment"
                        placeholder="Add a comment on these lines"
                        lines={lines}
                        onClearLines={clearSelection}
                        onSubmit={async (content) => {
                            await onAddComment(content, lines);
                            clearSelection();
                        }}
                        className="absolute z-10 shadow-md"
                        style={{ top: popoverPos.top, left: popoverPos.left, width: POPOVER_WIDTH }}
                    />
                )}
            </div>
        </div>
    );
}
