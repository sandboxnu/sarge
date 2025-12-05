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
<<<<<<< HEAD
    setModalError: (error: string | null) => void;
=======
>>>>>>> 7da5d60 (feat: Create Position Modal)
}

export default function CreatePositionModal({
    open,
    onOpenChange,
    onCreate,
<<<<<<< HEAD
    setModalError,
}: CreatePositionModalProps) {
    const [positionName, setPositionName] = useState('');
=======
}: CreatePositionModalProps) {
    const [positionName, setPositionName] = useState('');
    const [_error, setError] = useState<string | null>(null); // There are not designs for error states yet
>>>>>>> 7da5d60 (feat: Create Position Modal)
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!positionName.trim()) {
<<<<<<< HEAD
            setModalError('Position name is required');
            return;
        }
        setIsCreating(true);
        setModalError(null);
=======
            setError('Position name is required');
            return;
        }
        setIsCreating(true);
        setError(null);

>>>>>>> 7da5d60 (feat: Create Position Modal)
        try {
            await onCreate(positionName);
            setPositionName('');
            onOpenChange(false);
        } catch {
<<<<<<< HEAD
            setModalError('Failed to create position. Please try again.');
=======
            setError('Failed to create position. Please try again.');
>>>>>>> 7da5d60 (feat: Create Position Modal)
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

<<<<<<< HEAD
                    <div className="flex items-center justify-between">
=======
                    <div className="flex items-center justify-between pt-2">
>>>>>>> 7da5d60 (feat: Create Position Modal)
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
