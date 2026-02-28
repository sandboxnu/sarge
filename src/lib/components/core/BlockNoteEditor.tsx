'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import type { BlockNoteContent } from '@/lib/types/task-template.types';

interface BlockNoteEditorProps {
    description: BlockNoteContent;
    setDescription: (description: BlockNoteContent) => void;
    compact?: boolean;
}

export default function BlockNoteEditor({
    description,
    setDescription,
    compact = false,
}: BlockNoteEditorProps) {
    const editor = useCreateBlockNote({
        initialContent: description.length > 0 ? description : undefined,
    });

    const view = (
        <BlockNoteView
            editor={editor}
            editable={true}
            theme="light"
            sideMenu={false}
            formattingToolbar={compact ? false : undefined}
            filePanel={compact ? false : undefined}
            tableHandles={compact ? false : undefined}
            emojiPicker={compact ? false : undefined}
            onChange={() => {
                setDescription(editor.document as BlockNoteContent);
            }}
        />
    );

    if (compact) {
        return (
            <div data-blocknote-no-side-menu data-blocknote-compact>
                {view}
            </div>
        );
    }

    return view;
}
