import { useState } from 'react';
import { type SendAssessmentModalProps } from '@/lib/components/modal/SendAssessmentModal';
import { endOfDayISO, todayLocalISODate } from '@/lib/utils/date.utils';

function useSendAssessmentModal({ onOpenChange, onConfirm }: SendAssessmentModalProps) {
    const [dueDate, setDueDate] = useState('');

    const handleConfirm = async () => {
        if (!dueDate) return;
        await onConfirm(endOfDayISO(dueDate));
        setDueDate('');
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) setDueDate('');
        onOpenChange(open);
    };

    const handleCancel = () => onOpenChange(false);

    return {
        dueDate,
        setDueDate,
        minDate: todayLocalISODate(),
        handleConfirm,
        handleOpenChange,
        handleCancel,
    };
}

export default useSendAssessmentModal;
