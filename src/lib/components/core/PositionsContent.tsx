'use client';

import { Button } from '@/lib/components/ui/Button';
import { Plus, ArrowUpDown, SlidersHorizontal, Rows3, LayoutGrid } from 'lucide-react';
import PositionCard from '@/lib/components/core/PositionCard';
import { Search } from '@/lib/components/core/Search';
import { type PositionWithCounts } from '@/lib/types/position.types';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import CreatePositionModal from '@/lib/components/modal/CreatePositionModal';
import PositionPreviewModal from '@/lib/components/modal/PositionPreviewModal';
import Image from 'next/image';
import usePositionContent from '@/lib/hooks/usePositionsContent';

export default function PositionsContent() {
    const {
        isCreateModalOpen,
        setIsCreateModalOpen,
        isPreviewModalOpen,
        setIsPreviewModalOpen,
        selectedPositionId,
        active,
        setActive,
        archived,
        // setArchived,
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
                        <button className="border-sarge-gray-200 text-sarge-gray-600 hover:bg-sarge-gray-100 flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5">
                            <ArrowUpDown className="size-5" />
                            <span className="text-label-s">Sort</span>
                        </button>
                        <button className="border-sarge-gray-200 text-sarge-gray-600 hover:bg-sarge-gray-100 flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5">
                            <SlidersHorizontal className="size-5" />
                            <span className="text-label-s">Filter</span>
                        </button>
                    </div>

                    <div className="border-sarge-gray-200 flex items-center rounded-lg border bg-white">
                        <button className="text-sarge-gray-600 hover:bg-sarge-gray-100 flex items-center justify-center p-3">
                            <Rows3 className="size-5" />
                        </button>
                        <div className="bg-sarge-gray-200 h-6 w-px" />
                        <button className="text-sarge-gray-600 hover:bg-sarge-gray-100 flex items-center justify-center p-3">
                            <LayoutGrid className="size-5" />
                        </button>
                    </div>

                    <Button
                        type="button"
                        variant="primary"
                        className="gap-2 px-4 py-2.5"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="size-5" />
                        <span>New position</span>
                    </Button>
                </div>

                <TabsList className="h-auto gap-5 bg-transparent p-0">
                    <UnderlineTabsTrigger value="active">
                        Active ({active.length ?? 0})
                    </UnderlineTabsTrigger>
                    <UnderlineTabsTrigger value="archived">
                        Archived ({archived.length})
                    </UnderlineTabsTrigger>
                </TabsList>

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

            <PositionPreviewModal
                open={isPreviewModalOpen}
                onOpenChange={setIsPreviewModalOpen}
                positionId={selectedPositionId}
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
