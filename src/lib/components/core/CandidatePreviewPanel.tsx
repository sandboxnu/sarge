'use client';

import Image from 'next/image';
import TaskDescriptionPreview from '@/lib/components/core/TaskDescriptionPreview';
import CodeEditorPreview from '@/lib/components/core/CodeEditorPreview';
import TestCasePreviewList from '@/lib/components/core/TestCasePreviewList';
import type { AssessmentSection } from '@/lib/types/assessment-section.types';
import GreyWinstonLogoMark from '@/../public/GreyWinstonLogoMark.svg';

interface CandidatePreviewPanelProps {
    selectedSection: AssessmentSection | null;
    onDeleteSection: () => void;
}

export default function CandidatePreviewPanel({
    selectedSection,
    onDeleteSection,
}: CandidatePreviewPanelProps) {
    if (!selectedSection || selectedSection.type !== 'task') {
        return (
            <div className="bg-card flex flex-1 flex-col items-center justify-center gap-4">
                <Image
                    src={GreyWinstonLogoMark}
                    alt="Winston mascot"
                    width={64}
                    height={64}
                    className="opacity-40"
                />
                <p className="text-body-m text-muted-foreground">
                    You currently have no sections in this assessment.
                </p>
            </div>
        );
    }

    const { taskTemplate } = selectedSection;

    return (
        <div className="bg-card flex flex-1 flex-col gap-2 pt-3 pr-5 pb-5 pl-4">
            <span className="text-body-xs text-muted-foreground">Candidate View</span>

            <div className="border-border bg-background flex min-h-0 flex-1 flex-col overflow-clip rounded-lg border shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]">
                <div className="flex min-h-0 flex-1">
                    <TaskDescriptionPreview
                        taskTemplate={taskTemplate}
                        onGoToTaskTemplate={() =>
                            window.open(`/crm/task-templates/${taskTemplate.id}/edit`, '_blank')
                        }
                        onDeleteSection={onDeleteSection}
                    />

                    <div className="border-border flex w-[60%] shrink-0 flex-col border-l">
                        <div className="flex flex-[3_0_0] flex-col overflow-hidden">
                            <CodeEditorPreview
                                languages={taskTemplate.languages}
                                taskTemplateId={taskTemplate.id}
                            />
                        </div>

                        <div className="flex flex-[2_0_0] flex-col overflow-hidden">
                            <TestCasePreviewList
                                publicTestCases={taskTemplate.publicTestCases}
                                privateTestCases={taskTemplate.privateTestCases}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
