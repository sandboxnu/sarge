'use client';

import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Field, FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import { Button } from '@/lib/components/ui/Button';
import { AlertCircle } from 'lucide-react';
import useCreatePositionModal from '@/lib/hooks/useCreatePositionModal';
import { type PositionWithCounts } from '@/lib/types/position.types';

export interface CreatePositionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // https://stackoverflow.com/questions/72451220/how-to-set-props-type-of-a-usestate-function
    setActive: React.Dispatch<React.SetStateAction<PositionWithCounts[]>>;
}

export default function CreatePositionModal({
    open,
    onOpenChange,
    setActive,
}: CreatePositionModalProps) {
    const { positionName, isCreating, localError, handleCreate, handleCancel, handleInputChange } =
        useCreatePositionModal(onOpenChange, setActive);

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
                        />
                        {localError && (
                            <div className="text-body-s mt-1 flex items-center gap-2 text-sarge-error-700">
                                <AlertCircle className="size-4" />
                                {localError}
                            </div>
                        )}
                    </Field>

                    <div className="flex items-center justify-between">
                        <p
                            className="text-sarge-primary-500 hover:cursor-pointer hover:text-sarge-primary-600"
                            onClick={handleCancel}
                        >
                            Back
                        </p>
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
