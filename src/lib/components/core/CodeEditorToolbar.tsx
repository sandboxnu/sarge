'use client';

import { Button } from '@/lib/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { Play, Loader2 } from 'lucide-react';

interface CodeEditorToolbarProps {
    language: string;
    availableLanguages: string[];
    onLanguageChange: (language: string) => void;
    onRunCode: () => void;
    isRunning: boolean;
}

export default function CodeEditorToolbar({
    language,
    availableLanguages,
    onLanguageChange,
    onRunCode,
    isRunning,
}: CodeEditorToolbarProps) {
    return (
        <div className="flex items-center justify-between border-b border-sarge-gray-200 bg-sarge-gray-50 px-4 py-3">
            <div className="flex items-center gap-2">
                <span className="text-label-xs font-medium text-sarge-gray-600">Language:</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="min-w-[120px] rounded-lg border border-sarge-gray-200 bg-white px-3 py-2 text-sm capitalize text-sarge-gray-800 transition-colors hover:bg-sarge-gray-50">
                            {language}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuRadioGroup value={language} onValueChange={onLanguageChange}>
                            {availableLanguages.map((lang) => (
                                <DropdownMenuRadioItem
                                    key={lang}
                                    value={lang}
                                    className="capitalize"
                                >
                                    {lang}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Button
                onClick={onRunCode}
                disabled={isRunning}
                variant="primary"
                className="gap-2 px-4 py-2"
            >
                {isRunning ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Running...</span>
                    </>
                ) : (
                    <>
                        <Play className="h-4 w-4" />
                        <span>Run Code</span>
                    </>
                )}
            </Button>
        </div>
    );
}
