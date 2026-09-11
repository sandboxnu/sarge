'use client';

import { useMemo, useState } from 'react';
import type { MemberWithUser } from '@/lib/types/member.types';

type UseTransferOwnershipModalArgs = {
    eligibleMembers: MemberWithUser[];
    onOpenChange: (open: boolean) => void;
    onConfirm: (targetMemberId: string) => Promise<boolean>;
    onSuccess: () => void;
};

export default function useTransferOwnershipModal({
    eligibleMembers,
    onOpenChange,
    onConfirm,
    onSuccess,
}: UseTransferOwnershipModalArgs) {
    const [selectedMemberId, setSelectedMemberId] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    const options = useMemo(
        () => eligibleMembers.map((m) => ({ value: m.id, label: m.user.name || m.user.email })),
        [eligibleMembers]
    );

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setSelectedMemberId('');
        }
        onOpenChange(nextOpen);
    };

    const handleTransfer = async () => {
        if (!selectedMemberId || submitting) return;
        setSubmitting(true);
        try {
            const ok = await onConfirm(selectedMemberId);
            if (ok) {
                onSuccess();
                onOpenChange(false);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return {
        selectedMemberId,
        setSelectedMemberId,
        submitting,
        options,
        handleOpenChange,
        handleTransfer,
    };
}
