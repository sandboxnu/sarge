'use client';

import { useEffect, useRef } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import fastDeepEqual from 'fast-deep-equal';
import type { BlockNoteContent } from '@/lib/types/task-template.types';
import '@blocknote/shadcn/style.css';

interface BlockNoteViewerProps {
    content: BlockNoteContent;
    className?: string;
    editable?: boolean;
    onChange?: (content: BlockNoteContent) => void;
}

export default function BlockNoteViewer({
    content,
    className,
    editable = false,
    onChange,
}: BlockNoteViewerProps) {
    const editor = useCreateBlockNote(
        {
            initialContent: content.length > 0 ? content : undefined,
        },
        []
    );

    // Track what content we last saw to avoid unnecessary updates
    const previousContentRef = useRef<BlockNoteContent>(content);
    const isUserEditRef = useRef(false);

    // Update editor when content prop changes (but not when user is editing)
    useEffect(() => {
        // If the user just edited, don't sync back (would cause a loop)
        if (isUserEditRef.current) {
            isUserEditRef.current = false;
            previousContentRef.current = content;
            return;
        }

        // Only update if content actually changed
        if (!fastDeepEqual(content, previousContentRef.current)) {
            if (editor.document.length > 0) {
                editor.replaceBlocks(editor.document, (content.length > 0 ? content : []) as any);
            } else if (content.length > 0) {
                editor.insertBlocks(content as any, editor.document[0] || undefined);
            }
            previousContentRef.current = content;
        }
    }, [content, editor]);

    // Listen for user edits and notify parent (aslo we return a cleanup function)
    useEffect(() => {
        if (editable && onChange) {
            const unsubscribe = editor.onChange(() => {
                isUserEditRef.current = true;
                onChange(editor.document);
            });
            return unsubscribe;
        }
    }, [editor, editable, onChange]);

    return (
        <div className={className} data-blocknote-no-side-menu>
            <BlockNoteView editor={editor} editable={editable} theme="light" sideMenu={false} />
        </div>
    );
}
