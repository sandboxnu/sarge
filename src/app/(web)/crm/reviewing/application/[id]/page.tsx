'use client';
import { use, useState } from 'react';
import Image from 'next/image';
import useApplicationReview from '@/lib/hooks/useApplicationReview';
import ReviewNavbar from '@/lib/components/reviewing/ReviewNavbar';
import TaskReviewMain from '@/lib/components/reviewing/TaskReviewMain';
import TaskReviewSidebar from '@/lib/components/reviewing/TaskReviewSidebar';

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

    // only completed (submitted) tasks are reviewable / rotated through
    const tasks = (application?.assessment?.tasks ?? []).filter((t) => t.submittedAt !== null);
    const totalTasks = tasks.length;
    const currentTaskData = tasks[currentTask] ?? null;
    const goPrev = () => setCurrentTask((i) => Math.max(0, i - 1));
    const goNext = () => setCurrentTask((i) => Math.min(Math.max(totalTasks - 1, 0), i + 1));

    return (
        <div className="flex h-full flex-col">
            <ReviewNavbar
                assessmentName={application?.assessment?.assessmentTemplate.title ?? 'Assessment'}
                dueDate={application?.assessment?.deadline ?? null}
                candidateName={application?.candidate.name ?? 'Candidate'}
                currentTask={totalTasks === 0 ? 0 : currentTask + 1}
                totalTasks={totalTasks}
                onPrev={goPrev}
                onNext={goNext}
            />

            <div className="flex min-h-0 flex-1 px-4 py-4">
                <TaskReviewMain task={currentTaskData} />
                <TaskReviewSidebar />
            </div>
        </div>
    );
}
