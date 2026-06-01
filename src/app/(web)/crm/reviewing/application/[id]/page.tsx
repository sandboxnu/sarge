'use client';
import { use, useState } from 'react';
import Image from 'next/image';
import useApplicationReview from '@/lib/hooks/useApplicationReview';
import ReviewNavbar from '@/lib/components/reviewing/ReviewNavbar';

export default function ReviewApplication({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { application, loading, error } = useApplicationReview(id);
    const [currentTask, setCurrentTask] = useState(0);

    if (loading) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <Image
                    src="/CreateOrgLoading.gif"
                    alt="Loading"
                    width={66}
                    height={66}
                />
                <p className="text-sarge-gray-800 text-base leading-tight font-medium tracking-wide">
                    Opening application review page...
                </p>
            </div>
        );
    }

    if (error) {
        return <p className="text-sarge-error-700 px-8 py-7">Error: {error}</p>;
    }

    const tasks = application?.assessment?.tasks ?? [];
    const totalTasks = tasks.length;
    const goPrev = () => setCurrentTask((i) => Math.max(0, i - 1));
    const goNext = () => setCurrentTask((i) => Math.min(Math.max(totalTasks - 1, 0), i + 1));

    return (
        <div className="flex h-full flex-col gap-3 px-8 pt-4 pb-6">
            {/* top divider: navbar header, no tabs below */}
            <ReviewNavbar
                // TODO: real assessment template title once the review query includes it
                assessmentName="Software Engineering Assessment"
                dueDate={application?.assessment?.deadline ?? null}
                // TODO: real candidate name once the review query includes the candidate
                candidateName="Candidate"
                currentTask={totalTasks === 0 ? 0 : currentTask + 1}
                totalTasks={totalTasks}
                onPrev={goPrev}
                onNext={goNext}
            />
            <hr />

            {/* main split: 2/3 left, vertical divider, 1/3 right */}
            <div className="flex min-h-0 flex-1">
                <section className="flex-[2] overflow-y-auto pr-6">
                    {/* TODO: left panel (2/3) */}
                </section>
                <div className="bg-sarge-gray-200 w-px" />
                <section className="flex-[1] overflow-y-auto pl-6">
                    {/* TODO: right panel (1/3) */}
                </section>
            </div>
        </div>
    );
}
