'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import useDeleteCandidatesModal from '@/lib/hooks/useDeleteCandidatesModal';
import { type ApplicationDisplayInfo } from '@/lib/types/position.types';

type DeleteCandidatesModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    candidates: ApplicationDisplayInfo[];
    onConfirm: () => Promise<boolean>;
};

export default function DeleteCandidatesModal({
    open,
    onOpenChange,
    candidates,
    onConfirm,
}: DeleteCandidatesModalProps) {
    const { submitting, handleOpenChange, handleDelete } = useDeleteCandidatesModal({
        onOpenChange,
        onConfirm,
    });

    const isSingle = candidates.length === 1;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="px-7 py-6" showCloseButton={false}>
                <div className="flex flex-col gap-4">
                    <DialogTitle>{isSingle ? 'Delete Candidate' : 'Delete Candidates'}</DialogTitle>

                    <DialogDescription className="text-body-s text-sarge-gray-800">
                        {isSingle ? (
                            <>
                                Are you sure you want to permanently delete candidate{' '}
                                <span className="font-medium">{candidates[0].candidate.name}</span>?
                            </>
                        ) : (
                            <>
                                Are you sure you want to permanently delete{' '}
                                <span className="font-medium">{candidates.length}</span> candidates?
                            </>
                        )}{' '}
                        This action cannot be undone.
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
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={submitting}
                            className="h-9 w-[125px]"
                        >
                            {submitting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
