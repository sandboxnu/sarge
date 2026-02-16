import type { PartialBlock } from '@blocknote/core';

// BlockNote document content - array of blocks (paragraphs, headings
// Used for TaskTemplate.description stored as JSON in the database.
export type BlockNoteContent = PartialBlock[];
