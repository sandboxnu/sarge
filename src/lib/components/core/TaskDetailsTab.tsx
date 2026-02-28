'use client';

import dynamic from 'next/dynamic';
import { Field, FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import { RemovableChip } from '@/lib/components/ui/RemovableChip';
import { Combobox } from '@/lib/components/ui/Combobox';
import { createTag } from '@/lib/api/tags';
import type { BlockNoteContent } from '@/lib/types/task-template.types';
import type { TagDTO } from '@/lib/schemas/tag.schema';

// BlockNote: https://www.blocknotejs.org/docs/nextjs
const BlockNoteEditor = dynamic(() => import('@/lib/components/core/BlockNoteEditor'), {
    ssr: false,
});

export interface TaskDetailsTabProps {
    title: string;
    setTitle: (title: string) => void;
    description: BlockNoteContent;
    setDescription: (description: BlockNoteContent) => void;
    tags: TagDTO[];
    setTags: React.Dispatch<React.SetStateAction<TagDTO[]>>;
    availableTags: TagDTO[];
    setAvailableTags: React.Dispatch<React.SetStateAction<TagDTO[]>>;
    isSaving: boolean;
}

export default function TaskDetailsTab({
    title,
    setTitle,
    description,
    setDescription,
    tags,
    setTags,
    availableTags,
    setAvailableTags,
    isSaving,
}: TaskDetailsTabProps) {
    const selectedTagIds = tags.map((t) => t.id);

    const comboboxOptions = availableTags.map((tag) => ({
        value: tag.id,
        label: tag.name,
    }));

    const handleTagChange = (selectedIds: string | string[]) => {
        if (isSaving) return;
        const ids = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
        const selectedTags = availableTags.filter((t) => ids.includes(t.id));
        setTags(selectedTags);
    };

    const removeTag = (tagId: string) => {
        if (isSaving) return;
        setTags((prev: TagDTO[]) => prev.filter((t) => t.id !== tagId));
    };

    const handleCreateTag = async (name: string) => {
        if (isSaving) return;
        try {
            const newTag = await createTag({ name });
            setAvailableTags((prev) => [...prev, newTag]);
            setTags((prev: TagDTO[]) => [...prev, newTag]);
        } catch (err) {
            console.error('Failed to create tag:', err);
        }
    };

    return (
        <div className="flex h-full flex-col gap-2.5">
            <Field className="gap-2">
                <FieldLabel className="text-label-s text-sarge-gray-800">Title</FieldLabel>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-body-s h-11 w-full"
                    disabled={isSaving}
                />
            </Field>

            <Field className="gap-2">
                <FieldLabel className="text-label-s text-sarge-gray-800">Tags</FieldLabel>
                <Combobox
                    options={comboboxOptions}
                    value={selectedTagIds}
                    onChange={handleTagChange}
                    multiple
                    placeholder="Search or create tags..."
                    searchPlaceholder="Search tags..."
                    emptyText="No tags found"
                    onCreateOption={handleCreateTag}
                    variant="check"
                    maxLength={20}
                    disabled={isSaving}
                    trigger={
                        <button
                            type="button"
                            disabled={isSaving}
                            className="bg-sarge-gray-50 border-sarge-gray-200 flex min-h-11 w-full cursor-pointer flex-wrap items-center gap-2 rounded-lg border p-3 text-left disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {tags.length > 0 ? (
                                tags.map((tag) => (
                                    <RemovableChip
                                        key={tag.id}
                                        label={tag.name}
                                        onRemove={() => removeTag(tag.id)}
                                        className="max-w-[160px]"
                                        truncate
                                    />
                                ))
                            ) : (
                                <span className="text-label-s text-sarge-gray-500">
                                    Search or create tags...
                                </span>
                            )}
                        </button>
                    }
                />
            </Field>

            <Field className="min-h-0 flex-1 gap-2">
                <FieldLabel className="text-label-s text-sarge-gray-800">Description</FieldLabel>
                <div
                    data-blocknote-no-side-menu
                    data-blocknote-editor-bg="muted"
                    className={`bg-sarge-gray-50 border-sarge-gray-200 min-h-0 flex-1 overflow-y-auto rounded-lg border px-3 pt-1 ${isSaving ? 'pointer-events-none opacity-50' : ''}`}
                >
                    <BlockNoteEditor description={description} setDescription={setDescription} />
                </div>
            </Field>
        </div>
    );
}
