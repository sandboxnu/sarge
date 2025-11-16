'use client';

import { Button } from '@/lib/components/Button';
import { Input } from '@/lib/components/Input';
import usePosition from '@/lib/hooks/usePosition';
import { Plus, ArrowDownUpIcon, SlidersHorizontal, Users, Search, Archive } from 'lucide-react';
import SargeCard from '@/lib/components/SargeCard';
import { type PositionDTO } from '@/lib/schemas/position.schema';

export default function PositionsPage() {
    const { positions, loading, error, archived, createPosition } = usePosition();

    const examplesPositions: PositionDTO[] = [
        {
            id: '1',
            title: 'Software Engineer',
            orgId: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            createdById: '',
        },
        {
            id: '2',
            title: 'Product Manager',
            orgId: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            createdById: '',
        },
        {
            id: '3',
            title: 'UX Designer',
            orgId: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            createdById: '',
        },
        {
            id: '4',
            title: 'Data Scientist',
            orgId: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            createdById: '',
        },
    ];

    return (
        <div className="flex flex-col gap-8 px-4 pt-3">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="w-[50%]">
                        <Input
                            className="border-sarge-gray-200 bg-sarge-gray-200 h-full w-full rounded-sm border-1 px-3 py-1"
                            placeholder="Search positions..."
                        />
                    </div>
                    <div className="">
                        <Button variant="secondary" className="border-0 bg-none px-4 py-2">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal />
                                Filter
                            </div>
                        </Button>
                        <Button variant="secondary" className="border-0 bg-none px-4 py-2">
                            <div className="flex items-center gap-2">
                                <ArrowDownUpIcon />
                                Sort
                            </div>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users />
                        <p className="text-display-xs">Active Positions</p>
                    </div>
                    <div className="">
                        <Button variant="primary">
                            <div className="flex items-center gap-2.5 px-2 py-1">
                                <Plus />
                                New Position
                            </div>
                        </Button>
                    </div>
                </div>
                <div className="gap-4"></div>
                <div className="">
                    {examplesPositions.length > 0 && (
                        <PositionCardGrid positions={examplesPositions} />
                    )}
                    {loading && <p>Loading positions...</p>}

                    {!loading && examplesPositions.length === 0 && !error && (
                        <p className="h-full w-full items-center">
                            No positions found. Create a new position to get started.
                        </p>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Archive />
                    <p className="text-display-xs">Archived Positions</p>
                </div>
                <div className="">
                    {examplesPositions.length > 0 && (
                        <PositionCardGrid positions={examplesPositions} />
                    )}
                </div>
            </div>
        </div>
    );
}

function PositionCardGrid({ positions }: { positions: any[] }) {
    return (
        <div className="flex flex-wrap gap-4">
            {positions.map((position) => (
                <SargeCard
                    key={position.id}
                    title={position.title}
                    candidateCount={0}
                    assessmentName={''}
                />
            ))}
        </div>
    );
}
