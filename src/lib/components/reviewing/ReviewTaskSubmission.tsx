'use client';

import dynamic from 'next/dynamic';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { applySargeDarkTheme } from '@/lib/utils/monaco.utils';
import { getLanguageLabel } from '@/lib/utils/language.utils';
import type { TaskWithReviewData } from '@/lib/types/position.types';

const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.Editor), {
    ssr: false,
});

const LANGUAGE_FILE_EXTENSIONS: Record<string, string> = {
    python: 'py',
    javascript: 'js',
    typescript: 'ts',
    c: 'c',
    cpp: 'cpp',
    ruby: 'rb',
};

type ReviewTaskSubmissionProps = {
    task: TaskWithReviewData | null;
};

export default function ReviewTaskSubmission({ task }: ReviewTaskSubmissionProps) {
    const language = task?.language ?? null;
    const fileName = `main.${(language && LANGUAGE_FILE_EXTENSIONS[language]) ?? 'txt'}`;
    const submission = task?.submission ?? '';

    function handleEditorMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        applySargeDarkTheme(editorInstance, monaco);
    }

    return (
        <div className="bg-sarge-gray-700 flex min-h-0 flex-1 flex-col">
            {/* editor header: filename + language */}
            <div className="text-sarge-gray-0 flex flex-shrink-0 items-stretch text-xs">
                <div className="border-sarge-gray-600 flex flex-shrink-0 items-center border-r px-2.5 py-2">
                    <span className="tracking-design font-medium">{fileName}</span>
                </div>
                <div className="border-sarge-gray-600 flex flex-1 items-center justify-end gap-1.5 border-b px-2.5">
                    <span className="tracking-design text-xs font-medium">Language</span>
                    <span className="bg-sarge-primary-500 tracking-design text-primary-foreground rounded-sm px-2.5 py-0.5 text-xs font-medium">
                        {language ? getLanguageLabel(language) : 'txt'}
                    </span>
                </div>
            </div>
            <div className="min-h-0 flex-1">
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
            </div>
        </div>
    );
}
