'use client';

import { useState } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { cn } from '@/lib/utils/cn.utils';
import ReviewTasks from '@/lib/components/reviewing/ReviewTasks';
import ReviewDecision from '@/lib/components/reviewing/ReviewDecision';
import type { TaskWithReviewData } from '@/lib/types/position.types';

const TABS = ['Review Tasks', 'Decision'];

type TaskReviewSidebarProps = {
    task: TaskWithReviewData | null;
    currentTask: number;
    totalTasks: number;
    onPrev: () => void;
    onNext: () => void;
    onSelectTask: (index: number) => void;
};

export default function TaskReviewSidebar({
    task,
    currentTask,
    totalTasks,
    onPrev,
    onNext,
    onSelectTask,
}: TaskReviewSidebarProps) {
    const [activeTab, setActiveTab] = useState('Review Tasks');

    return (
        <div className="ml-4 flex min-h-0 basis-[30%] flex-col">
            <div className="flex items-center gap-2">
                {TABS.map((tab) => (
                    <Button
                        key={tab}
                        variant="icon"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'rounded-md px-2 py-1 text-xs font-medium',
                            activeTab === tab
                                ? 'bg-sarge-gray-100 text-sarge-gray-600'
                                : 'text-sarge-gray-500 hover:text-sarge-gray-600 bg-transparent'
                        )}
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            {activeTab === 'Review Tasks' && (
                <ReviewTasks
                    task={task}
                    currentTask={currentTask}
                    totalTasks={totalTasks}
                    onPrev={onPrev}
                    onNext={onNext}
                    onSelectTask={onSelectTask}
                />
            )}
            {activeTab === 'Decision' && <ReviewDecision task={task} />}
        </div>
    );
}
