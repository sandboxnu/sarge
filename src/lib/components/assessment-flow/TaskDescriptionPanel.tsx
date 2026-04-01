import { HighlightGuard } from '@/lib/components/core/HighlightGuard';
import { BlockNoteViewer } from '@/lib/components/core/BlockNoteViewer';
import type { BlockNoteContent } from '@/lib/types/task-template.types';

type TaskDescriptionPanelProps = {
    description: unknown;
};

export default function TaskDescriptionPanel({ description }: TaskDescriptionPanelProps) {
    return (
        <HighlightGuard className="h-full overflow-y-auto px-5 pt-1 pb-4">
            <div data-oa-task-description className="min-h-0">
                <BlockNoteViewer content={description as BlockNoteContent} />
            </div>
        </HighlightGuard>
    );
}
