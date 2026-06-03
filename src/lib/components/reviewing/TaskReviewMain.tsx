'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { applySargeDarkTheme } from '@/lib/utils/monaco.utils';
import { getLanguageLabel } from '@/lib/utils/language.utils';
import { cn } from '@/lib/utils/cn.utils';
import type { TaskWithReviewData } from '@/lib/types/position.types';

const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.Editor), {
    ssr: false,
});

const TABS = ['Submission', 'Instructions', 'Test Cases', 'Activity Log'] as const;
type Tab = (typeof TABS)[number];

// TODO: the candidate's submission language isn't persisted on Task yet — mocked until then.
const PLACEHOLDER_LANGUAGE = 'java';

const LANGUAGE_FILE_EXTENSIONS: Record<string, string> = {
    java: 'java',
    python: 'py',
    javascript: 'js',
    typescript: 'ts',
    c: 'c',
    cpp: 'cpp',
    ruby: 'rb',
};

type TaskReviewMainProps = {
    task: TaskWithReviewData | null;
};

export default function TaskReviewMain({ task }: TaskReviewMainProps) {
    const [activeTab, setActiveTab] = useState<Tab>('Submission');

    const language = PLACEHOLDER_LANGUAGE;
    const fileName = `main.${LANGUAGE_FILE_EXTENSIONS[language] ?? 'txt'}`;
    const submission = task?.submission ?? '';

    function handleEditorMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        applySargeDarkTheme(editorInstance, monaco);
    }

    return (
        <section className="flex min-w-0 flex-[7] flex-col gap-4 overflow-hidden pr-4">
            <div className="flex items-center gap-2">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'text-xs font-medium transition-colors',
                            activeTab === tab
                                ? 'bg-sarge-gray-100 text-sarge-gray-600 rounded-md px-2 py-1'
                                : 'text-sarge-gray-500 hover:text-sarge-gray-600 px-2 py-1'
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Submission' ? (
                <div className="bg-sarge-gray-700 flex min-h-0 flex-1 flex-col">
                    {/* editor header: filename + language */}
                    <div className="text-sarge-gray-0 flex flex-shrink-0 items-stretch text-xs">
                        <div className="border-sarge-gray-600 flex flex-shrink-0 items-center border-r px-2.5 py-2">
                            <span className="tracking-design font-medium">{fileName}</span>
                        </div>
                        <div className="border-sarge-gray-600 flex flex-1 items-center justify-end gap-1.5 border-b px-2.5">
                            <span className="tracking-design text-xs font-medium">Language</span>
                            <span className="bg-sarge-primary-500 tracking-design text-primary-foreground rounded-sm px-2.5 py-0.5 text-xs font-medium">
                                {getLanguageLabel(language)}
                            </span>
                        </div>
                    </div>
                    <div className="min-h-0 flex-1">
                        <Editor
                            height="100%"
                            language={language}
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
            ) : (
                <div className="text-sarge-gray-500 flex flex-1 items-center justify-center text-sm">
                    {/* TODO: {activeTab} panel */}
                    {activeTab}
                </div>
            )}
        </section>
    );
}
