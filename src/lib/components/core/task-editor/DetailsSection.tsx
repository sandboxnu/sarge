'use client';

import dynamic from 'next/dynamic';
import type { BlockNoteContent } from '@/lib/types/task-template.types';
import { Input } from '@/lib/components/ui/Input';
import { Button } from '@/lib/components/ui/Button';
import { getTagTextColor } from '@/lib/utils/color.utils';

// BlockNote requires window, so we load it client-only
const BlockNoteViewer = dynamic(() => import('@/lib/components/core/BlockNoteViewer'), {
    ssr: false,
    loading: () => <div className="min-h-[200px] rounded-lg border border-input bg-muted/30" />,
});

interface DetailsSectionProps {
    title: string;
    onTitleChange: (value: string) => void;
    description: BlockNoteContent;
    onDescriptionChange: (value: BlockNoteContent) => void;
    tags?: { id: string; name: string; colorHexCode: string | null }[];
    onTagsChange?: (tags: { id: string; name: string; colorHexCode: string | null }[]) => void;
}

export function DetailsSection({
    title,
    onTitleChange,
    description,
    onDescriptionChange,
    tags,
    onTagsChange,
}: DetailsSectionProps) {
    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
            <div>
                <h3 className="text-label-m text-foreground">Task Details</h3>
                <p className="text-body-s mt-1 text-muted-foreground">
                    Basic information about the task. This is what candidates will see.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="task-title" className="text-label-s text-foreground">
                    Task Title <span className="text-destructive">*</span>
                </label>
                <Input
                    id="task-title"
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="e.g., Two Sum, Merge Intervals"
                />
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-label-s text-foreground">
                    Description <span className="text-destructive">*</span>
                </span>
                <BlockNoteViewer
                    content={description}
                    onChange={onDescriptionChange}
                    editable={true}
                    className="min-h-[200px] overflow-auto rounded-lg border border-input"
                />
            </div>

            {(tags != null || onTagsChange != null) && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-label-s text-foreground">Tags</span>
                        {onTagsChange && tags && tags.length > 0 && (
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                onClick={() => onTagsChange([])}
                                className="text-body-s"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                    <div className="flex min-h-11 items-center rounded-lg border border-sarge-gray-200 bg-sarge-gray-50 px-3 py-2">
                        {tags && tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded-lg px-2 py-0.5 text-xs font-medium"
                                        style={{
                                            backgroundColor: tag.colorHexCode ?? '#F1F1EF',
                                            color: getTagTextColor(tag.colorHexCode),
                                        }}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-body-s text-muted-foreground">No tags</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
