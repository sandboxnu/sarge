'use client';

import { useEffect } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import type { PartialBlock } from '@blocknote/core';
import '@blocknote/shadcn/style.css';

interface BlockNoteViewerProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: PartialBlock<any, any, any>[];
    className?: string;
    editable?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (content: PartialBlock<any, any, any>[]) => void;
}

export default function BlockNoteViewer({
    content,
    className,
    editable = false,
    onChange,
}: BlockNoteViewerProps) {
    const editor = useCreateBlockNote({
        initialContent: content.length > 0 ? content : undefined,
    });

    useEffect(() => {
        if (editable && onChange) {
            return editor.onChange(() => {
                onChange(editor.document);
            });
        }
    }, [editor, editable, onChange]);

    return (
        <div className={className}>
            <BlockNoteView editor={editor} editable={editable} theme="light" />
        </div>
    );
}
