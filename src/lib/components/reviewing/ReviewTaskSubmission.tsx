'use client';

import dynamic from 'next/dynamic';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { Chip } from '@/lib/components/ui/Chip';
import { applySargeDarkTheme } from '@/lib/utils/monaco.utils';
import { getLanguageLabel, getLanguageFileExtension } from '@/lib/utils/language.utils';
import type { TaskWithReviewData } from '@/lib/types/position.types';

const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.Editor), {
    ssr: false,
});

type ReviewTaskSubmissionProps = {
    task: TaskWithReviewData | null;
};

export default function ReviewTaskSubmission({ task }: ReviewTaskSubmissionProps) {
    const language = task?.language ?? null;
    const fileName = `main.${getLanguageFileExtension(language ?? '')}`;
    const submission = task?.submission ?? '';

    function handleEditorMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        applySargeDarkTheme(editorInstance, monaco);
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
