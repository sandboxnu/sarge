'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Field, FieldLabel } from '@/lib/components/ui/Field';

type DeleteOrganizationModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organization: { id: string; name: string };
    onConfirm: () => Promise<boolean>;
    onSuccess: () => void;
};

export default function DeleteOrganizationModal({
    open,
    onOpenChange,
    organization,
    onConfirm,
    onSuccess,
}: DeleteOrganizationModalProps) {
    const [typedValue, setTypedValue] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const confirmMatch = typedValue === organization.name;

    const resetState = () => {
        setTypedValue('');
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            resetState();
        }
        onOpenChange(nextOpen);
    };

    const handleDelete = async () => {
        if (!confirmMatch || submitting) return;
        setSubmitting(true);
        try {
            const ok = await onConfirm();
            if (ok) {
                onSuccess();
                onOpenChange(false);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="px-7 py-6" showCloseButton={false}>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-display-xs">Delete organization</DialogTitle>
                        <Button
                            type="button"
                            variant="icon"
                            onClick={() => handleOpenChange(false)}
                        >
                            <X />
                        </Button>
                    </div>

                    <p className="text-body-s text-sarge-gray-600">
                        This will permanently delete <strong>{organization.name}</strong> and all
                        its positions, candidates, and assessments. This action cannot be undone.
                    </p>

                    <Field className="gap-2">
                        <FieldLabel className="text-label-s font-medium">
                            Type &ldquo;{organization.name}&rdquo; to confirm
                        </FieldLabel>
                        <Input
                            value={typedValue}
                            onChange={(e) => setTypedValue(e.target.value)}
                            placeholder={organization.name}
                            className="h-11 w-full"
                            autoFocus
                        />
                    </Field>

                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="link"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={!confirmMatch || submitting}
                            className="h-9 px-4"
                        >
                            {submitting ? 'Deleting...' : 'Delete organization'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
