'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';

export interface ReviewerActionsProps {
    title: string;
    count?: number;
    defaultCollapsed?: boolean;
    onPrev?: () => void;
    onNext?: () => void;
    children: ReactNode;
}

export default function ReviewerActions({
    title,
    count,
    defaultCollapsed = false,
    onPrev,
    onNext,
    children,
}: ReviewerActionsProps) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const hasNav = Boolean(onPrev ?? onNext);

    return (
        <section className="border-sarge-gray-200 bg-sarge-gray-0 flex w-full flex-col items-start border-b">
            <div className="flex h-16 w-full items-center justify-between gap-3 px-5">
                <button
                    type="button"
                    onClick={() => setCollapsed((prev) => !prev)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                    <span className="text-label-s text-sarge-gray-800 truncate font-bold">
                        {title}
                    </span>
                    {count !== undefined && (
                        <span className="bg-sarge-gray-100 text-sarge-gray-600 text-label-xs rounded-lg px-2 py-1">
                            {count}
                        </span>
                    )}
                </button>

                {hasNav ? (
                    <div className="flex shrink-0 items-center gap-2">
                        <Button
                            variant="secondary"
                            aria-label="Previous task"
                            onClick={onPrev}
                            className="size-9 p-0"
                        >
                            <ChevronLeft className="size-5" />
                        </Button>
                        <Button
                            variant="secondary"
                            aria-label="Next task"
                            onClick={onNext}
                            className="size-9 p-0"
                        >
                            <ChevronRight className="size-5" />
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        aria-label={collapsed ? `Expand ${title}` : `Collapse ${title}`}
                        onClick={() => setCollapsed((prev) => !prev)}
                        className="text-sarge-gray-600 shrink-0"
                    >
                        {collapsed ? (
                            <ChevronDown className="size-5" />
                        ) : (
                            <ChevronUp className="size-5" />
                        )}
                    </button>
                )}
            </div>

            {!collapsed && <div className="w-full px-5 pb-5">{children}</div>}
        </section>
    );
}
