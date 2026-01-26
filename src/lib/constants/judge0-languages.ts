export interface Judge0Language {
    slug: string;
    name: string;
    id: number;
}

export const JUDGE0_LANGUAGES: Judge0Language[] = [
    { slug: 'python', name: 'Python 3', id: 71 },
    { slug: 'javascript', name: 'JavaScript', id: 63 },
    { slug: 'java', name: 'Java', id: 62 },
    { slug: 'cpp', name: 'C++', id: 54 },
    { slug: 'c', name: 'C', id: 50 },
    { slug: 'go', name: 'Go', id: 60 },
    { slug: 'ruby', name: 'Ruby', id: 72 },
    { slug: 'typescript', name: 'TypeScript', id: 74 },
    { slug: 'csharp', name: 'C#', id: 51 },
    { slug: 'rust', name: 'Rust', id: 73 },
    { slug: 'swift', name: 'Swift', id: 83 },
    { slug: 'kotlin', name: 'Kotlin', id: 78 },
];

export const AVAILABLE_LANGUAGES = JUDGE0_LANGUAGES.map((l) => l.slug);

export const JUDGE0_LANGUAGE_ID_MAP: Record<string, number> = Object.fromEntries(
    JUDGE0_LANGUAGES.map((l) => [l.slug, l.id])
);

export const JUDGE0_LANGUAGE_NAME_MAP: Record<string, string> = Object.fromEntries(
    JUDGE0_LANGUAGES.map((l) => [l.slug, l.name])
);
