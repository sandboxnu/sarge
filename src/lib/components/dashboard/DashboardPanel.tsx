import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn.utils';

/**
 * Card shell shared by every panel on the Home dashboard.
 * Figma uses #FBFBFB (no token); gray-50 is what LiveAssessmentCard uses for the same Figma fill.
 */
export function DashboardPanel({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <section
            className={cn(
                'border-sarge-gray-200 bg-sarge-gray-50 flex flex-col gap-4 overflow-clip rounded-md border p-4',
                className
            )}
        >
            {children}
        </section>
    );
}

/**
 * Panel title row with an optional right-aligned slot (e.g. a "+ New" action or a count)
 * and an optional subtitle underneath.
 */
export function DashboardPanelHeader({
    title,
    subtitle,
    trailing,
    className,
}: {
    title: string;
    subtitle?: string;
    trailing?: ReactNode;
    className?: string;
}) {
    return (
        <header className={cn('flex w-full flex-col gap-1', className)}>
            <div className="flex w-full items-center gap-4">
                <h2 className="text-label-s text-sarge-gray-900 min-w-0 flex-1">{title}</h2>
                {trailing}
            </div>
            {subtitle && <p className="text-body-xs text-sarge-gray-500">{subtitle}</p>}
        </header>
    );
}
