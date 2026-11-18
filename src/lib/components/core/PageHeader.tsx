'use client';

import { useState } from 'react';
import { sidebarMenuItems, SidebarTrigger } from '@/lib/components/core/Sidebar';
import FeedbackModal from '@/lib/components/modal/FeedbackModal';
import { Button } from '@/lib/components/ui/Button';
import { cn } from '@/lib/utils/cn.utils';
import { usePathname } from 'next/navigation';

/**
 * Title bar pinned above each tab's content. The title is derived from the
 * sidebar nav entry matching the current route, so it stays in sync with
 * `sidebarMenuItems`. Renders nothing on routes outside the main nav.
 */
export function PageHeader({ pageName, className }: { pageName?: string; className?: string }) {
    const pathname = usePathname();
    const [feedbackOpen, setFeedbackOpen] = useState(false);

    const activeItem = sidebarMenuItems
        .filter((item) => pathname === item.url || pathname.startsWith(`${item.url}/`))
        .sort((a, b) => b.url.length - a.url.length)[0];

    const title = pageName ?? activeItem?.title;

    if (!title) {
        return (
            <header
                className={cn(
                    'flex h-(--navbar-height) shrink-0 items-center px-5 md:hidden',
                    className
                )}
            >
                <SidebarTrigger variant="icon" />
            </header>
        );
    }

    return (
        <header
            className={cn(
                'flex h-(--navbar-height) shrink-0 items-center gap-2 border-b px-5',
                className
            )}
        >
            <SidebarTrigger variant="icon" className="md:hidden" />
            <h1 className="text-label-s">{title}</h1>
            <Button
                type="button"
                variant="link"
                onClick={() => setFeedbackOpen(true)}
                className="text-label-s ml-2 h-auto"
            >
                Submit Feedback
            </Button>
            <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
        </header>
    );
}
