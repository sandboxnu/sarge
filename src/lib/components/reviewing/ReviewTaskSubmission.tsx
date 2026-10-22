'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { Chip } from '@/lib/components/ui/Chip';
import { applySargeDarkTheme } from '@/lib/utils/monaco.utils';
import { getLanguageLabel, getLanguageFileExtension } from '@/lib/utils/language.utils';
import type { TaskWithReviewData } from '@/lib/types/position.types';
import { selectionToLineRange, type LineRange } from '@/lib/utils/comment.utils';

const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.Editor), {
    ssr: false,
});

type ReviewTaskSubmissionProps = {
    task: TaskWithReviewData | null;
    selectedLines: LineRange | null;
    onSelectLines: (lines: LineRange | null) => void;
};

export default function ReviewTaskSubmission({
    task,
    selectedLines,
    onSelectLines,
}: ReviewTaskSubmissionProps) {
    const language = task?.language ?? null;
    const fileName = `main.${getLanguageFileExtension(language ?? '')}`;
    const submission = task?.submission ?? '';
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    // Clear the selection when switching tasks or leaving the tab
    useEffect(() => () => onSelectLines(null), [task?.id, onSelectLines]);

    // Remove the editor highlight once the lines are cleared (chip removed, comment posted)
    useEffect(() => {
        const position = editorRef.current?.getPosition();
        if (!selectedLines && position) editorRef.current?.setPosition(position);
    }, [selectedLines]);

    function handleEditorMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        editorRef.current = editorInstance;
        applySargeDarkTheme(editorInstance, monaco);
        editorInstance.onDidChangeCursorSelection(({ selection }) =>
            onSelectLines(selection.isEmpty() ? null : selectionToLineRange(selection))
        );
    }

    return (
        <div className="bg-sarge-gray-800 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md">
            <div className="bg-sarge-gray-800 border-sarge-gray-700 flex flex-shrink-0 items-stretch border-b">
                <div className="border-sarge-gray-700 flex flex-shrink-0 items-center border-r px-3 py-2">
                    <span className="font-code text-sarge-gray-300 tracking-design text-xs leading-4 font-bold">
                        {fileName}
                    </span>
                </div>
                <div className="bg-sarge-gray-750 flex flex-1 items-center justify-end gap-1.5 px-2.5">
                    <span className="text-label-xs text-sarge-gray-500">Language</span>
                    <Chip className="bg-sarge-gray-700 text-label-xs text-sarge-gray-50 h-[22px] rounded-sm px-3 py-0">
                        {language ? getLanguageLabel(language) : 'txt'}
                    </Chip>
                </div>
            </div>
            <div className="min-h-0 flex-1">
                <Editor
                    height="100%"
                    language={language ?? 'plaintext'}
                    value={submission}
                    onMount={handleEditorMount}
                    theme="sargeDark"
                    options={{ readOnly: true, wordWrap: 'on' }}
                />
            </div>
        </div>
    );
}
