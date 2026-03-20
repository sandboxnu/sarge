import * as React from 'react';
import { Input } from '@/lib/components/ui/Input';

export interface SettingsTabProps {
    timeout: number;
    setTimeout: React.Dispatch<React.SetStateAction<number>>;
    estimatedTime: number;
    setEstimatedTime: React.Dispatch<React.SetStateAction<number>>;
    isSaving: boolean;
}

export default function SettingsTab({
    timeout,
    setTimeout,
    estimatedTime,
    setEstimatedTime,
    isSaving,
}: SettingsTabProps) {
    const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isSaving) return;
        setTimeout(Number(e.target.value) || 0);
    };

    const handleEstimatedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isSaving) return;
        setEstimatedTime(Number(e.target.value) || 0);
    };

    return (
        <div className="flex h-full flex-col gap-5">
            <div className="flex flex-col gap-2.5">
                <span className="text-label-s text-sarge-gray-800">Max Test Runtime (milliseconds)</span>
                <Input
                    type="number"
                    min="0"
                    value={timeout}
                    onChange={handleTimeLimitChange}
                    disabled={isSaving}
                />
            </div>
            <div className="flex flex-col gap-2.5">
                <span className="text-label-s text-sarge-gray-800">Estimated Time (minutes)</span>
                <Input
                    type="number"
                    min="0"
                    value={estimatedTime}
                    onChange={handleEstimatedTimeChange}
                    disabled={isSaving}
                />
            </div>
        </div>
    );
}
