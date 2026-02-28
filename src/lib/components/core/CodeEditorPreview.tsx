'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import CodeEditorToolbar from '@/lib/components/core/CodeEditorToolbar';
import { applySargeDarkTheme } from '@/lib/utils/monaco.utils';
import type { TaskTemplateLanguageDTO } from '@/lib/schemas/task-template-language.schema';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';

const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.Editor), {
    ssr: false,
});

interface CodeEditorPreviewProps {
    languages: TaskTemplateLanguageDTO[];
    taskTemplateId: string;
}

export default function CodeEditorPreview({ languages, taskTemplateId }: CodeEditorPreviewProps) {
    const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);
    const [activeFileTab, setActiveFileTab] = useState<'task' | 'solution'>('task');

    useEffect(() => {
        setSelectedLanguageIndex(0);
        setActiveFileTab('task');
    }, [taskTemplateId]);

    const currentLanguage = languages[selectedLanguageIndex];
    const activeCode =
        activeFileTab === 'task'
            ? (currentLanguage?.stub ?? '')
            : (currentLanguage?.solution ?? '');

    const handleEditorMount = useCallback(
        (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            applySargeDarkTheme(editorInstance, monaco);
        },
        []
    );

    return (
        <div className="bg-sarge-gray-700 flex flex-1 flex-col">
            <CodeEditorToolbar
                activeTab={activeFileTab}
                onTabChange={setActiveFileTab}
                languages={languages}
                selectedLanguageIndex={selectedLanguageIndex}
                onLanguageChange={setSelectedLanguageIndex}
            />

            <div className="min-h-0 flex-1 p-2">
                <Editor
                    className="h-full"
                    language={currentLanguage ? currentLanguage.language : undefined}
                    value={activeCode}
                    options={{ readOnly: true }}
                    onMount={handleEditorMount}
                />
            </div>
        </div>
    );
}
