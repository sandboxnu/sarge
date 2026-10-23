'use client';

import { Check, ChevronDown, FileText, Mail } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { cn } from '@/lib/utils/cn.utils';

type PositionAssessmentProps = {
    onSelectAssessment?: () => void;
    onSendAssessments: () => void;
    isSending: boolean;
    assignedTitle?: string | null;
    hasSentAssessments?: boolean;
    allSent?: boolean;
    className?: string;
};

export function PositionAssessmentBox({
    onSelectAssessment,
    onSendAssessments,
    isSending,
    assignedTitle,
    hasSentAssessments = false,
    allSent = false,
    className,
}: PositionAssessmentProps) {
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
                <span className="text-body-m">{assignedTitle ?? 'No assessment assigned'}</span>
            </div>
            <div className="flex items-center gap-3">
                <Button
                    variant="dropdown"
                    onClick={onSelectAssessment}
                    disabled={hasSentAssessments}
                >
                    <ChevronDown className="size-4" />
                    <span className="text-label-s">Select Assessment</span>
                </Button>
                <Button
                    className="px-4 py-3"
                    onClick={onSendAssessments}
                    disabled={!assignedTitle || isSending || allSent}
                >
                    {allSent ? <Check className="size-5" /> : <Mail className="size-5" />}
                    {allSent
                        ? 'Sent to all candidates'
                        : isSending
                          ? 'Sending...'
                          : 'Send to all candidates'}
                </Button>
            </div>
        </div>
    );
}
