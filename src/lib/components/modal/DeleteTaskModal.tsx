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

interface DeleteTaskModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskName: string;
    onConfirm: () => void;
}

export function DeleteTaskModal({ open, onOpenChange, taskName, onConfirm }: DeleteTaskModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Delete Task?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete &quot;{taskName}&quot;? This action cannot
                        be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="destructive-outline"
                        size="md"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="destructive" size="md" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
