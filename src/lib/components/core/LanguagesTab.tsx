'use client';

import * as React from 'react';
import { RemovableChip } from '@/lib/components/ui/RemovableChip';
import { Combobox } from '@/lib/components/ui/Combobox';
import { Separator } from '@/lib/components/ui/Separator';
import { getLanguageOptions, getLanguageLabel } from '@/lib/utils/language.utils';
import CodeStubGenerator from '@/lib/components/core/CodeStubGenerator';
import type { TaskTemplateLanguageDTO } from '@/lib/schemas/task-template-language.schema';

export interface LanguagesTabProps {
    languages?: TaskTemplateLanguageDTO[];
    setLanguages: React.Dispatch<React.SetStateAction<TaskTemplateLanguageDTO[] | undefined>>;
}

export default function LanguagesTab({ languages, setLanguages }: LanguagesTabProps) {
    const selectedLanguageValues = (languages ?? []).map((l) => l.language);

    const handleLanguageChange = (selected: string | string[]) => {
        const selectedArr = Array.isArray(selected) ? selected : [selected];

        const existing = (languages ?? []).filter((l) => selectedArr.includes(l.language));
        const existingLangs = existing.map((l) => l.language);
        const newLangs = selectedArr.filter(
            (lang) => !existingLangs.includes(lang as TaskTemplateLanguageDTO['language'])
        );

        const newEntries: TaskTemplateLanguageDTO[] = newLangs.map((lang, i) => ({
            id: -(Date.now() + i),
            taskTemplateId: '',
            language: lang as TaskTemplateLanguageDTO['language'],
            solution: '',
            stub: '',
        }));

        setLanguages([...existing, ...newEntries]);
    };

    const removeLanguage = (lang: string) => {
        setLanguages((prev) => (prev ?? []).filter((l) => l.language !== lang));
    };

    const clearAll = () => {
        setLanguages([]);
    };

    const languageOptions = getLanguageOptions();
    const hasLanguages = selectedLanguageValues.length > 0;

    return (
        <div className="flex h-full flex-col gap-5">
            <div className="flex flex-col gap-2.5">
                <div className="flex flex-col">
                    <span className="text-label-s text-sarge-gray-800">Languages</span>
                    <span className="text-sarge-gray-500 text-body-xs">
                        Candidates can solve this question in the selected languages
                    </span>
                </div>

                <Combobox
                    options={languageOptions}
                    value={selectedLanguageValues}
                    onChange={handleLanguageChange}
                    multiple
                    variant="checkbox"
                    showSelectAll
                    placeholder="Select Languages"
                    searchPlaceholder="Search"
                    emptyText="No languages found"
                    showSearchIcon
                    trigger={
                        <button
                            type="button"
                            className="bg-sarge-gray-50 border-sarge-gray-200 flex min-h-11 w-full cursor-pointer items-start rounded-lg border py-3 pr-3 pl-4 text-left"
                        >
                            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                                {hasLanguages ? (
                                    selectedLanguageValues.map((lang) => (
                                        <RemovableChip
                                            key={lang}
                                            label={getLanguageLabel(lang)}
                                            onRemove={() => removeLanguage(lang)}
                                        />
                                    ))
                                ) : (
                                    <span className="text-label-s text-sarge-gray-500 leading-[20px]">
                                        Select Languages
                                    </span>
                                )}
                            </div>

                            <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (hasLanguages) clearAll();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (hasLanguages) clearAll();
                                    }
                                }}
                                className={`text-label-xs ml-2 shrink-0 leading-[20px] whitespace-nowrap ${
                                    hasLanguages
                                        ? 'text-sarge-primary-600 hover:text-sarge-primary-700 cursor-pointer'
                                        : 'text-sarge-gray-300 cursor-default'
                                }`}
                            >
                                Clear All
                            </span>
                        </button>
                    }
                />
            </div>

            <Separator />

            <CodeStubGenerator disabled={!hasLanguages} />
        </div>
    );
}
