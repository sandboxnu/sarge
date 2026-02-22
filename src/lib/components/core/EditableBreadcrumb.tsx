'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';

export type BreadcrumbSegment = {
    label: string;
    href: string;
};

interface EditableBreadcrumbProps {
    segments: BreadcrumbSegment[];
    currentPage: string;
    onCurrentPageChange?: (value: string) => void;
    maxLength?: number;
}

export default function EditableBreadcrumb({
    segments,
    currentPage,
    onCurrentPageChange,
    maxLength = 100,
}: EditableBreadcrumbProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(currentPage);

    const isEditable = !!onCurrentPageChange;

    const startEditing = () => {
        if (!isEditable) return;
        setEditValue(currentPage);
        setIsEditing(true);
        requestAnimationFrame(() => inputRef.current?.select());
    };

    const commitEdit = () => {
        setIsEditing(false);
        const trimmed = editValue.trim();
        if (trimmed && trimmed !== currentPage) {
            onCurrentPageChange?.(trimmed);
        } else {
            setEditValue(currentPage);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditValue(currentPage);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitEdit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    };

    return (
        <div className="flex items-center gap-2">
            {segments.map((segment, index) => (
                <div key={segment.href} className="flex items-center gap-2">
                    <button
                        className="text-label-s text-sarge-gray-600 flex shrink-0 cursor-pointer items-center hover:underline"
                        onClick={() => router.push(segment.href)}
                    >
                        {index === 0 && <ChevronLeft className="size-5" />}
                        <span>{segment.label}</span>
                    </button>
                    <span className="text-label-s text-sarge-gray-600">/</span>
                </div>
            ))}

            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleKeyDown}
                    maxLength={maxLength}
                    className={cn(
                        'text-display-xs',
                        'border-sarge-primary-300 bg-transparent outline-none',
                        'rounded-md border px-1 py-0.5',
                        '-ml-1'
                    )}
                    autoFocus
                />
            ) : (
                <h1
                    className={cn(
                        'text-display-xs truncate',
                        isEditable &&
                            'hover:bg-sarge-gray-100 -ml-1 cursor-text rounded-md px-2 py-1 transition-colors'
                    )}
                    onClick={startEditing}
                    title={isEditable ? 'Click to edit' : undefined}
                >
                    {currentPage}
                </h1>
            )}
        </div>
    );
}
