'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { LiveAssessmentsPanel } from '@/lib/components/dashboard/LiveAssessmentsPanel';
import { ReadyForReviewPanel } from '@/lib/components/dashboard/ReadyForReviewPanel';
import { RecentPositionsPanel } from '@/lib/components/dashboard/RecentPositionsPanel';
import { RecentTasksPanel } from '@/lib/components/dashboard/RecentTasksPanel';

/** Home page body: welcome line, then the four dashboard panels in Figma's 2 + 2 layout. */
export function DashboardOverview() {
    const { user } = useAuth();
    const firstName = user?.name?.trim().split(/\s+/)[0];

    return (
        <div className="flex h-full flex-col gap-4 p-5">
            <div className="px-1 py-2">
                <p className="text-label-s text-black">
                    {firstName ? `Welcome Back, ${firstName}!` : 'Welcome Back!'}
                </p>
            </div>

            <div className="flex flex-1 flex-col gap-4">
                <div className="flex gap-4">
                    <RecentTasksPanel className="min-w-0 flex-1" />
                    <RecentPositionsPanel className="min-w-0 flex-1" />
                </div>
                {/* Widths keep Figma's 839 : 465 ratio at every viewport size. */}
                <div className="grid flex-1 grid-cols-[minmax(0,839fr)_minmax(0,465fr)] gap-5">
                    <LiveAssessmentsPanel />
                    <ReadyForReviewPanel />
                </div>
            </div>
        </div>
    );
}
