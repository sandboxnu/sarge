import { AlarmClock } from 'lucide-react';
import QuestionIndicator from '@/lib/components/assessment-flow/QuestionIndicator';
import type { SectionState } from '@/lib/hooks/useAssessment';

type AssessmentFlowSidebarProps = {
    sections: SectionState[];
    currentSectionIndex: number;
    formattedTime: string;
};

export default function AssessmentFlowSidebar({
    sections,
    formattedTime,
}: AssessmentFlowSidebarProps) {
    return (
        <aside className="border-sarge-gray-200 bg-background flex w-18 flex-shrink-0 flex-col items-center gap-4 border-r py-4">
            <div className="flex flex-col items-center gap-1">
                <AlarmClock className="text-sarge-gray-500 size-5" />
                <span className="text-sarge-gray-700 font-mono text-xs tracking-tight tabular-nums">
                    {formattedTime}
                </span>
            </div>
            <div className="flex flex-col items-center gap-3">
                {sections.map((section, i) => (
                    <QuestionIndicator
                        key={section.taskTemplateId}
                        index={i}
                        status={section.status}
                        type="task"
                    />
                ))}
            </div>
        </aside>
    );
}
