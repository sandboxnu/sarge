'use client';

import { Check } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { Separator } from '@/lib/components/ui/Separator';
import { Search } from '@/lib/components/core/Search';
import { JUDGE0_LANGUAGES, type Judge0Language } from '@/lib/constants/judge0-languages';
import { useSearch } from '@/lib/hooks/useSearch';
import { cn } from '@/lib/utils/cn.utils';
import { CodeStubGenerator } from './CodeStubGenerator';

interface LanguagesSectionProps {
    selectedLanguages: string[];
    onSelectedLanguagesChange: (languages: string[]) => void;
}

export function LanguagesSection({
    selectedLanguages,
    onSelectedLanguagesChange,
}: LanguagesSectionProps) {
    const {
        query: searchQuery,
        setQuery: setSearchQuery,
        results: filteredLanguages,
        resultCount,
        totalCount,
    } = useSearch<Judge0Language>({
        data: JUDGE0_LANGUAGES,
        keys: ['name', 'languageId'],
    });

    const isSearching = searchQuery.trim().length > 0;

    const visibleSelectedCount = filteredLanguages.filter((lang) =>
        selectedLanguages.includes(lang.languageId)
    ).length;

    const totalSelectedCount = selectedLanguages.length;

    const allVisibleSelected =
        visibleSelectedCount === filteredLanguages.length && filteredLanguages.length > 0;

    const noVisibleSelected = visibleSelectedCount === 0;

    const handleToggle = (languageId: string) => {
        if (selectedLanguages.includes(languageId)) {
            onSelectedLanguagesChange(selectedLanguages.filter((l) => l !== languageId));
        } else {
            onSelectedLanguagesChange([...selectedLanguages, languageId]);
        }
    };

    const handleSelectAll = () => {
        const visibleLanguageIds = filteredLanguages.map((l) => l.languageId);
        const updatedSelectedLanguages = [
            ...new Set([...selectedLanguages, ...visibleLanguageIds]),
        ];
        onSelectedLanguagesChange(updatedSelectedLanguages);
    };

    const handleClearAll = () => {
        const visibleLanguageIds = new Set(filteredLanguages.map((l) => l.languageId));
        const updatedSelectedLanguages = selectedLanguages.filter(
            (languageId) => !visibleLanguageIds.has(languageId)
        );
        onSelectedLanguagesChange(updatedSelectedLanguages);
    };

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
            <h3 className="text-label-m text-foreground">Languages</h3>

            <p className="text-body-s mt-1 text-muted-foreground">
                Candidates will have an option to solve this question in the selected languages.
            </p>

            <div className="mt-7 flex items-center justify-between">
                <label className="text-label-s text-sarge-gray-600">Search language</label>

                <div className="flex items-center">
                    <Button
                        type="button"
                        variant="tertiary"
                        size="sm"
                        onClick={handleClearAll}
                        disabled={noVisibleSelected}
                        className={cn(
                            'text-sarge-primary-600',
                            noVisibleSelected && 'cursor-not-allowed opacity-40'
                        )}
                    >
                        Clear all
                    </Button>

                    <Separator orientation="vertical" className="mx-1 h-5" />

                    <Button
                        type="button"
                        variant="tertiary"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={allVisibleSelected}
                        className={cn(
                            'text-sarge-primary-600',
                            allVisibleSelected && 'cursor-not-allowed opacity-40'
                        )}
                    >
                        Select all
                    </Button>
                </div>
            </div>

            <div className="mt-2">
                <Search
                    placeholder="Start typing a language name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="text-body-s mt-5 text-sarge-gray-600">
                {isSearching ? (
                    <span>
                        <span className="text-label-s">{resultCount} results</span>
                        <span> - </span>
                        <span className="text-label-s">{totalSelectedCount} selected</span>
                    </span>
                ) : (
                    <span>
                        <span>{totalCount} languages available</span>
                        <span> - </span>
                        <span className="text-label-s">{totalSelectedCount} selected</span>
                    </span>
                )}
            </div>

            <div className="mt-4 grid grid-cols-5 gap-3">
                {filteredLanguages.map((lang: Judge0Language) => {
                    const isSelected = selectedLanguages.includes(lang.languageId);
                    return (
                        <button
                            key={lang.languageId}
                            type="button"
                            onClick={() => handleToggle(lang.languageId)}
                            className={cn(
                                'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors',
                                isSelected
                                    ? 'border-sarge-primary-500 bg-accent'
                                    : 'border-border bg-background hover:bg-card'
                            )}
                        >
                            <div
                                className={cn(
                                    'flex size-4 shrink-0 items-center justify-center rounded-sm border-2 transition-colors',
                                    isSelected
                                        ? 'border-sarge-primary-600 bg-sarge-primary-600'
                                        : 'border-sarge-gray-300 bg-transparent'
                                )}
                            >
                                {isSelected && (
                                    <Check className="size-2.5 text-background" strokeWidth={3} />
                                )}
                            </div>

                            <span className="text-label-s text-foreground">{lang.name}</span>
                        </button>
                    );
                })}
            </div>

            {filteredLanguages.length === 0 && (
                <p className="text-body-s py-8 text-center text-sarge-gray-600">
                    No languages found matching &quot;{searchQuery}&quot;
                </p>
            )}

            <CodeStubGenerator selectedLanguages={selectedLanguages} />
        </div>
    );
}
