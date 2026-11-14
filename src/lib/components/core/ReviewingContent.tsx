'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { Search } from '@/lib/components/core/Search';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import {
    AwaitingReviewSection,
    ContinueGradingSection,
} from '@/lib/components/core/ReviewingSidePanel';

export default function ReviewingContent() {
    const [search, setSearch] = useState('');

    return (
        <div className="border-sarge-gray-200 flex min-h-0 flex-1 border-t">
            <Tabs
                defaultValue="active"
                className="border-sarge-gray-200 flex min-w-0 flex-[2] flex-col gap-4 border-r pt-4"
            >
                <div className="flex items-center justify-between gap-4 pr-4 pl-5">
                    <div className="max-w-[690px] min-w-56 flex-1">
                        <Search
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Type to search for a position or assessment"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="dropdown">
                            <ArrowUpDown className="size-5" />
                            <span className="text-label-s hidden sm:inline">Sort</span>
                        </Button>
                        <Button variant="dropdown">
                            <SlidersHorizontal className="size-5" />
                            <span className="text-label-s hidden sm:inline">Filter</span>
                        </Button>
                    </div>
                </div>

                <div className="border-sarge-gray-200 border-b pr-4 pl-5">
                    <TabsList className="h-auto gap-5 bg-transparent p-0">
                        <UnderlineTabsTrigger value="active">Active (0)</UnderlineTabsTrigger>
                        <UnderlineTabsTrigger value="archived">Archived</UnderlineTabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="active" className="flex flex-1">
                    <EmptyState text="There are no live assessments" />
                </TabsContent>

                <TabsContent value="archived" className="flex flex-1">
                    <EmptyState text="There are no archived assessments" />
                </TabsContent>
            </Tabs>

            <aside className="flex min-w-0 flex-1 flex-col">
                <ContinueGradingSection />
                <AwaitingReviewSection />
            </aside>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <Image src="/GreyWinstonLogoMark.svg" alt="" width={160} height={88} priority />
            <p className="text-body-m text-sarge-gray-800">{text}</p>
        </div>
    );
}
