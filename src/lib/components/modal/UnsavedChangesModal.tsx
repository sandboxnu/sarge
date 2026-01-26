'use client';

import { Button } from '@/lib/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/lib/components/ui/Modal';

interface UnsavedChangesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function UnsavedChangesModal({ open, onOpenChange, onConfirm }: UnsavedChangesModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Unsaved Changes</DialogTitle>
                    <DialogDescription>
                        You have unsaved changes. Are you sure you want to leave? Your changes will
                        be lost.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="secondary" size="md" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="md" onClick={onConfirm}>
                        Leave
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
