'use client';

import { ChevronDown, EllipsisVertical } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/lib/components/ui/Tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { getLanguageLabel } from '@/lib/utils/language.utils';

const TAB_TRIGGER_CLASS =
    'data-[state=active]:!border-sarge-gray-600 relative h-full rounded-none !border-0 ' +
    'px-2.5 !text-white data-[state=active]:!border-x-1 data-[state=active]:!border-y-0 ' +
    'data-[state=active]:!bg-transparent data-[state=active]:!shadow-none ' +
    'data-[state=active]:after:absolute data-[state=active]:after:right-0 ' +
    'data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 ' +
    'data-[state=active]:after:h-[1px] data-[state=active]:after:bg-sarge-gray-700 ' +
    "data-[state=active]:after:content-['']";

interface CodeEditorToolbarProps {
    activeTab: 'task' | 'solution';
    onTabChange: (tab: 'task' | 'solution') => void;
    languages: { language: string }[];
    selectedLanguageIndex: number;
    onLanguageChange: (index: number) => void;
    disabled?: boolean;
}

export default function CodeEditorToolbar({
    activeTab,
    onTabChange,
    languages,
    selectedLanguageIndex,
    onLanguageChange,
    disabled = false,
}: CodeEditorToolbarProps) {
    const currentLanguage = languages[selectedLanguageIndex];

    return (
        <div className="border-b-sarge-gray-600 flex w-full justify-between border-b-1 text-white">
            <Tabs
                value={activeTab}
                onValueChange={disabled ? undefined : (v) => onTabChange(v as 'task' | 'solution')}
            >
                <TabsList className="h-auto bg-transparent p-0">
                    <TabsTrigger value="task" disabled={disabled} className={TAB_TRIGGER_CLASS}>
                        Main
                    </TabsTrigger>
                    <TabsTrigger value="solution" disabled={disabled} className={TAB_TRIGGER_CLASS}>
                        Solution
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="text-md flex items-center gap-1.5">
                <div>Language</div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={disabled}>
                        <div
                            className={`bg-primary text-primary-foreground flex items-center gap-2.5 rounded-sm px-2.5 ${
                                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                        >
                            {currentLanguage ? getLanguageLabel(currentLanguage.language) : ''}
                            <ChevronDown className="size-4" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="bottom"
                        align="center"
                        className="bg-primary rounded-sm px-2.5"
                    >
                        <DropdownMenuGroup className="!hover:bg-sarge-primary-600 !text-primary-foreground p-0">
                            {languages.map((lang, index) => (
                                <DropdownMenuItem
                                    className="!hover:text-sarge-primary-500 !text-primary-foreground cursor-pointer border-none"
                                    key={lang.language}
                                    onClick={() => onLanguageChange(index)}
                                >
                                    {getLanguageLabel(lang.language)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <EllipsisVertical className="mr-2.5 size-5" />
            </div>
        </div>
    );
}
