import { useState } from 'react';
import { toast } from 'sonner';
import { createPosition } from '@/lib/api/positions';
import { type PositionWithCounts } from '@/lib/types/position.types';

export default function useCreatePositionModal(
    onOpenChange: (open: boolean) => void,
    setActive: React.Dispatch<React.SetStateAction<PositionWithCounts[]>>
) {
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
            const newPosition = await createPosition(positionName);

            // In the future we may want to add the ability to create a position AND upload a CSV
            // of candidates at the same time. If that were the case, we'd want to create a new
            // route to create a position with the count fields included in the returned object
            const positionWithCounts: PositionWithCounts = {
                ...newPosition,
                numCandidates: 0,
                numAssigned: 0,
            };

            setActive((prev) => [...prev, positionWithCounts]);

            toast.success('Position created successfully.');
            setPositionName('');
            onOpenChange(false);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to create position. Please try again.';

            setLocalError(message);
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
