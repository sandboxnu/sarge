import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAssessmentTemplate } from '@/lib/api/assessment-templates';
import { useAuthSession } from '@/lib/auth/auth-context';
import type { BlockNoteContent } from '@/lib/types/task-template.types';
import type { BlockNoteBlockDTO } from '@/lib/schemas/block-note.schema';

export function useCreateAssessmentTemplateModal(onOpenChange: (open: boolean) => void) {
    const router = useRouter();
    const { userId } = useAuthSession();

    const [name, setName] = useState<string>('');
    const [notes, setNotes] = useState<BlockNoteContent>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!name.trim()) {
            setLocalError('Assessment name is required');
            return;
        }

        if (!userId) {
            setLocalError('You must be logged in to create an assessment template');
            return;
        }

        setIsLoading(true);
        setLocalError(null);

        try {
            const notesForApi = notes
                .filter(
                    (block): block is BlockNoteContent[number] & { id: string } =>
                        typeof block.id === 'string'
                )
                .map((block) => ({
                    id: block.id,
                    type: block.type,
                    props: block.props,
                    content: block.content,
                    children: block.children,
                })) as BlockNoteBlockDTO[];

            const result = await createAssessmentTemplate({
                title: name.trim(),
                authorId: userId,
                internalNotes: notesForApi,
            });

            router.push(`/crm/assessment-templates/${result.id}/edit`);
        } catch (err) {
            const message = (err as Error).message;
            setLocalError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setName('');
        setNotes([]);
        setLocalError(null);
        onOpenChange(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (localError) setLocalError(null);
    };

    const handleNotesChange = (newNotes: BlockNoteContent) => {
        setNotes(newNotes);
    };

    return {
        name,
        notes,
        isLoading,
        localError,
        handleCreate,
        handleCancel,
        handleNameChange,
        handleNotesChange,
    };
}
