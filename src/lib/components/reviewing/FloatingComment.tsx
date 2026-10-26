'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { RemovableChip } from '@/lib/components/ui/RemovableChip';
import { formatLineRange, type LineRange } from '@/lib/utils/comment.utils';

export interface FloatingCommentProps {
    selectedLines: LineRange;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onClearLines: () => void;
    submitDisabled?: boolean;
    style?: React.CSSProperties;
}

export default function FloatingComment({
    selectedLines,
    value,
    onChange,
    onSubmit,
    onClearLines,
    submitDisabled,
    style,
}: FloatingCommentProps) {
    return (
        <div
            style={style}
            className="border-sarge-gray-200 bg-sarge-gray-0 absolute z-10 flex w-[313px] flex-col rounded-lg border"
        >
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                        event.preventDefault();
                        onSubmit();
                    }
                }}
                placeholder="Type to enter a comment"
                rows={3}
                className="text-body-xs text-sarge-gray-800 placeholder:text-sarge-gray-500 w-full resize-none p-4 outline-none"
            />
            <div className="flex items-end justify-between px-3 pt-px pb-3">
                <RemovableChip label={formatLineRange(selectedLines)} onRemove={onClearLines} />
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
    );
}
