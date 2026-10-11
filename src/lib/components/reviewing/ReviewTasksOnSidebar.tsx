'use client';

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
import { Button } from '@/lib/components/ui/Button';
import { TestVisibility } from '@/generated/prisma';
import type { TaskWithReviewData } from '@/lib/types/position.types';
import CommentInput from '@/lib/components/reviewing/CommentInput';
import { formatLineRange, type LineRange } from '@/lib/utils/comment.utils';

type ReviewTasksOnSidebarProps = {
    task: TaskWithReviewData | null;
    currentTask: number;
    totalTasks: number;
    onPrev: () => void;
    onNext: () => void;
    onSelectTask: (index: number) => void;
    onAddComment: (content: string, lines?: LineRange) => Promise<void>;
};

export default function ReviewTasksOnSidebar({
    task,
    currentTask,
    totalTasks,
    onPrev,
    onNext,
    onSelectTask,
    onAddComment,
}: ReviewTasksOnSidebarProps) {
    const testResults = task?.testResults ?? [];
    const publicResults = testResults.filter((r) => r.visibility === TestVisibility.PUBLIC);
    const privateResults = testResults.filter((r) => r.visibility === TestVisibility.PRIVATE);
    const publicPassed = publicResults.filter((r) => r.passed).length;
    const privatePassed = privateResults.filter((r) => r.passed).length;
    const comments = (
        task?.reviews.flatMap((review) =>
            review.comments.map((comment) => ({ ...comment, reviewerName: review.reviewer.name }))
        ) ?? []
    ).sort((a, b) => new Date(a.reviewedAt).getTime() - new Date(b.reviewedAt).getTime());
    const score = task?.reviews[0]?.score;

    return (
        <div className="mt-5 flex min-h-0 flex-1 flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <span className="text-sarge-gray-500 text-xs font-medium">Task</span>
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

            <div className="grid grid-cols-2 gap-3">
                <div className="border-sarge-gray-200 bg-sarge-gray-50 flex flex-col gap-2 rounded-lg border p-3">
                    <span className="text-sarge-gray-500 text-xs font-medium">
                        Public Test Cases
                    </span>
                    <Chip variant="success" className="w-fit">
                        {publicPassed}/{publicResults.length} passed
                    </Chip>
                </div>
                <div className="border-sarge-gray-200 bg-sarge-gray-50 flex flex-col gap-2 rounded-lg border p-3">
                    <span className="text-sarge-gray-500 text-xs font-medium">
                        Private Test Cases
                    </span>
                    <Chip variant="warning" className="w-fit">
                        {privatePassed}/{privateResults.length} passed
                    </Chip>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <span className="text-sarge-gray-500 text-xs font-medium">Score</span>
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

            <div className="flex min-h-0 flex-1 flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-sarge-gray-800 text-sm font-medium">Comments</span>
                    <Chip variant="neutral" className="rounded-md">
                        {comments.length}
                    </Chip>
                </div>
                <CommentInput
                    key={task?.id}
                    placeholder="Add a comment or note for this task"
                    onSubmit={(content) => onAddComment(content)}
                />
                {comments.length > 0 && (
                    <div className="border-sarge-gray-200 flex min-h-0 flex-col gap-4 overflow-y-auto rounded-lg border p-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sarge-gray-500 text-xs">
                                        {comment.reviewerName}
                                    </span>
                                    {comment.startLine !== null && comment.endLine !== null && (
                                        <Chip variant="neutral" className="rounded-md">
                                            {formatLineRange({
                                                startLine: comment.startLine,
                                                endLine: comment.endLine,
                                            })}
                                        </Chip>
                                    )}
                                </div>
                                <p className="text-sarge-gray-800 text-sm whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
