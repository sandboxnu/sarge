import { useState } from 'react';
import { createPositionAction } from '@/app/actions/position.actions';
import { toast } from 'sonner';

export function useCreatePositionModal(onOpenChange: (open: boolean) => void) {
    const [positionName, setPositionName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!positionName.trim()) {
            setLocalError('Position name is required');
            return;
        }

        setIsCreating(true);
        setLocalError(null);

        try {
            await createPositionAction(positionName);
            toast.success('Position created successfully.');
            setPositionName('');
            onOpenChange(false);
        } catch {
            const errorMsg = 'Failed to create position. Please try again.';
            setLocalError(errorMsg);
            toast.error('Creation failed', { description: errorMsg });
        } finally {
            setIsCreating(false);
        }
    };

    const handleCancel = () => {
        setPositionName('');
        setLocalError(null);
        onOpenChange(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPositionName(e.target.value);
        if (localError) setLocalError(null);
    };

    return {
        positionName,
        isCreating,
        localError,
        handleCreate,
        handleCancel,
        handleInputChange,
    };
}

export default useCreatePositionModal;
