'use client';

import { useState } from 'react';
import { Button } from '@/lib/components/Button';
import { Plus, ArrowUpDown, SlidersHorizontal, Rows3, LayoutGrid } from 'lucide-react';
import PositionCard from '@/lib/components/PositionCard';
import { Search } from '@/lib/components/Search';
import { type PositionWithCounts } from '@/lib/types/position.types';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/Tabs';
import CreatePositionModal from '@/lib/components/modal/CreatePositionModal';
import Image from 'next/image';

interface PositionsContentProps {
    initialPositions: PositionWithCounts[];
}

export default function PositionsContent({ initialPositions }: PositionsContentProps) {
    const [positions, setPositions] = useState<PositionWithCounts[]>(initialPositions);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const archived: PositionWithCounts[] = [];

    async function handleCreatePosition(title: string) {
        const response = await fetch('/api/position', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });

        if (!response.ok) {
            throw new Error('Failed to create position');
        }

        const result = await response.json();
        setPositions((prev) => [...prev, result.data]);
    }

    return (
        <>
            <Tabs defaultValue="active" className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <Search placeholder="Type to search for a position" />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 rounded-lg border border-sarge-gray-200 bg-white px-3 py-2.5 text-sarge-gray-600 hover:bg-sarge-gray-100">
                            <ArrowUpDown className="size-5" />
                            <span className="text-sm font-medium">Sort</span>
                        </button>
                        <button className="flex items-center gap-2 rounded-lg border border-sarge-gray-200 bg-white px-3 py-2.5 text-sarge-gray-600 hover:bg-sarge-gray-100">
                            <SlidersHorizontal className="size-5" />
                            <span className="text-sm font-medium">Filter</span>
                        </button>
                    </div>

                    <div className="flex items-center rounded-lg border border-sarge-gray-200 bg-white">
                        <button className="flex items-center justify-center p-3 text-sarge-gray-600 hover:bg-sarge-gray-100">
                            <Rows3 className="size-5" />
                        </button>
                        <div className="h-6 w-px bg-sarge-gray-200" />
                        <button className="flex items-center justify-center p-3 text-sarge-gray-600 hover:bg-sarge-gray-100">
                            <LayoutGrid className="size-5" />
                        </button>
                    </div>

                    <Button
                        type="button"
                        variant="primary"
                        className="gap-2 px-4 py-2.5"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="size-5" />
                        <span>New position</span>
                    </Button>
                </div>

                <TabsList className="h-auto gap-5 bg-transparent p-0">
                    <UnderlineTabsTrigger value="active">
                        Active ({positions.length ?? 0})
                    </UnderlineTabsTrigger>
                    <UnderlineTabsTrigger value="archived">
                        Archived ({archived.length})
                    </UnderlineTabsTrigger>
                </TabsList>

                <TabsContent value="active" className="flex flex-col gap-4">
                    {positions.length > 0 ? (
                        <PositionCardGrid positions={positions} />
                    ) : (
                        <EmptyState
                            imageSrc="/User_empty.svg"
                            title="You have no active positions"
                            description="Create a position to upload candidates"
                        />
                    )}
                </TabsContent>

                <TabsContent value="archived" className="flex flex-col gap-4">
                    {archived.length > 0 ? (
                        <PositionCardGrid positions={archived} />
                    ) : (
                        <EmptyState
                            imageSrc="/No_Archive.svg"
                            title="You have no archived positions"
                            description="Archive positions to keep your workspace organized"
                        />
                    )}
                </TabsContent>
            </Tabs>

            <CreatePositionModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onCreate={handleCreatePosition}
            />
        </>
    );
}

function PositionCardGrid({ positions }: { positions: PositionWithCounts[] }) {
    return (
        <div className="flex flex-wrap gap-4">
            {positions.map((position) => (
                <PositionCard
                    key={position.id}
                    title={position.title}
                    candidateCount={position.numCandidates}
                    assessmentName={''}
                />
            ))}
        </div>
    );
}

function EmptyState({
    imageSrc,
    title,
    description,
}: {
    imageSrc: string;
    title: string;
    description: string;
}) {
    return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4">
            <Image src={imageSrc} alt="" width={200} height={200} priority />
            <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-label-l text-sarge-gray-800">{title}</h2>
                <p className="text-body-s text-sarge-gray-600">{description}</p>
            </div>
        </div>
    );
}
