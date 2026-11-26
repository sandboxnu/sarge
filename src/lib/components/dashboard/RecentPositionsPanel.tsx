import { DashboardEmptyState } from '@/lib/components/dashboard/DashboardEmptyState';
import { DashboardPanel, DashboardPanelHeader } from '@/lib/components/dashboard/DashboardPanel';
import { PanelAction } from '@/lib/components/dashboard/PanelAction';

export function RecentPositionsPanel({ className }: { className?: string }) {
    return (
        <DashboardPanel className={className}>
            <DashboardPanelHeader
                title="Recently Created Positions"
                trailing={<PanelAction label="New Position" />}
                className="pr-2"
            />
            <DashboardEmptyState
                message="There are no recently created positions."
                className="h-64 flex-none"
            />
        </DashboardPanel>
    );
}
