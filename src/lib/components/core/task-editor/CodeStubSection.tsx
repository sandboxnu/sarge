'use client';

import dynamic from 'next/dynamic';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/lib/components/ui/Select';
import { JUDGE0_LANGUAGE_NAME_MAP } from '@/lib/constants/judge0-languages';
import { MONACO_EDITOR_DEFAULT_OPTIONS } from '@/lib/constants/monaco-editor.config';
import type { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

// loading this client-only otherwise would cause ssr errors
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeStubSectionProps {
    selectedLanguages: string[];
    currentLanguage: string;
    onLanguageChange: (language: string) => void;
    onEditorMount: OnMount;
    editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
}

export function CodeStubSection({
    selectedLanguages,
    currentLanguage,
    onLanguageChange,
    onEditorMount,
}: CodeStubSectionProps) {
    const monacoLanguageId = currentLanguage === 'cpp' ? 'cpp' : currentLanguage;

    if (selectedLanguages.length === 0) {
        return (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="shrink-0 border-b border-border bg-sarge-gray-0 px-4 py-4">
                    <h3 className="text-label-m text-foreground">Code Stub</h3>
                    <p className="text-body-xs mt-1 text-muted-foreground">
                        Starter code that candidates will see when they begin the task.
                    </p>
                </div>

                <div className="flex min-h-0 flex-1 items-center justify-center p-4">
                    <div className="rounded-lg border border-dashed border-border bg-muted/30">
                        <div className="max-w-md text-center">
                            <p className="text-label-m text-foreground">No languages selected</p>
                            <p className="text-body-s mt-2 text-muted-foreground">
                                Add supported languages in the Languages section to provide starter
                                code for candidates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-border bg-sarge-gray-0 px-4 py-4">
                <h3 className="text-label-m text-foreground">Code Stub</h3>
                <p className="text-body-xs mt-1 text-muted-foreground">
                    Starter code that candidates will see when they begin the task.
                </p>
            </div>

            <div className="flex min-h-11 shrink-0 items-center gap-3 border-b border-border bg-sarge-gray-0 px-4">
                <span className="text-label-s text-sarge-gray-800">Language:</span>
                <Select value={currentLanguage} onValueChange={onLanguageChange}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        {selectedLanguages.map((languageId) => (
                            <SelectItem key={languageId} value={languageId}>
                                {JUDGE0_LANGUAGE_NAME_MAP[languageId] ?? languageId}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className="text-body-s ml-auto text-muted-foreground">
                    Code stubs are optional for each language
                </span>
            </div>

            <div className="min-h-0 flex-1">
                <MonacoEditor
                    height="100%"
                    language={monacoLanguageId}
                    theme="light"
                    onMount={onEditorMount}
                    options={MONACO_EDITOR_DEFAULT_OPTIONS}
                />
            </div>
        </div>
    );
}
