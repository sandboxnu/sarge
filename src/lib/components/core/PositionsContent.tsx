'use client';

import { Button } from '@/lib/components/ui/Button';
import { Plus, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import PositionCard from '@/lib/components/core/PositionCard';
import { Search } from '@/lib/components/core/Search';
import { type PositionWithCounts } from '@/lib/types/position.types';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import CreatePositionModal from '@/lib/components/modal/CreatePositionModal';
import Image from 'next/image';
import usePositionContent, { type PositionSortBy } from '@/lib/hooks/usePositionsContent';
import useSearch from '@/lib/hooks/useSearch';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';

export default function PositionsContent() {
    const {
        isCreateModalOpen,
        setIsCreateModalOpen,
        active,
        setActive,
        archived,
        handlePositionClick,
        onArchive,
        onUnarchive,
        onDelete,
        sortBy,
        setSortBy,
        sortAndFilter,
    } = usePositionContent();

    const { value, onChange, data, loading } = useSearch('positions');

    const isSearching = value.trim().length >= 1;

    const displayedActivePositions = sortAndFilter(
        isSearching ? data.filter((p) => !p.archived) : active
    );

    const displayedArchivedPositions = sortAndFilter(
        isSearching ? data.filter((p) => p.archived) : archived
    );

    return (
        <>
            <Tabs defaultValue="active" className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                    <div className="min-w-56 flex-1">
                        <Search
                            value={value}
                            onChange={onChange}
                            placeholder="Type to search for a position"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="dropdown">
                                    <ArrowUpDown className="size-5" />
                                    <span className="text-label-s hidden sm:inline">Sort</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                                <DropdownMenuRadioGroup
                                    value={sortBy ?? ''}
                                    onValueChange={(v) =>
                                        setSortBy(v === '' ? null : (v as PositionSortBy))
                                    }
                                >
                                    <DropdownMenuRadioItem value="">
                                        Default
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="title-asc">
                                        Title (A → Z)
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="title-desc">
                                        Title (Z → A)
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="created-desc">
                                        Created (Newest first)
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="created-asc">
                                        Created (Oldest first)
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="dropdown">
                            <SlidersHorizontal className="size-5" />
                            <span className="text-label-s hidden sm:inline">Filter</span>
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
                        <span className="hidden sm:inline">New position</span>
                    </Button>
                </div>

                <div className="border-sarge-gray-200 border-b">
                    <TabsList className="h-auto gap-5 bg-transparent p-0">
                        <UnderlineTabsTrigger value="active">
                            Active ({displayedActivePositions.length ?? 0})
                        </UnderlineTabsTrigger>
                        <UnderlineTabsTrigger value="archived">
                            Archived ({displayedArchivedPositions.length})
                        </UnderlineTabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="active" className="flex flex-col gap-4">
                    {loading ? (
                        <div className="text-sarge-gray-500 py-10 text-center">
                            Searching positions…
                        </div>
                    ) : displayedActivePositions.length > 0 ? (
                        <PositionCardGrid
                            positions={displayedActivePositions}
                            onPositionClick={handlePositionClick}
                            onArchive={onArchive}
                            onUnarchive={onUnarchive}
                            onDelete={onDelete}
                        />
                    ) : (
                        <EmptyState
                            imageSrc="/User_empty.svg"
                            title={
                                isSearching ? 'No positions found' : 'You have no active positions'
                            }
                            description={
                                isSearching
                                    ? 'Try a different search term'
                                    : 'Create a position to upload candidates'
                            }
                        />
                    )}
                </TabsContent>

                <TabsContent value="archived" className="flex flex-col gap-4">
                    {loading ? (
                        <div className="text-sarge-gray-500 py-10 text-center">
                            Searching positions…
                        </div>
                    ) : displayedArchivedPositions.length > 0 ? (
                        <PositionCardGrid
                            positions={displayedArchivedPositions}
                            onPositionClick={handlePositionClick}
                            onArchive={onArchive}
                            onUnarchive={onUnarchive}
                            onDelete={onDelete}
                        />
                    ) : (
                        <EmptyState
                            imageSrc="/No_Archive.svg"
                            title={
                                isSearching
                                    ? 'No positions found'
                                    : 'You have no archived positions'
                            }
                            description={
                                isSearching
                                    ? 'Try a different search term'
                                    : 'Archive positions to keep your workspace organized'
                            }
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
    onArchive,
    onUnarchive,
    onDelete,
}: {
    positions: PositionWithCounts[];
    onPositionClick: (positionId: string) => void;
    onArchive: (positionId: string) => void;
    onUnarchive: (positionId: string) => void;
    onDelete: (positionId: string) => void;
}) {
    return (
        <div className="flex flex-wrap gap-4">
            {positions.map((position) => (
                <PositionCard
                    key={position.id}
                    title={position.title}
                    candidateCount={position.numCandidates}
                    sentCount={position.assessmentSentCount}
                    submittedCount={position.assessmentSubmittedCount}
                    archived={position.archived}
                    onPositionClick={() => onPositionClick(position.id)}
                    onArchive={() => onArchive(position.id)}
                    onUnarchive={() => onUnarchive(position.id)}
                    onDelete={() => onDelete(position.id)}
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
