'use client';

import { useState, useEffect } from 'react';

import type { TaskWithReviewData } from '@/lib/types/position.types';
import { TestVisibility } from '@/generated/prisma';

import ReviewerActions from '@/lib/components/reviewing/ReviewerActions';
import TaskInfo from '@/lib/components/reviewing/TaskInfo';
import InstructionsContent from '@/lib/components/reviewing/InstructionsContent';
import Comments from '@/lib/components/reviewing/Comments';
import ReviewerSummary from '@/lib/components/reviewing/ReviewerSummary';
import { BlockNoteViewer } from '@/lib/components/core/BlockNoteViewer';
import type { BlockNoteContent } from '@/lib/types/task-template.types';
import { formatLineRange } from '@/lib/utils/comment.utils';

type TaskReviewSidebarProps = {
    task: TaskWithReviewData | null;

    onPrev: () => void;
    onNext: () => void;
    commentText: string;
    onCommentChange: (value: string) => void;
    onSubmitComment: () => void;
    submitDisabled: boolean;
};

export default function TaskReviewSidebar({
    task,
    onPrev,
    onNext,
    commentText,
    onCommentChange,
    onSubmitComment,
    submitDisabled,
}: TaskReviewSidebarProps) {
    const testResults = task?.testResults ?? [];
    const initialScore = String(task?.reviews[0]?.score ?? '');
    const [score, setScore] = useState(initialScore);
    useEffect(() => setScore(initialScore), [initialScore]);
    const publicResults = testResults.filter((r) => r.visibility === TestVisibility.PUBLIC);
    const privateResults = testResults.filter((r) => r.visibility === TestVisibility.PRIVATE);
    const publicPassed = publicResults.filter((r) => r.passed).length;
    const privatePassed = privateResults.filter((r) => r.passed).length;
    const comments = (task?.reviews ?? [])
        .flatMap((review) =>
            review.comments.map((comment) => ({
                id: comment.id,
                author: review.reviewer.name,
                body: comment.content,
                reviewedAt: comment.reviewedAt,
                lineRange:
                    comment.startLine !== null && comment.endLine !== null
                        ? formatLineRange({
                              startLine: comment.startLine,
                              endLine: comment.endLine,
                          })
                        : undefined,
            }))
        )
        .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());

    return (
        <div className="ml-4 flex min-h-0 basis-[30%] flex-col overflow-y-auto">
            <ReviewerActions
                title={task?.taskTemplate.title ?? 'Task'}
                onPrev={onPrev}
                onNext={onNext}
            >
                <TaskInfo
                    publicTestCases={`${publicPassed}/${publicResults.length} passed`}
                    privateTestCases={`${privatePassed}/${privateResults.length} passed`}
                    score={score}
                    onScoreChange={setScore}
                />
            </ReviewerActions>
            <ReviewerActions title="Instructions">
                <InstructionsContent>
                    {task && (
                        <BlockNoteViewer
                            content={task.taskTemplate.description as BlockNoteContent}
                        />
                    )}
                </InstructionsContent>
            </ReviewerActions>

            <ReviewerActions title="Comments" count={comments.length}>
                <Comments
                    comments={comments}
                    value={commentText}
                    onChange={onCommentChange}
                    onSubmit={onSubmitComment}
                    submitDisabled={submitDisabled}
                />
            </ReviewerActions>

            <ReviewerActions title="Reviewer Summary">
                <ReviewerSummary decision="Pending" reviewers={[]} />
            </ReviewerActions>
        </div>
    );
}
