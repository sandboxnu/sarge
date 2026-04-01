'use client';

import { type editor } from 'monaco-editor';
import { type Monaco } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
} from '@/lib/components/ui/Dropdown';
import { ChevronDown } from 'lucide-react';
import { applySargeDarkTheme } from '@/lib/utils/monaco.utils';
import { getLanguageLabel } from '@/lib/utils/language.utils';
import type { TaskLanguageOption } from '@/lib/types/candidate-assessment.types';

type CodeEditorPanelProps = {
    language: string;
    availableLanguages: TaskLanguageOption[];
    onLanguageChange: (lang: string) => void;
    onEditorMount: (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
    defaultValue: string;
};

export default function CodeEditorPanel({
    language,
    availableLanguages,
    onLanguageChange,
    onEditorMount,
    defaultValue,
}: CodeEditorPanelProps) {
    function handleMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        applySargeDarkTheme(editorInstance, monaco);
        onEditorMount(editorInstance, monaco);
    }

    return (
        <div className="bg-sarge-gray-700 flex h-full flex-col">
            <div className="text-sarge-gray-0 flex flex-shrink-0 items-stretch text-xs">
                <div className="border-sarge-gray-600 flex flex-shrink-0 items-center border-r px-2.5 py-2">
                    <span className="tracking-design font-medium">Main</span>
                </div>
                <div className="border-sarge-gray-600 flex flex-1 items-center justify-end gap-1.5 border-b px-2.5">
                    <span className="tracking-design text-xs font-medium">Language</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="bg-sarge-primary-500 tracking-design text-primary-foreground flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-0.5 text-xs font-medium">
                                {getLanguageLabel(language)}
                                <ChevronDown className="size-2.5" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="bottom"
                            align="center"
                            className="bg-sarge-primary-500 rounded-sm px-2.5"
                        >
                            <DropdownMenuGroup className="text-primary-foreground p-0">
                                {availableLanguages.map((opt) => (
                                    <DropdownMenuItem
                                        key={opt.id}
                                        variant="primary"
                                        className="cursor-pointer"
                                        onClick={() => onLanguageChange(opt.language)}
                                    >
                                        {getLanguageLabel(opt.language)}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="min-h-0 flex-1">
                <Editor
                    height="100%"
                    defaultLanguage={language}
                    defaultValue={defaultValue}
                    onMount={handleMount}
                    theme="sargeDark"
                    options={{
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
