'use client';

import { Button } from '@/lib/components/ui/Button';
import { cn } from '@/lib/utils/cn.utils';
import StatusBox from '@/lib/components/reviewing/StatusBox';

type DecisionVariant = 'accept' | 'reject' | 'pending';

export interface ReviewerSummaryProps {
    decision: string;
    decisionVariant?: DecisionVariant;
    reviewers: { name: string; status: string; variant?: 'success' | 'warning' | 'neutral' }[];
    onViewSummary?: () => void;
}

const DECISION_STYLES: Record<DecisionVariant, string> = {
    accept: 'bg-sarge-success-100 text-sarge-success-800',
    reject: 'bg-sarge-error-200 text-sarge-error-700',
    pending: 'bg-sarge-gray-100 text-sarge-gray-700',
};

export default function ReviewerSummary({
    decision,
    decisionVariant = 'pending',
    reviewers,
    onViewSummary,
}: ReviewerSummaryProps) {
    return (
        <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center justify-between">
                <span className="text-label-xs text-sarge-gray-500">Your Decision</span>
                <div className="border-sarge-gray-200 flex h-9 w-28 items-center justify-center rounded-lg border">
                    <span
                        className={cn(
                            'text-label-xs rounded-lg px-2 py-1',
                            DECISION_STYLES[decisionVariant]
                        )}
                    >
                        {decision}
                    </span>
                </div>
            </div>

            <div className="flex w-full gap-3">
                {reviewers.map((reviewer) => (
                    <StatusBox
                        key={reviewer.name}
                        label={reviewer.name}
                        status={reviewer.status}
                        variant={reviewer.variant}
                    />
                ))}
            </div>

            <Button variant="secondary" className="h-10 w-full" onClick={onViewSummary}>
                View Summary
            </Button>
        </div>
    );
}
