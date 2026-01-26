'use client';

import { Input } from '@/lib/components/ui/Input';

interface SettingsSectionProps {
    recommendedTimeMinutes: number;
    onRecommendedTimeChange: (minutes: number) => void;
}

export function SettingsSection({
    recommendedTimeMinutes,
    onRecommendedTimeChange,
}: SettingsSectionProps) {
    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
            <div>
                <h3 className="text-label-m text-foreground">Settings</h3>
                <p className="text-body-s mt-1 text-muted-foreground">
                    Configure additional options for this task.
                </p>
            </div>

            <div className="max-w-md">
                <div className="flex flex-col gap-2">
                    <label htmlFor="recommended-time" className="text-label-s text-foreground">
                        Recommended Time (minutes)
                    </label>
                    <Input
                        id="recommended-time"
                        type="number"
                        min={1}
                        max={180}
                        value={recommendedTimeMinutes}
                        onChange={(e) => onRecommendedTimeChange(Number(e.target.value) || 0)}
                        placeholder="e.g., 30"
                        className="w-32"
                    />
                    <p className="text-body-xs text-muted-foreground">
                        This helps candidates estimate how long the task should take.
                    </p>
                </div>
            </div>
        </div>
    );
}
