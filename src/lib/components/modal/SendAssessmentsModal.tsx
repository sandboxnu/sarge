'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import useSendAssessmentsModal from '@/lib/hooks/useSendAssessmentsModal';

type SendAssessmentsModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    candidateCount: number;
    assessmentTitle?: string | null;
    onConfirm: () => Promise<void>;
};

export default function SendAssessmentsModal({
    open,
    onOpenChange,
    candidateCount,
    assessmentTitle,
    onConfirm,
}: SendAssessmentsModalProps) {
    const { submitting, handleOpenChange, handleConfirm } = useSendAssessmentsModal({
        onOpenChange,
        onConfirm,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="px-7 py-6" showCloseButton={false}>
                <div className="flex flex-col gap-4">
                    <DialogTitle>Send Assessment Invitations</DialogTitle>

                    <DialogDescription className="text-body-s text-sarge-gray-800">
                        Are you sure you want to send{' '}
                        <span className="font-medium">{assessmentTitle ?? 'this assessment'}</span>{' '}
                        to <span className="font-medium">{candidateCount}</span>{' '}
                        {candidateCount === 1 ? 'candidate' : 'candidates'}? Candidates will receive
                        an email invitation.
                    </DialogDescription>

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="icon"
                            className="px-4"
                            onClick={() => handleOpenChange(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            disabled={submitting}
                            className="h-9 w-[125px]"
                        >
                            {submitting ? 'Sending...' : 'Send'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
