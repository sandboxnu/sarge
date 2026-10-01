'use client';

import { sidebarMenuItems } from '@/lib/components/core/Sidebar';
import { cn } from '@/lib/utils/cn.utils';
import { usePathname } from 'next/navigation';

/**
 * Title bar pinned above each tab's content. The title is derived from the
 * sidebar nav entry matching the current route, so it stays in sync with
 * `sidebarMenuItems`. Renders nothing on routes outside the main nav.
 */
export function PageHeader({ pageName, className }: { pageName?: string; className?: string }) {
    const pathname = usePathname();

    const activeItem = sidebarMenuItems
        .filter((item) => pathname === item.url || pathname.startsWith(`${item.url}/`))
        .sort((a, b) => b.url.length - a.url.length)[0];

    const title = pageName ?? activeItem?.title;

    if (!title) {
        return null;
    }

    return (
        <header
            className={cn(
                'flex h-(--navbar-height) shrink-0 items-center border-b px-5',
                className
            )}
        >
            <h1 className="text-label-s">{title}</h1>
        </header>
    );
}
