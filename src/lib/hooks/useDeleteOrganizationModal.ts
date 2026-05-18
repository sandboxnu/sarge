'use client';

import { useState } from 'react';

type UseDeleteOrganizationModalArgs = {
    organizationName: string;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<boolean>;
    onSuccess: () => void;
};

export default function useDeleteOrganizationModal({
    organizationName,
    onOpenChange,
    onConfirm,
    onSuccess,
}: UseDeleteOrganizationModalArgs) {
    const [typedValue, setTypedValue] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const confirmMatch = typedValue === organizationName;

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setTypedValue('');
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

    return {
        typedValue,
        setTypedValue,
        submitting,
        confirmMatch,
        handleOpenChange,
        handleDelete,
    };
}
