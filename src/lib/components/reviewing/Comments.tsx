'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';

export interface ReviewComment {
    id: string;
    author: string;
    body: string;
    lineRange?: string;
}

export interface CommentsProps {
    comments: ReviewComment[];
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: () => void;
    submitDisabled?: boolean;
}

export default function Comments({
    comments,
    value,
    onChange,
    onSubmit,
    submitDisabled,
}: CommentsProps) {
    return (
        <div className="flex w-full flex-col gap-3">
            <div className="border-sarge-gray-200 flex w-full flex-col gap-2 rounded-lg border p-4">
                <textarea
                    value={value ?? ''}
                    onChange={(event) => onChange?.(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                            event.preventDefault();
                            onSubmit?.();
                        }
                    }}
                    placeholder="Add a comment or note for this task"
                    rows={3}
                    className="text-body-xs text-sarge-gray-800 placeholder:text-sarge-gray-500 w-full resize-none outline-none"
                />
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        aria-label="Submit comment"
                        onClick={onSubmit}
                        disabled={submitDisabled}
                        className="size-9 shrink-0 p-0"
                    >
                        <ChevronRight className="size-5" />
                    </Button>
                </div>
            </div>

            {comments.length > 0 && (
                <div className="border-sarge-gray-200 flex w-full flex-col gap-4 rounded-lg border p-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex w-full flex-col gap-1">
                            <div className="flex w-full items-center justify-between gap-2">
                                <span className="text-sarge-gray-500 text-[10px] leading-4 font-medium">
                                    {comment.author}
                                </span>
                                {comment.lineRange && (
                                    <span className="bg-sarge-gray-100 text-sarge-gray-700 text-label-xs rounded-lg px-2 py-1">
                                        {comment.lineRange}
                                    </span>
                                )}
                            </div>
                            <p className="text-body-xs text-sarge-gray-800">{comment.body}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
