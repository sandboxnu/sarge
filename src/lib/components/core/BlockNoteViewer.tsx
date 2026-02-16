'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import type { BlockNoteContent } from '@/lib/types/task-template.types';

interface BlockNoteViewerProps {
    content: BlockNoteContent | null | undefined;
    className?: string;
}

const hasContent = (content: BlockNoteContent | null | undefined): boolean =>
    Array.isArray(content) && content.length > 0;

export function BlockNoteViewer({ content, className }: BlockNoteViewerProps) {
    const editor = useCreateBlockNote(
        {
            initialContent: content && hasContent(content) ? content : undefined,
        },
        [content]
    );

    if (!hasContent(content)) {
        return (
            <div
                data-blocknote-no-side-menu
                className={`text-body-m text-muted-foreground ${className ?? ''}`}
            >
                No description
            </div>
        );
    }

    return (
        <div data-blocknote-no-side-menu className={className}>
            <BlockNoteView
                editor={editor}
                editable={false}
                theme="light"
                sideMenu={false}
                formattingToolbar={false}
                slashMenu={false}
                linkToolbar={false}
                filePanel={false}
                tableHandles={false}
            />
        </div>
    );
}
