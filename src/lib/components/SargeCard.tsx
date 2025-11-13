'use client';
import { FileText, MoreVertical } from 'lucide-react';

type SargeCardProps = {
    title: string;
    candidateCount: number;
    assessmentName: string;
    assignedCount?: number;
    submittedCount?: number;
    totalAssigned?: number;
    className?: string;
};

export default function SargeCard({
    title,
    candidateCount,
    assessmentName,
    assignedCount = 0,
    submittedCount = 0,
    totalAssigned = 0,
    className = '',
}: SargeCardProps) {
    const submissionVariant = getSubmissionVariant(submittedCount, totalAssigned);
    return (
        <div
            role="region"
            aria-label={`${title} card`}
            className={`min-h-[160px] w-full max-w-[367px] min-w-[367px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--card-foreground)] shadow-sm ${className} `}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-1 px-1">
                    <h3
                        className="font-sans text-[14px] leading-[18px] font-medium tracking-[0.406px] text-[var(--sarge-gray-800)]"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                        title={title}
                    >
                        {title}
                    </h3>

                    <p className="font-sans text-[14px] leading-[18px] font-normal tracking-[0.406px] text-[var(--sarge-gray-600)]">
                        {candidateCount} {candidateCount === 1 ? 'candidate' : 'candidates'}
                    </p>
                </div>

                <div
                    aria-hidden
                    className="grid h-8 w-8 place-items-center text-[var(--sarge-gray-800)]"
                >
                    <MoreVertical className="h-5 w-5" />
                </div>
            </div>
            <div className="mt-4 w-full rounded-[8px] border border-[var(--sarge-gray-200)] bg-[var(--sarge-gray-0)] p-3">
                <div className="flex flex-col items-start gap-[10px]">
                    <div className="flex w-full min-w-0 items-start gap-3">
                        <FileText
                            className="h-5 w-5 shrink-0 text-[var(--sarge-gray-600)]"
                            aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                            <div
                                className="overflow-hidden font-sans text-[14px] leading-[18px] font-medium tracking-[0.406px] text-ellipsis whitespace-nowrap text-[var(--sarge-gray-800)]"
                                title={assessmentName}
                            >
                                {assessmentName}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Chip variant="neutral">{assignedCount} assigned</Chip>
                        <Chip variant={submissionVariant}>
                            {submittedCount}/{totalAssigned} submissions
                        </Chip>
                    </div>
                </div>
            </div>
        </div>
    );
}

type ChipVariant = 'neutral' | 'error' | 'warning' | 'success';

function getSubmissionVariant(submitted: number, total: number): ChipVariant {
    if (total <= 0 || submitted <= 0) return 'neutral';
    const r = submitted / total;
    if (r <= 1 / 3) return 'error';
    if (r <= 2 / 3) return 'warning';
    return 'success';
}

function Chip({
    children,
    variant = 'neutral',
}: {
    children: React.ReactNode;
    variant?: ChipVariant;
}) {
    const base =
        'inline-flex items-center px-2 py-1 rounded-[6px] text-[12px] leading-[16px] font-medium tracking-[0.406px]';
    const styles =
        variant === 'neutral'
            ? 'bg-[var(--sarge-gray-200)] text-[var(--sarge-gray-600)]'
            : variant === 'error'
              ? 'bg-[var(--sarge-error-200)] text-[var(--sarge-error-700)]'
              : variant === 'warning'
                ? 'bg-[var(--sarge-warning-100)] text-[var(--sarge-warning-700)]'
                : 'bg-[var(--sarge-success-100)] text-[var(--sarge-success-800)]';

    return <span className={`${base} ${styles}`}>{children}</span>;
}
