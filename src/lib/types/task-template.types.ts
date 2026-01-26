import type { PartialBlock } from '@blocknote/core';

export type BlockNoteContent = PartialBlock[];

export interface Tag {
    id: string;
    name: string;
    colorHexCode: string | null;
}

export interface TestCase {
    input: string;
    output: string;
}

export interface StarterCode {
    id?: string;
    language: string;
    code: string;
}

export interface TaskTemplateListItem {
    id: string;
    title: string;
    tags: Tag[];
}

export interface TaskTemplateDetail extends TaskTemplateListItem {
    description: BlockNoteContent;
    publicTestCases: TestCase[];
    privateTestCases: TestCase[];
    starterCodes: StarterCode[];
    recommendedTimeMinutes?: number;
}

export interface EditableTestCase extends TestCase {
    id: string;
    isPublic: boolean;
}
