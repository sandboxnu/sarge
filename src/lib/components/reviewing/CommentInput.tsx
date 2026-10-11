'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/lib/components/ui/Button';
import { RemovableChip } from '@/lib/components/ui/RemovableChip';
import { cn } from '@/lib/utils/cn.utils';
import { formatLineRange, type LineRange } from '@/lib/utils/comment.utils';

type CommentInputProps = {
    placeholder: string;
    lines?: LineRange | null;
    onClearLines?: () => void;
    onSubmit: (content: string) => Promise<void>;
    label?: string;
    className?: string;
    style?: React.CSSProperties;
};

export default function CommentInput({
    placeholder,
    lines,
    onClearLines,
    onSubmit,
    label,
    className,
    style,
}: CommentInputProps) {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function submit() {
        if (!content.trim() || submitting) return;
        setSubmitting(true);
        try {
            await onSubmit(content.trim());
            setContent('');
        } catch (err) {
            toast.error((err as Error).message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            className={cn(
                'border-sarge-gray-200 bg-background flex flex-col gap-3 rounded-lg border p-4',
                className
            )}
            style={style}
        >
            {label && <span className="text-sarge-gray-500 text-xs">{label}</span>}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        submit();
                    }
                }}
                placeholder={placeholder}
                aria-label={label ?? placeholder}
                rows={2}
                className="text-sarge-gray-800 placeholder:text-sarge-gray-500 resize-none bg-transparent text-sm outline-none"
            />
            <div className="flex items-center justify-between">
                {lines && onClearLines ? (
                    <RemovableChip label={formatLineRange(lines)} onRemove={onClearLines} />
                ) : (
                    <span />
                )}
                <Button
                    variant="icon"
                    className="border-sarge-gray-200 rounded-md border border-solid"
                    aria-label="Add comment"
                    disabled={!content.trim() || submitting}
                    onClick={submit}
                >
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}
