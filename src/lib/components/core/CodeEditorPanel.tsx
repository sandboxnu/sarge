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
import { Chip } from '@/lib/components/ui/Chip';
import { applySargeDarkTheme } from '@/lib/utils/monaco.utils';
import { getLanguageLabel, getLanguageFileExtension } from '@/lib/utils/language.utils';
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
        <div className="bg-sarge-gray-800 flex h-full flex-col">
            <div className="bg-sarge-gray-800 border-sarge-gray-700 flex flex-shrink-0 items-stretch border-b">
                <div className="border-sarge-gray-700 flex flex-shrink-0 items-center border-r px-3 py-2">
                    <span className="font-code text-sarge-gray-300 tracking-design text-xs leading-4 font-bold">
                        {`main.${getLanguageFileExtension(language)}`}
                    </span>
                </div>
                <div className="flex flex-1 items-center justify-end gap-1.5 bg-[#282C32] px-2.5">
                    <span className="text-label-xs text-sarge-gray-500">Language</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Chip className="bg-sarge-gray-700 text-label-xs text-sarge-gray-50 h-[22px] cursor-pointer gap-1.5 rounded-sm px-3 py-0">
                                {getLanguageLabel(language)}
                                <ChevronDown className="size-2.5" />
                            </Chip>
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
                    options={{ wordWrap: 'on' }}
                />
            </div>
        </div>
    );
}
