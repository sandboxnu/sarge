'use client';

import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import { Combobox } from '@/lib/components/ui/Combobox';
import { Field, FieldLabel } from '@/lib/components/ui/Field';
import useTransferOwnershipModal from '@/lib/hooks/useTransferOwnershipModal';
import type { MemberWithUser } from '@/lib/types/member.types';

type TransferOwnershipModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    eligibleMembers: MemberWithUser[];
    onConfirm: (targetMemberId: string) => Promise<boolean>;
    onSuccess: () => void;
};

export default function TransferOwnershipModal({
    open,
    onOpenChange,
    eligibleMembers,
    onConfirm,
    onSuccess,
}: TransferOwnershipModalProps) {
    const {
        selectedMemberId,
        setSelectedMemberId,
        submitting,
        options,
        handleOpenChange,
        handleTransfer,
    } = useTransferOwnershipModal({ eligibleMembers, onOpenChange, onConfirm, onSuccess });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="px-7 py-6" showCloseButton={false}>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Transfer ownership</DialogTitle>
                        <Button
                            type="button"
                            variant="icon"
                            onClick={() => handleOpenChange(false)}
                        >
                            <X />
                        </Button>
                    </div>

                    <p className="text-body-s text-sarge-gray-600">
                        Transfer ownership of this organization to another member. You will be
                        demoted to <strong>Admin</strong>. This cannot be undone.
                    </p>

                    <Field className="gap-2">
                        <FieldLabel className="text-label-s font-medium">
                            Select new owner
                        </FieldLabel>
                        <Combobox
                            options={options}
                            value={selectedMemberId}
                            onChange={(v) => setSelectedMemberId(v as string)}
                            placeholder="Select a member..."
                            searchPlaceholder="Search members..."
                            emptyText="No eligible members."
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
                            onClick={handleTransfer}
                            disabled={!selectedMemberId || submitting}
                            className="h-9 px-4"
                        >
                            {submitting ? 'Transferring...' : 'Transfer ownership'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
