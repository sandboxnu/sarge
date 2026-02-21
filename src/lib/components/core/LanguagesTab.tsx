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
    removeLanguage: (lang: string) => void;
    clearAllLanguages: () => void;
    handleLanguageSelectionChange: (selected: string | string[]) => void;
}

export default function LanguagesTab({
    languages,
    removeLanguage,
    clearAllLanguages,
    handleLanguageSelectionChange,
}: LanguagesTabProps) {
    const selectedLanguageValues = (languages ?? []).map((l) => l.language);

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
                    onChange={handleLanguageSelectionChange}
                    multiple
                    variant="checkbox"
                    showSelectAll
                    placeholder="Select Languages"
                    searchPlaceholder="Search"
                    emptyText="No languages found"
                    showSearchIcon
                    filterMode="prefix"
                    trigger={
                        <button
                            type="button"
                            className="bg-sarge-gray-50 border-sarge-gray-200 flex min-h-11 w-full cursor-pointer items-start rounded-lg border py-2 pr-3 pl-4 text-left"
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
                                    <span className="text-label-s text-sarge-gray-500 py-[3px]">
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
                                    if (hasLanguages) clearAllLanguages();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (hasLanguages) clearAllLanguages();
                                    }
                                }}
                                className={`text-label-xs mt-1 ml-2 shrink-0 whitespace-nowrap ${
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
