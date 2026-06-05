'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/lib/components/ui/Select';
import { Input } from '@/lib/components/ui/Input';
import { Chip } from '@/lib/components/ui/Chip';
import { RemovableChip } from '@/lib/components/ui/RemovableChip';
import { Button } from '@/lib/components/ui/Button';
import { cn } from '@/lib/utils/cn.utils';
import { TestVisibility } from '@/generated/prisma';
import type { TaskWithReviewData } from '@/lib/types/position.types';

const TABS = ['Review Tasks', 'Decision'] as const;
type Tab = (typeof TABS)[number];

type TaskReviewSidebarProps = {
    task: TaskWithReviewData | null;
    currentTask: number;
    totalTasks: number;
    onPrev: () => void;
    onNext: () => void;
    onSelectTask: (index: number) => void;
};

function Label({ children }: { children: React.ReactNode }) {
    return <span className="text-sarge-gray-500 text-xs font-medium">{children}</span>;
}

export default function TaskReviewSidebar({
    task,
    currentTask,
    totalTasks,
    onPrev,
    onNext,
    onSelectTask,
}: TaskReviewSidebarProps) {
    const [activeTab, setActiveTab] = useState<Tab>('Review Tasks');

    const testResults = task?.testResults ?? [];
    const publicResults = testResults.filter((r) => r.visibility === TestVisibility.PUBLIC);
    const privateResults = testResults.filter((r) => r.visibility === TestVisibility.PRIVATE);
    const publicPassed = publicResults.filter((r) => r.passed).length;
    const publicTotal = publicResults.length;
    const privatePassed = privateResults.filter((r) => r.passed).length;
    const privateTotal = privateResults.length;
    const comments = task?.reviews.flatMap((review) => review.comments) ?? [];
    const score = task?.reviews[0]?.score;

    return (
        <section className="flex min-h-0 flex-[3] flex-col ml-4">
            {/* tabs */}
            <div className="flex items-center gap-2">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'text-xs font-medium transition-colors',
                            activeTab === tab
                                ? 'bg-sarge-gray-100 text-sarge-gray-600 rounded-md px-2 py-1'
                                : 'text-sarge-gray-500 hover:text-sarge-gray-600 px-2 py-1'
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Decision' ? (
                <div className="text-sarge-gray-500 flex flex-1 items-center justify-center text-sm">
                    {/* TODO: Decision panel */}
                    TODO
                </div>
            ) : (
                <div className="mt-5 flex min-h-0 flex-1 flex-col gap-5">
                    {/* task selector + prev/next */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Task</Label>
                        <div className="flex items-stretch gap-2">
                            <Select
                                value={String(currentTask)}
                                onValueChange={(value) => onSelectTask(Number(value))}
                            >
                                <SelectTrigger className="h-11 flex-1">
                                    <SelectValue placeholder="Task" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: totalTasks }).map((_, index) => (
                                        <SelectItem key={index} value={String(index)}>
                                            Task {index + 1}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="border-sarge-gray-200 flex items-center rounded-lg border">
                                <button
                                    type="button"
                                    aria-label="Previous task"
                                    onClick={onPrev}
                                    className="text-sarge-gray-600 hover:bg-sarge-gray-100 flex h-full items-center rounded-l-lg px-2"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                <div className="bg-sarge-gray-200 h-5 w-px" />
                                <button
                                    type="button"
                                    aria-label="Next task"
                                    onClick={onNext}
                                    className="text-sarge-gray-600 hover:bg-sarge-gray-100 flex h-full items-center rounded-r-lg px-2"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* public / private test cases */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="border-sarge-gray-200 bg-sarge-gray-50 flex flex-col gap-2 rounded-lg border p-3">
                            <Label>Public Test Cases</Label>
                            <Chip variant="success" className="w-fit">
                                {publicPassed}/{publicTotal} passed
                            </Chip>
                        </div>
                        <div className="border-sarge-gray-200 bg-sarge-gray-50 flex flex-col gap-2 rounded-lg border p-3">
                            <Label>Private Test Cases</Label>
                            <Chip variant="warning" className="w-fit">
                                {privatePassed}/{privateTotal} passed
                            </Chip>
                        </div>
                    </div>

                    {/* score (UI only for now) */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Score</Label>
                        <div className="flex items-stretch gap-2">
                            <Input
                                key={task?.id}
                                className="flex-1"
                                defaultValue={score ?? ''}
                                placeholder="Score"
                            />
                            <Button type="button" className="px-4 py-2">
                                Submit
                            </Button>
                        </div>
                    </div>

                    {/* existing comments */}
                    <div className="flex min-h-0 flex-1 flex-col gap-1.5">
                        <Label>Comments</Label>
                        <div className="border-sarge-gray-200 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-lg border p-4">
                            {comments.length === 0 ? (
                                <span className="text-sarge-gray-400 text-sm">No comments yet</span>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex flex-col gap-1.5">
                                        <p className="text-sarge-gray-800 text-sm">
                                            {comment.content}
                                        </p>
                                        <Chip className="w-fit">Line {comment.line}</Chip>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* add a comment (UI only for now) */}
                    <div className="border-sarge-gray-200 flex flex-col gap-3 rounded-lg border p-3">
                        <textarea
                            placeholder="Add a comment or note"
                            rows={2}
                            className="text-sarge-gray-800 placeholder:text-sarge-gray-500 resize-none text-sm outline-none"
                        />
                        <div className="flex items-center justify-between">
                            {/* TODO: line range comes from the editor selection once wired */}
                            <RemovableChip label="Lines 3-4" onRemove={() => {}} />
                            <Button variant="icon" aria-label="Add comment">
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
