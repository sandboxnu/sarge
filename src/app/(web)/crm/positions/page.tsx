import { Users } from 'lucide-react';
import PositionService from '@/lib/services/position.service';
import { getSession } from '@/lib/utils/auth.utils';
import PositionsContent from '@/lib/components/core/PositionsContent';

export default async function PositionsPage() {
    const session = await getSession();
    const positions = await PositionService.getPositionByOrgId(session.activeOrganizationId);

    return (
        <div className="flex flex-col gap-3 pt-4 pr-5 pb-5 pl-7">
            <div className="flex items-center gap-2">
                <Users className="size-5" />
                <h1 className="text-display-xs">Positions</h1>
            </div>

            <PositionsContent positions={positions} />
        </div>
    );
}
