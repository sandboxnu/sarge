'use client';

import Image from 'next/image';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { Search } from '@/lib/components/core/Search';
import { Skeleton } from '@/lib/components/ui/Skeleton';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import {
    AwaitingReviewSection,
    ContinueGradingSection,
} from '@/lib/components/core/ReviewingSidePanel';
import LiveAssessmentCard from '@/lib/components/reviewing/LiveAssessmentCard';
import useLiveAssessments from '@/lib/hooks/useLiveAssessments';
import useLiveAssessmentFilters, {
    LIVE_ASSESSMENT_SORT_OPTIONS,
    LIVE_ASSESSMENT_STATUS_OPTIONS,
    type LiveAssessmentSortBy,
} from '@/lib/hooks/useLiveAssessmentFilters';
import { type LiveAssessmentSummary } from '@/lib/types/reviewing.types';

export default function ReviewingContent() {
    const { liveAssessments, loading, error } = useLiveAssessments();
    const {
        search,
        setSearch,
        sortBy,
        setSortBy,
        statusFilter,
        toggleStatusFilter,
        awaitingReviewOnly,
        setAwaitingReviewOnly,
        activeFilterCount,
        isFiltering,
        active,
        archived,
    } = useLiveAssessmentFilters(liveAssessments);

    function renderTab(items: LiveAssessmentSummary[], emptyText: string) {
        if (loading) return <CardGridSkeleton />;
        if (error) {
            return <p className="text-body-s text-sarge-error-700 px-5 py-4">Error: {error}</p>;
        }
        if (items.length === 0) {
            return (
                <EmptyState
                    text={isFiltering ? 'No assessments match your search or filters' : emptyText}
                />
            );
        }
        return <CardGrid items={items} />;
    }

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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="dropdown">
                                    <ArrowUpDown className="size-5" />
                                    <span className="text-label-s hidden sm:inline">Sort</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                                <DropdownMenuRadioGroup
                                    value={sortBy}
                                    onValueChange={(v) => setSortBy(v as LiveAssessmentSortBy)}
                                >
                                    {LIVE_ASSESSMENT_SORT_OPTIONS.map((option) => (
                                        <DropdownMenuRadioItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="dropdown">
                                    <SlidersHorizontal className="size-5" />
                                    <span className="text-label-s hidden sm:inline">
                                        Filter
                                        {activeFilterCount > 0 && ` (${activeFilterCount})`}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 bg-white">
                                <DropdownMenuLabel className="text-label-xs text-sarge-gray-500">
                                    Review status
                                </DropdownMenuLabel>
                                {LIVE_ASSESSMENT_STATUS_OPTIONS.map((option) => (
                                    <DropdownMenuCheckboxItem
                                        key={option.value}
                                        checked={statusFilter.includes(option.value)}
                                        onCheckedChange={() => toggleStatusFilter(option.value)}
                                    >
                                        {option.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={awaitingReviewOnly}
                                    onCheckedChange={(checked) =>
                                        setAwaitingReviewOnly(checked === true)
                                    }
                                >
                                    Has submissions awaiting review
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="border-sarge-gray-200 border-b pr-4 pl-5">
                    <TabsList className="h-auto gap-5 bg-transparent p-0">
                        <UnderlineTabsTrigger value="active">
                            Active ({active.length})
                        </UnderlineTabsTrigger>
                        <UnderlineTabsTrigger value="archived">
                            Archived ({archived.length})
                        </UnderlineTabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="active" className="flex min-h-0 flex-1 flex-col">
                    {renderTab(active, 'There are no live assessments')}
                </TabsContent>

                <TabsContent value="archived" className="flex min-h-0 flex-1 flex-col">
                    {renderTab(archived, 'There are no archived assessments')}
                </TabsContent>
            </Tabs>

            <aside className="flex min-w-0 flex-1 flex-col">
                <ContinueGradingSection liveAssessments={liveAssessments} loading={loading} />
                <AwaitingReviewSection liveAssessments={liveAssessments} loading={loading} />
            </aside>
        </div>
    );
}

const GRID_CLASSES =
    'grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] content-start gap-4 pr-4 pb-4 pl-5';

function CardGrid({ items }: { items: LiveAssessmentSummary[] }) {
    return (
        <div className={`${GRID_CLASSES} min-h-0 flex-1 overflow-y-auto`}>
            {items.map((item) => (
                <LiveAssessmentCard key={item.positionId} item={item} />
            ))}
        </div>
    );
}

function CardGridSkeleton() {
    return (
        <div className={GRID_CLASSES} aria-busy="true" aria-label="Loading assessments">
            {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-[144px] rounded-lg" />
            ))}
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
