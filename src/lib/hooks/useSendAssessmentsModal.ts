'use client';

import { useState } from 'react';

type UseSendAssessmentsModalArgs = {
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void>;
};

export default function useSendAssessmentsModal({
    onOpenChange,
    onConfirm,
}: UseSendAssessmentsModalArgs) {
    const [submitting, setSubmitting] = useState(false);

    const handleOpenChange = (nextOpen: boolean) => {
        // Don't let Esc / overlay click close the modal mid-send
        if (submitting) return;
        onOpenChange(nextOpen);
    };

    const handleConfirm = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } finally {
            setSubmitting(false);
        }
    };

    return {
        submitting,
        handleOpenChange,
        handleConfirm,
    };
}
