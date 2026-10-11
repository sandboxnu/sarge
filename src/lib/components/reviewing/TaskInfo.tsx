'use client';

import StatusBox from '@/lib/components/reviewing/StatusBox';

export interface TaskInfoProps {
    publicTestCases: string;
    privateTestCases: string;
    score?: string;
    onScoreChange?: (value: string) => void;
}

export default function TaskInfo({
    publicTestCases,
    privateTestCases,
    score,
    onScoreChange,
}: TaskInfoProps) {
    return (
        <div className="flex w-full flex-col gap-3">
            <div className="flex w-full gap-3">
                <StatusBox label="Public Test Cases" status={publicTestCases} variant="success" />
                <StatusBox label="Private Test Cases" status={privateTestCases} variant="warning" />
            </div>

            <div className="flex w-full items-center justify-between">
                <span className="text-label-xs text-sarge-gray-500">Score</span>
                <input
                    type="text"
                    value={score ?? ''}
                    onChange={(event) => onScoreChange?.(event.target.value)}
                    placeholder="00"
                    className="border-sarge-gray-200 text-label-s text-sarge-gray-800 placeholder:text-sarge-gray-500 w-20 rounded-lg border px-3 py-2"
                />
            </div>
        </div>
    );
}
