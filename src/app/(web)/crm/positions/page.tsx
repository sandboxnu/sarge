import { Users } from 'lucide-react';
import PositionsContent from '@/lib/components/core/PositionsContent';

export default async function PositionsPage() {
    return (
        <div className="flex flex-col gap-3 pt-4 pr-5 pb-5 pl-7">
            <div className="flex items-center gap-2">
                <Users className="size-5" />
                <h1 className="text-display-xs">Positions</h1>
            </div>

            <PositionsContent />
        </div>
    );
}
