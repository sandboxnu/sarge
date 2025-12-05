'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './Modal';
import { Field, FieldLabel } from '@/lib/components/Field';
import { Input } from '@/lib/components/Input';
import { Button } from '@/lib/components/Button';

interface CreatePositionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (title: string) => Promise<void>;
}

export default function CreatePositionModal({
    open,
    onOpenChange,
    onCreate,
}: CreatePositionModalProps) {
    const [positionName, setPositionName] = useState('');
    const [_error, setError] = useState<string | null>(null); // There are not designs for error states yet
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!positionName.trim()) {
            setError('Position name is required');
            return;
        }
        setIsCreating(true);
        setError(null);

        try {
            await onCreate(positionName);
            setPositionName('');
            onOpenChange(false);
        } catch {
            setError('Failed to create position. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[614px] gap-4 p-6" showCloseButton={true}>
                <div className="flex flex-col gap-4">
                    <DialogTitle className="text-sarge-gray-800 text-lg font-bold">
                        Create new position
                    </DialogTitle>

                    <Field className="gap-1">
                        <FieldLabel className="text-sarge-gray-800 text-sm font-medium">
                            Position name
                        </FieldLabel>
                        <Input
                            placeholder="Enter a position name"
                            value={positionName}
                            onChange={(e) => setPositionName(e.target.value)}
                            className="h-11"
                        />
                    </Field>

                    <div className="flex items-center justify-between pt-2">
                        <Button variant="tertiary" onClick={handleCancel} className="px-0 py-2">
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreate}
                            disabled={isCreating}
                            className="h-9 w-[125px] px-4 py-2"
                        >
                            {isCreating ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
