import { ChevronRight } from 'lucide-react';
import { DashboardPanel, DashboardPanelHeader } from '@/lib/components/dashboard/DashboardPanel';
import { Button } from '@/lib/components/ui/Button';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import { cn } from '@/lib/utils/cn.utils';

export type LiveAssessmentCounts = {
    inProgress: number;
    notStarted: number;
    completed: number;
    archived: number;
};

const EMPTY_COUNTS: LiveAssessmentCounts = {
    inProgress: 0,
    notStarted: 0,
    completed: 0,
    archived: 0,
};

/**
 * Empty-state scaffold. The progress bar only renders the all-"Not started" state from
 * Figma's Empty frame; the multi-segment bar belongs with the filled state.
 */
export function LiveAssessmentsPanel({
    counts = EMPTY_COUNTS,
    className,
}: {
    counts?: LiveAssessmentCounts;
    className?: string;
}) {
    const stats = [
        { label: 'In progress', value: counts.inProgress },
        { label: 'Not started', value: counts.notStarted },
        { label: 'Completed', value: counts.completed },
        { label: 'Archived', value: counts.archived },
    ];

    // Not in Figma (desktop only): below 640px the card stacks the tabs under the stats,
    // and the stats go 2×2 once their column is too narrow for four ~65px labels.
    return (
        <DashboardPanel className={cn('@container/live', className)}>
            <div className="flex flex-1 flex-col gap-8 @min-[640px]/live:flex-row @min-[640px]/live:items-start">
                <div className="@container/stats flex min-w-0 flex-col gap-4 @min-[640px]/live:h-full @min-[640px]/live:flex-1">
                    <DashboardPanelHeader
                        title="Live Assessments"
                        subtitle="Track grading progress for open positions"
                    />
                    <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-clip p-1">
                        <div className="grid w-full max-w-[362px] grid-cols-2 gap-y-4 @min-[300px]/stats:grid-cols-4 @min-[300px]/stats:gap-y-0">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex min-w-0 flex-col gap-1">
                                    <p className="text-label-l text-black">{stat.value}</p>
                                    <p className="text-label-xs text-sarge-gray-600 whitespace-nowrap">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="flex w-full flex-col gap-4">
                            {/* #ECECEC is Figma's value; no token or site precedent exists for it. */}
                            <div className="h-3.5 w-full rounded-sm bg-[#ececec]" />
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 shrink-0 rounded-full bg-[#ececec]" />
                                    <span className="text-label-xs text-sarge-gray-800">
                                        Not started ({counts.notStarted})
                                    </span>
                                    <span className="text-body-xs text-sarge-gray-600">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="continue-grading" className="min-w-0 flex-1 gap-2 pb-4">
                    <TabsList className="h-auto gap-5 bg-transparent p-0">
                        <UnderlineTabsTrigger
                            value="continue-grading"
                            className="tracking-design leading-4.5 whitespace-nowrap"
                        >
                            Continue Grading
                        </UnderlineTabsTrigger>
                        <UnderlineTabsTrigger
                            value="needs-review"
                            className="tracking-design leading-4.5 whitespace-nowrap"
                        >
                            Needs Review
                        </UnderlineTabsTrigger>
                    </TabsList>

                    <TabsContent value="continue-grading" className="flex flex-col gap-5">
                        <p className="text-body-xs text-sarge-gray-600 pt-4 pr-16">
                            There are no assessments to continue grading. Start grading?
                        </p>
                        <Button className="text-label-s w-fit gap-2 rounded-md px-4 py-2">
                            Live Assessments
                            {/* Sized so lucide's chevron matches Figma's 20px Action/chevron-right */}
                            <span className="flex size-5 items-center justify-center">
                                <ChevronRight className="size-[13.333px]" strokeWidth={2.7} />
                            </span>
                        </Button>
                    </TabsContent>

                    <TabsContent value="needs-review">
                        <p className="text-body-xs text-sarge-gray-600 pt-4 pr-16">
                            There are no assessments to review.
                        </p>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardPanel>
    );
}
