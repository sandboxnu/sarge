'use client';

import { useState } from 'react';

type UseDeleteCandidatesModalArgs = {
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<boolean>;
};

export default function useDeleteCandidatesModal({
    onOpenChange,
    onConfirm,
}: UseDeleteCandidatesModalArgs) {
    const [submitting, setSubmitting] = useState(false);

    const handleOpenChange = (nextOpen: boolean) => {
        // Don't let Esc / overlay click close the modal mid-delete
        if (submitting) return;
        onOpenChange(nextOpen);
    };

    const handleDelete = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const ok = await onConfirm();
            if (ok) {
                onOpenChange(false);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return {
        submitting,
        handleOpenChange,
        handleDelete,
    };
}
