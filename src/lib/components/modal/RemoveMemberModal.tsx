'use client';

import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';

type RemoveMemberModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    memberName: string;
    submitting: boolean;
    onConfirm: () => void;
}

export default function RemoveMemberModal({
    open,
    onOpenChange,
    memberName,
    submitting,
    onConfirm,
}: RemoveMemberModalProps) {
    return (
        <DialogContent className="px-7 py-6" showCloseButton={false}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <DialogTitle>Remove Member</DialogTitle>
                    <Button type="button" variant="icon" onClick={() => onOpenChange(false)}>
                        <X />
                    </Button>
                </div>

                <p className="text-body-s text-sarge-gray-600">
                    Are you sure you want to remove <strong>{memberName}</strong>.
                </p>

                <div className="flex items-center justify-between">
                    <Button type="button" variant="link" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={submitting}
                        className="h-9 px-4"
                    >
                        {submitting ? 'Removing...' : 'Remove'}
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}