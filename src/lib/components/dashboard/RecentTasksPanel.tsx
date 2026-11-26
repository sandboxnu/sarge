import { DashboardEmptyState } from '@/lib/components/dashboard/DashboardEmptyState';
import { DashboardPanel, DashboardPanelHeader } from '@/lib/components/dashboard/DashboardPanel';
import { PanelAction } from '@/lib/components/dashboard/PanelAction';

export function RecentTasksPanel({ className }: { className?: string }) {
    return (
        <DashboardPanel className={className}>
            <DashboardPanelHeader
                title="Recently Created Tasks"
                trailing={<PanelAction label="New Task" />}
                className="pr-2"
            />
            <DashboardEmptyState
                message="There are no recently created tasks."
                className="h-64 flex-none"
            />
        </DashboardPanel>
    );
}
