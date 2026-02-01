'use client';

import { Button } from '@/lib/components/ui/Button';
import { Plus, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import PositionCard from '@/lib/components/core/PositionCard';
import { Search } from '@/lib/components/core/Search';
import { type PositionWithCounts } from '@/lib/types/position.types';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import CreatePositionModal from '@/lib/components/modal/CreatePositionModal';
import Image from 'next/image';
import usePositionContent from '@/lib/hooks/usePositionsContent';

export default function PositionsContent() {
    const {
        isCreateModalOpen,
        setIsCreateModalOpen,
        active,
        setActive,
        archived,
        handlePositionClick,
    } = usePositionContent();

    return (
        <>
            <Tabs defaultValue="active" className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <Search placeholder="Type to search for a position" />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="primary"
                            className="bg-sarge-gray-100 text-sarge-gray-600 hover:bg-sarge-gray-200 border-sarge-gray-200 h-11 gap-2 border px-3"
                        >
                            <ArrowUpDown className="!text-sarge-gray-600 size-5" />
                            <span className="text-label-s">Sort</span>
                        </Button>
                        <Button
                            variant="primary"
                            className="bg-sarge-gray-100 text-sarge-gray-600 hover:bg-sarge-gray-200 border-sarge-gray-200 h-11 gap-2 border px-3"
                        >
                            <SlidersHorizontal className="!text-sarge-gray-600 size-5" />
                            <span className="text-label-s">Filter</span>
                        </Button>
                    </div>

                    <div className="w-25" />

                    <Button
                        type="button"
                        variant="primary"
                        className="h-11 gap-2 border border-transparent px-4"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="size-5" />
                        <span>New position</span>
                    </Button>
                </div>

                <div className="border-sarge-gray-200 border-b">
                    <TabsList className="h-auto gap-5 bg-transparent p-0">
                        <UnderlineTabsTrigger value="active">
                            Active ({active.length ?? 0})
                        </UnderlineTabsTrigger>
                        <UnderlineTabsTrigger value="archived">
                            Archived ({archived.length})
                        </UnderlineTabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="active" className="flex flex-col gap-4">
                    {active.length > 0 ? (
                        <PositionCardGrid
                            positions={active}
                            onPositionClick={handlePositionClick}
                        />
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
                        <PositionCardGrid
                            positions={archived}
                            onPositionClick={handlePositionClick}
                        />
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
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                setActive={setActive}
            />

        </>
    );
}

function PositionCardGrid({
    positions,
    onPositionClick,
}: {
    positions: PositionWithCounts[];
    onPositionClick: (positionId: string) => void;
}) {
    return (
        <div className="flex flex-wrap gap-4">
            {positions.map((position) => (
                <PositionCard
                    key={position.id}
                    title={position.title}
                    candidateCount={position.numCandidates}
                    assessmentName={''}
                    onClick={() => onPositionClick(position.id)}
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
