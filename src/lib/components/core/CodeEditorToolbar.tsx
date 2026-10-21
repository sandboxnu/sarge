'use client';

import { ChevronDown } from 'lucide-react';
import { Tabs, TabsList, CodeTabsTrigger } from '@/lib/components/ui/Tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { Chip } from '@/lib/components/ui/Chip';
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
        <div className="bg-sarge-gray-800 border-sarge-gray-700 flex w-full items-stretch border-b">
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

            <div className="flex flex-1 items-center justify-end gap-1.5 bg-[#282C32] px-2.5">
                <span className="text-label-xs text-sarge-gray-500">Language</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={disabled}>
                        <Chip
                            className={`bg-sarge-gray-700 text-label-xs text-sarge-gray-50 h-[22px] gap-1.5 rounded-sm px-3 py-0 ${
                                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                        >
                            {currentLanguage ? getLanguageLabel(currentLanguage.language) : ''}
                            <ChevronDown className="size-2.5" />
                        </Chip>
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
        </div>
    );
}
