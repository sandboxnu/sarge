import { ProgrammingLanguage } from '@/generated/prisma';

/**
 * Any language not listed here falls back to capitalizing the first letter.
 */
const LANGUAGE_DISPLAY_NAMES: Partial<Record<string, string>> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
};

/**
 * Returns the display label for a ProgrammingLanguage enum value.
 * 'python' -> 'Python', 'javascript' -> 'JavaScript'
 */
export function getLanguageLabel(lang: string): string {
    return LANGUAGE_DISPLAY_NAMES[lang] ?? lang.charAt(0).toUpperCase() + lang.slice(1);
}

export function getLanguageOptions(): { value: string; label: string }[] {
    return Object.values(ProgrammingLanguage).map((lang) => ({
        value: lang,
        label: getLanguageLabel(lang),
    }));
}
