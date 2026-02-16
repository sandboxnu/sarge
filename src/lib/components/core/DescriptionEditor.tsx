'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import type { BlockNoteContent } from '@/lib/types/task-template.types';

interface DescriptionEditorProps {
    description: BlockNoteContent;
    setDescription: (description: BlockNoteContent) => void;
}

export default function DescriptionEditor({ description, setDescription }: DescriptionEditorProps) {
    const editor = useCreateBlockNote({
        initialContent: description.length > 0 ? description : undefined,
    });

    return (
        <BlockNoteView
            editor={editor}
            editable={true}
            theme="light"
            sideMenu={false}
            onChange={() => {
                setDescription(editor.document as BlockNoteContent);
            }}
        />
    );
}
