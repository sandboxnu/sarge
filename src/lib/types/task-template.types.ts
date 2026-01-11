import type { PartialBlock } from '@blocknote/core';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    description: PartialBlock<any, any, any>[];
    publicTestCases: TestCase[];
    privateTestCases: TestCase[];
    starterCodes: StarterCode[];
}

export interface EditableTestCase extends TestCase {
    id: string;
    isPublic: boolean;
}
