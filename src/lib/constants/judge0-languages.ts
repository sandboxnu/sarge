export interface Judge0Language {
    languageId: string;
    name: string;
    id: number;
}

export const JUDGE0_LANGUAGES: Judge0Language[] = [
    { languageId: 'python', name: 'Python 3', id: 71 },
    { languageId: 'javascript', name: 'JavaScript', id: 63 },
    { languageId: 'java', name: 'Java', id: 62 },
    { languageId: 'cpp', name: 'C++', id: 54 },
    { languageId: 'c', name: 'C', id: 50 },
    { languageId: 'go', name: 'Go', id: 60 },
    { languageId: 'ruby', name: 'Ruby', id: 72 },
    { languageId: 'typescript', name: 'TypeScript', id: 74 },
    { languageId: 'csharp', name: 'C#', id: 51 },
    { languageId: 'rust', name: 'Rust', id: 73 },
    { languageId: 'swift', name: 'Swift', id: 83 },
    { languageId: 'kotlin', name: 'Kotlin', id: 78 },
];

export const AVAILABLE_LANGUAGES = JUDGE0_LANGUAGES.map((l) => l.languageId);

export const JUDGE0_LANGUAGE_ID_MAP: Record<string, number> = Object.fromEntries(
    JUDGE0_LANGUAGES.map((l) => [l.languageId, l.id])
);

export const JUDGE0_LANGUAGE_NAME_MAP: Record<string, string> = Object.fromEntries(
    JUDGE0_LANGUAGES.map((l) => [l.languageId, l.name])
);
