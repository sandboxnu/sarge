'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './Modal';
import { Field, FieldLabel } from '@/lib/components/Field';
import { Input } from '@/lib/components/Input';
import { Button } from '@/lib/components/Button';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createPositionAction } from '@/app/actions/position.actions';

interface CreatePositionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreatePositionModal({
    open,
    onOpenChange,
}: CreatePositionModalProps) {
    const [positionName, setPositionName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!positionName.trim()) {
            setLocalError('Position name is required');
            return;
        }
        setIsCreating(true);
        setLocalError(null);
        try {
            await createPositionAction(positionName);
            toast.success('Position created successfully.');
            setPositionName('');
            onOpenChange(false);
        } catch {
            const errorMsg = 'Failed to create position. Please try again.';
            setLocalError(errorMsg);
            toast.error('Creation failed', {
                description: errorMsg,
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleCancel = () => {
        setPositionName('');
        setLocalError(null);
        onOpenChange(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPositionName(e.target.value);
        if (localError) {
            setLocalError(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl gap-4 p-6" showCloseButton={true}>
                <div className="flex flex-col gap-4">
                    <DialogTitle className="text-display-xs">Create new position</DialogTitle>

                    <Field className="gap-1">
                        <FieldLabel className="text-label-s">Position name</FieldLabel>
                        <Input
                            placeholder="Enter a position name"
                            value={positionName}
                            onChange={handleInputChange}
                            className="h-11"
                        />
                        {localError && (
                            <div className="text-sarge-error-700 mt-1 flex items-center gap-2 text-body-s">
                                <AlertCircle className="size-4" />
                                {localError}
                            </div>
                        )}
                    </Field>

                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="tertiary"
                            onClick={handleCancel}
                            className="px-0 py-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleCreate}
                            disabled={isCreating}
                            className="min-w-[125px] px-4 py-2"
                        >
                            {isCreating ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
