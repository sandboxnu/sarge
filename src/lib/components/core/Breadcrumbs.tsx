'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';

export type BreadcrumbSegment = {
    label: string;
    href: string;
};

interface BreadcrumbsProps {
    segments: BreadcrumbSegment[];
    currentPage: string;
    editable?: boolean;
    onCurrentPageChange?: (value: string) => void;
    maxLength?: number;
}

export default function Breadcrumbs({
    segments,
    currentPage,
    editable = false,
    onCurrentPageChange,
    maxLength = 100,
}: BreadcrumbsProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(currentPage);

    const isEditable = editable && !!onCurrentPageChange;

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
        <div className="flex min-w-0 items-center gap-2">
            {segments.map((segment, index) => (
                <div key={segment.href} className="flex shrink-0 items-center gap-2">
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
                        'text-display-xs max-w-[500px]',
                        'border-sarge-primary-300 bg-transparent outline-none',
                        'rounded-md border px-1 py-0.5',
                        '-ml-1'
                    )}
                    autoFocus
                />
            ) : (
                <div
                    className={cn(
                        'group flex min-w-0 max-w-[500px] items-center gap-1.5',
                        isEditable &&
                        'hover:bg-sarge-gray-50 -ml-1 cursor-text rounded-md border border-transparent px-2 py-1 transition-all hover:border-sarge-gray-200'
                    )}
                    onClick={startEditing}
                    title={isEditable ? 'Click to edit' : "Untitled"}
                >
                    <h1 className="text-display-xs min-w-0 truncate">{currentPage}</h1>
                    {isEditable && (
                        <Pencil className="size-3.5 shrink-0 text-sarge-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                </div>
            )}
        </div>
    );
}
