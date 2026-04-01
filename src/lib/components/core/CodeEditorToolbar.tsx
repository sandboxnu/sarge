'use client';

import { ChevronDown, EllipsisVertical } from 'lucide-react';
import { Tabs, TabsList, CodeTabsTrigger } from '@/lib/components/ui/Tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { getLanguageLabel } from '@/lib/utils/language.utils';
import { type TaskTemplateLanguageDTO } from '@/lib/schemas/task-template-language.schema';

interface CodeEditorToolbarProps {
    activeTab: 'task' | 'solution';
    onTabChange: (tab: 'task' | 'solution') => void;
    languages: TaskTemplateLanguageDTO[];
    selectedLanguageIndex: number;
    handleLanguageChange: (language: TaskTemplateLanguageDTO) => void;
    disabled?: boolean;
}

export default function CodeEditorToolbar({
    activeTab,
    onTabChange,
    languages,
    selectedLanguageIndex,
    handleLanguageChange,
    disabled = false,
}: CodeEditorToolbarProps) {
    const currentLanguage = languages[selectedLanguageIndex];

    return (
        <div className="text-sarge-gray-0 flex w-full items-stretch">
            <Tabs
                value={activeTab}
                onValueChange={disabled ? undefined : (v) => onTabChange(v as 'task' | 'solution')}
            >
                <TabsList className="h-auto bg-transparent p-0">
                    <CodeTabsTrigger value="task" disabled={disabled}>
                        Main
                    </CodeTabsTrigger>
                    <CodeTabsTrigger value="solution" disabled={disabled}>
                        Solution
                    </CodeTabsTrigger>
                </TabsList>
            </Tabs>

            <div className="border-sarge-gray-600 flex flex-1 items-center justify-end border-b px-2.5">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                        <span className="tracking-design text-xs font-medium">Language</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild disabled={disabled}>
                                <div
                                    className={`bg-sarge-primary-500 tracking-design text-primary-foreground flex items-center gap-2.5 rounded-sm px-2.5 py-0.5 text-xs font-medium ${disabled
                                        ? 'cursor-not-allowed opacity-50'
                                        : 'cursor-pointer'
                                        }`}
                                >
                                    {currentLanguage
                                        ? getLanguageLabel(currentLanguage.language)
                                        : ''}
                                    <ChevronDown className="size-2.5" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="bottom"
                                align="center"
                                className="bg-sarge-primary-500 rounded-sm px-2.5"
                            >
                                <DropdownMenuGroup className="text-primary-foreground p-0">
                                    {languages.map((lang: TaskTemplateLanguageDTO) => (
                                        <DropdownMenuItem
                                            key={lang.language}
                                            variant="primary"
                                            className="cursor-pointer"
                                            onClick={() => handleLanguageChange(lang)}
                                        >
                                            {getLanguageLabel(lang.language)}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <EllipsisVertical className="size-3.5" />
                </div>
            </div>
        </div>
    );
}
