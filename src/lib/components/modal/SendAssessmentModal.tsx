'use client';

import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import { Button } from '@/lib/components/ui/Button';
import { X } from 'lucide-react';
import useSendAssessmentModal from '@/lib/hooks/useSendAssessmentModal';

export type SendAssessmentModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (deadlineIso: string) => Promise<void> | void;
    isSending: boolean;
};

export default function SendAssessmentModal({
    open,
    onOpenChange,
    onConfirm,
    isSending,
}: SendAssessmentModalProps) {
    const { dueDate, setDueDate, minDate, handleConfirm, handleOpenChange, handleCancel } =
        useSendAssessmentModal({ open, onOpenChange, onConfirm, isSending });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="w-[480px] gap-0 px-8 py-6" showCloseButton={false}>
                <div className="flex h-full flex-col">
                    <div className="mb-6 flex w-full items-start justify-between">
                        <DialogTitle className="text-display-xs text-sarge-gray-800 font-bold">
                            Send assessments
                        </DialogTitle>
                        <Button variant="icon" onClick={handleCancel} aria-label="Close">
                            <X className="size-5" />
                        </Button>
                    </div>

                    <p className="text-sarge-gray-600 mb-6 text-sm">
                        OAs not completed by 11:59 PM Eastern on this day will expire.
                    </p>

                    <div className="mb-8 flex flex-col gap-2">
                        <FieldLabel className="text-label-m text-sarge-gray-700">
                            Due date
                        </FieldLabel>
                        <Input
                            type="date"
                            value={dueDate}
                            min={minDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="h-11 w-full"
                        />
                    </div>

                    <div className="flex w-full items-center justify-between">
                        <Button variant="link" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleConfirm}
                            disabled={!dueDate || isSending}
                            className="h-9 px-4 py-2"
                        >
                            {isSending ? 'Sending...' : 'Send to all candidates'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
