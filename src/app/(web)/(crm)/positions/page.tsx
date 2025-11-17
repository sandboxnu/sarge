'use client';

import { Button } from '@/lib/components/Button';
import usePosition from '@/lib/hooks/usePosition';
import { Plus, ArrowDownUpIcon, SlidersHorizontal, Users, Archive } from 'lucide-react';
import SargeCard from '@/lib/components/SargeCard';
import { Search } from '@/lib/components/Search';
import { type PositionWithCounts } from '@/lib/types/position.types';

export default function PositionsPage() {
    const { positions, loading, error, archived, createPosition } = usePosition();

    return (
        <div className="flex flex-col gap-8 px-5 py-4">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="w-[50%]">
                        <Search />
                    </div>
                    <div className="">
                        <Button variant="secondary" className="bg-background border-0 px-4 py-2">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal />
                                Filter
                            </div>
                        </Button>
                        <Button variant="secondary" className="bg-background border-0 px-4 py-2">
                            <div className="flex items-center gap-2">
                                <ArrowDownUpIcon />
                                Sort
                            </div>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Users />
                            <p className="text-display-xs">Active Positions</p>
                        </div>
                        <p className="text-body-s text-sarge-gray-600">
                            {positions.length} positions
                        </p>
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
                    {positions.length > 0 && <PositionCardGrid positions={positions} />}
                    {loading && <p>Loading positions...</p>}
                    {error && <p className="text-sarge-error-700">Error loading positions.</p>}
                    {!loading && positions.length === 0 && !error && (
                        <p className="h-full w-full items-center">
                            No positions found. Create a new position to get started.
                        </p>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Archive />
                        <p className="text-display-xs">Archived Positions</p>
                    </div>
                    <p className="text-body-s text-sarge-gray-600">{archived.length} positions</p>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="items-center justify-between">
                    {archived.length > 0 && <PositionCardGrid positions={archived} />}
                    {loading && <p>Loading positions...</p>}
                    {error && <p className="text-sarge-error-700">Error loading positions.</p>}
                </div>
            </div>
        </div>
    );
}

function PositionCardGrid({ positions }: { positions: PositionWithCounts[] }) {
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
