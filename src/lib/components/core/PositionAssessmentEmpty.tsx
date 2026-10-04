'use client';

import { ChevronDown, FileText, Mail } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { cn } from '@/lib/utils/cn.utils';

type PositionAssessmentEmptyProps = {
    onSelectAssessment?: () => void;
    onSendAssessments: () => void;
    isSending: boolean;
    className?: string;
};

export function PositionAssessmentEmpty({
    onSelectAssessment,
    onSendAssessments,
    isSending,
    className,
}: PositionAssessmentEmptyProps) {
    return (
        <div
            className={cn(
                'border-sarge-gray-200 bg-sarge-gray-0',
                'flex w-full items-center justify-between rounded-lg border px-4 py-3',
                className
            )}
        >
            <div className="flex items-center gap-2">
                <FileText className="text-sarge-gray-600 size-5 shrink-0" />
                <span className="text-body-m">No assessment assigned</span>
            </div>
            <div className="flex items-center gap-3">
                {/* Need to replace with the assessment dropdown */}
                <Button variant="dropdown" onClick={onSelectAssessment}>
                    <ChevronDown className="size-4" />
                    <span className="text-label-s">Select Assessment</span>
                </Button>
                <Button className="px-4 py-3" onClick={onSendAssessments} disabled>
                    <Mail className="size-5" />
                    {isSending ? 'Sending...' : 'Send to all candidates'}
                </Button>
            </div>
        </div>
    );
}
