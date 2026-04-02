import { CircleCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';
import type { SectionStatus } from '@/lib/types/candidate-assessment.types';

type AssessmentSidebarQuestionProps = {
    index: number;
    status: SectionStatus;
    type?: 'task' | 'text';
};

export default function AssessmentSidebarQuestion({
    index,
    status,
    type = 'task',
}: AssessmentSidebarQuestionProps) {
    const isCompleted = status === 'completed';
    const isCurrent = status === 'current';
    const isLocked = status === 'locked' || type === 'text';

    return (
        <div
            className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-xl transition-[box-shadow,transform] duration-200',
                isCompleted && 'bg-sarge-primary-100 text-sarge-primary-500 shadow-none',
                isCurrent && 'bg-sarge-primary-500 text-primary-foreground shadow-md',
                isLocked &&
                    'border-sarge-gray-100 bg-sarge-gray-50 text-sarge-gray-300 border shadow-none'
            )}
        >
            {isCompleted && <CircleCheck className="size-5 shrink-0" aria-hidden />}
            {isCurrent && (
                <span className="text-sm leading-none font-semibold tabular-nums">{index + 1}</span>
            )}
            {isLocked && <Lock className="size-4 shrink-0" aria-hidden />}
        </div>
    );
}
