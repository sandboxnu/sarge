'use client';

import dynamic from 'next/dynamic';
import type { BlockNoteContent } from '@/lib/types/task-template.types';

const BlockNoteEditor = dynamic(() => import('@/lib/components/core/BlockNoteEditor'), {
    ssr: false,
});
// blocknote use browser only apis so we need to tell next to not render it on the server

interface CreateAssessmentModalEditorProps {
    onNotesChange: (notes: BlockNoteContent) => void;
}

export default function CreateAssessmentModalEditor({
    onNotesChange,
}: CreateAssessmentModalEditorProps) {
    return (
        <div
            className="bg-sarge-gray-50 border-sarge-gray-200 hover:border-sarge-gray-300 focus-within:border-sarge-gray-300 max-h-[350px] max-w-full min-w-0 overflow-x-hidden overflow-y-scroll rounded-lg border p-3 transition-colors [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            data-blocknote-no-side-menu
            data-blocknote-editor-bg="muted"
        >
            <BlockNoteEditor description={[]} setDescription={onNotesChange} />
        </div>
    );
}
