'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn.utils';
import { Button } from '@/lib/components/ui/Button';
import ReviewTaskSubmission from '@/lib/components/reviewing/ReviewTaskSubmission';
import InstructionsTaskSubmission from '@/lib/components/reviewing/InstructionsTaskSubmission';
import TestCasesTaskSubmission from '@/lib/components/reviewing/TestCasesTaskSubmission';
import ActivityLogTaskSubmission from '@/lib/components/reviewing/ActivityLogTaskSubmission';
import type { TaskWithReviewData } from '@/lib/types/position.types';

const TABS = ['Submission', 'Instructions', 'Test Cases', 'Activity Log'];

type TaskReviewMainProps = {
    task: TaskWithReviewData | null;
};

export default function TaskReviewMain({ task }: TaskReviewMainProps) {
    const [activeTab, setActiveTab] = useState('Submission');

    return (
        <section className="flex min-w-0 flex-[7] flex-col gap-4 overflow-hidden pr-4">
            <div className="flex items-center gap-2">
                {TABS.map((tab) => (
                    <Button
                        key={tab}
                        type="button"
                        variant="icon"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'rounded-md px-2 py-1 text-xs font-medium',
                            activeTab === tab
                                ? 'bg-sarge-gray-100 text-sarge-gray-600'
                                : 'bg-transparent text-sarge-gray-500 hover:text-sarge-gray-600'
                        )}
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            {activeTab === 'Submission' && <ReviewTaskSubmission task={task} />}
            {activeTab === 'Instructions' && <InstructionsTaskSubmission task={task} />}
            {activeTab === 'Test Cases' && <TestCasesTaskSubmission task={task} />}
            {activeTab === 'Activity Log' && <ActivityLogTaskSubmission task={task} />}
        </section>
    );
}
