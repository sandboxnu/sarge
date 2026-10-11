'use client';

import { useState } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { cn } from '@/lib/utils/cn.utils';
import ReviewTasksOnSidebar from '@/lib/components/reviewing/ReviewTasksOnSidebar';
import ReviewDecisionOnSidebar from '@/lib/components/reviewing/ReviewDecisionOnSidebar';
import type { TaskWithReviewData } from '@/lib/types/position.types';
import type { LineRange } from '@/lib/utils/comment.utils';

const TABS = ['Review Tasks', 'Decision'];

type TaskReviewSidebarProps = {
    task: TaskWithReviewData | null;
    currentTask: number;
    totalTasks: number;
    onPrev: () => void;
    onNext: () => void;
    onSelectTask: (index: number) => void;
    onAddComment: (content: string, lines?: LineRange) => Promise<void>;
};

export default function TaskReviewSidebar({
    task,
    currentTask,
    totalTasks,
    onPrev,
    onNext,
    onSelectTask,
    onAddComment,
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
                <ReviewTasksOnSidebar
                    task={task}
                    currentTask={currentTask}
                    totalTasks={totalTasks}
                    onPrev={onPrev}
                    onNext={onNext}
                    onSelectTask={onSelectTask}
                    onAddComment={onAddComment}
                />
            )}
            {activeTab === 'Decision' && <ReviewDecisionOnSidebar task={task} />}
        </div>
    );
}
