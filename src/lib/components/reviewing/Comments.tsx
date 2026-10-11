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
}

export default function Comments({ comments, value, onChange, onSubmit }: CommentsProps) {
    return (
        <div className="flex w-full flex-col gap-3">
            <div className="border-sarge-gray-200 flex w-full flex-col gap-2 rounded-lg border p-4">
                <textarea
                    value={value ?? ''}
                    onChange={(event) => onChange?.(event.target.value)}
                    placeholder="Add a comment or note for this task"
                    rows={3}
                    className="text-body-xs text-sarge-gray-800 placeholder:text-sarge-gray-500 w-full resize-none outline-none"
                />
                <Button
                    variant="secondary"
                    aria-label="Submit comment"
                    onClick={onSubmit}
                    className="size-9 self-end p-0"
                >
                    <ChevronRight className="size-5" />
                </Button>
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
