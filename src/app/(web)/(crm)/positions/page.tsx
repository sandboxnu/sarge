'use client';

import { Button } from '@/lib/components/Button';
import usePosition from '@/lib/hooks/usePosition';
import { Plus, ArrowDownUpIcon, SlidersHorizontal } from 'lucide-react';
import SargeCard from '@/lib/components/SargeCard';
import { Search } from '@/lib/components/Search';
import { type PositionWithCounts } from '@/lib/types/position.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/Tabs';
import CreatePositionModal from '@/lib/components/modal/CreatePositionModal';

export default function PositionsPage() {
    const { positions, loading, error, archived, createPosition, isModalOpen, setIsModalOpen } =
        usePosition();

    return (
        <div className="flex flex-col gap-8 px-5 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Positions</h1>
            </div>

            <Tabs defaultValue="active" className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <TabsList className="h-auto gap-1 bg-transparent p-0">
                        <TabsTrigger
                            value="active"
                            className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-[#5b6274] data-[state=active]:border-[#5d5bf7] data-[state=active]:bg-transparent data-[state=active]:text-[#5d5bf7] data-[state=active]:shadow-none"
                        >
                            Active ({positions.length ?? 0})
                        </TabsTrigger>
                        <TabsTrigger
                            value="archived"
                            className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-[#5b6274] data-[state=active]:border-[#5d5bf7] data-[state=active]:bg-transparent data-[state=active]:text-[#5d5bf7] data-[state=active]:shadow-none"
                        >
                            Archived ({archived.length})
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                        <Button variant="tertiary" className="px-4 py-2">
                            <SlidersHorizontal className="size-5" />
                        </Button>
                        <Button variant="tertiary" className="px-4 py-2">
                            <ArrowDownUpIcon className="size-5" />
                        </Button>
                        <div className="w-[550px]">
                            <Search />
                        </div>
                        <Button
                            variant="primary"
                            className="px-4 py-2"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <div className="flex items-center gap-2">
                                <Plus className="size-5" />
                                New Position
                            </div>
                        </Button>
                    </div>
                </div>

                <TabsContent value="active" className="flex flex-col gap-4">
                    {loading && <p>Loading positions...</p>}
                    {error && <p className="text-sarge-error-700">Error loading positions.</p>}
                    {!loading && !error && positions.length > 0 && (
                        <PositionCardGrid positions={positions} />
                    )}
                    {!loading && !error && positions.length === 0 && (
                        <p className="h-full w-full items-center">No active positions</p>
                    )}
                </TabsContent>

                <TabsContent value="archived" className="flex flex-col gap-4">
                    {loading && <p>Loading positions...</p>}
                    {error && <p className="text-sarge-error-700">Error loading positions.</p>}
                    {!loading && !error && archived.length > 0 && (
                        <PositionCardGrid positions={archived} />
                    )}
                    {!loading && !error && archived.length === 0 && (
                        <p className="h-full w-full items-center">No archived positions</p>
                    )}
                </TabsContent>
            </Tabs>

            <CreatePositionModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onCreate={createPosition}
            />
        </div>
    );
}

function PositionCardGrid({ positions }: { positions: PositionWithCounts[] }) {
    const router = useRouter();

    return (
        <div className="flex flex-wrap gap-4">
            {positions.map((position) => (
                <div
                    key={position.id}
                    title={position.title}
                    candidateCount={0}
                    assessmentName={''}
                />
            ))}
        </div>
    );
}
