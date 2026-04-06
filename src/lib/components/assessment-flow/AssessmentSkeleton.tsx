import { Skeleton } from '@/lib/components/ui/Skeleton';
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/lib/components/ui/Resizable';
import { useMemo } from 'react';

export default function AssessmentSkeleton() {
    // generating random line widths for the skelton code lines
    const skeletonCodeLineWidths = useMemo(
        () => Array.from({ length: 16 }, () => `${Math.random() * 40 + 30}%`),
        []
    );

    return (
        <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={35} minSize={20}>
                <div className="flex h-full flex-col">
                    <div className="box-content shrink-0 px-5 pt-4 pb-2">
                        <Skeleton className="h-9 w-3/4 rounded-md" />
                    </div>
                    <div className="flex-1 overflow-hidden px-5 pt-1 pb-4 space-y-3">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-5/6 rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-4/6 rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <div className="pt-2 space-y-3">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-5/6 rounded" />
                            <Skeleton className="h-4 w-full rounded" />
                        </div>
                    </div>
                </div>
            </ResizablePanel>

            <ResizableHandle className="bg-sarge-gray-200 w-px" />

            <ResizablePanel defaultSize={65} minSize={40}>
                <div className="flex h-full flex-col overflow-hidden bg-[#3a414f]">
                    <div className="min-h-0 flex-1 px-4 pt-4 space-y-2">
                        {skeletonCodeLineWidths.map((w, i) => (
                            <Skeleton key={i} className="h-4 rounded" style={{ width: w }} />
                        ))}
                    </div>
                    <div className="border-t border-sarge-gray-200 px-4 py-3 flex items-center justify-between bg-white">
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-24 rounded-md" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-24 rounded-md" />
                            <Skeleton className="h-8 w-24 rounded-md" />
                        </div>
                    </div>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
