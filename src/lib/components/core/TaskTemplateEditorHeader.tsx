'use client';

import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Chip } from '@/lib/components/ui/Chip';
import { Loader2 } from 'lucide-react';

interface TaskTemplateEditorHeaderProps {
    title: string;
    onTitleChange: (title: string) => void;
    hasUnsavedChanges: boolean;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
}

export default function TaskTemplateEditorHeader({
    title,
    onTitleChange,
    hasUnsavedChanges,
    onSave,
    onCancel,
    isSaving,
}: TaskTemplateEditorHeaderProps) {
    return (
        <div className="border-b border-sarge-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="Task Template Title"
                        className="border-0 bg-transparent text-xl font-semibold focus:ring-0"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {hasUnsavedChanges && (
                        <Chip variant="neutral" className="whitespace-nowrap">
                            Unsaved changes
                        </Chip>
                    )}

                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="whitespace-nowrap px-4 py-2"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={onSave}
                        disabled={isSaving}
                        className="whitespace-nowrap px-4 py-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
