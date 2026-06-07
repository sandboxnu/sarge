'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useApplicationReview from '@/lib/hooks/useApplicationReview';
import usePositionApplications from '@/lib/hooks/usePositionApplications';
import ReviewNavbar from '@/lib/components/reviewing/ReviewNavbar';
import TaskReviewMain from '@/lib/components/reviewing/TaskReviewMain';
import TaskReviewSidebar from '@/lib/components/reviewing/TaskReviewSidebar';

export default function ReviewApplication({
    params,
}: {
    params: Promise<{ positionId: string; applicationId: string }>;
}) {
    const { positionId, applicationId } = use(params);
    const router = useRouter();

    const {
        application,
        loading,
        error,
        totalTasks,
        currentTask,
        setCurrentTask,
        currentTaskData,
        goPrev,
        goNext,
    } = useApplicationReview(applicationId);

    const { applications } = usePositionApplications(positionId);

    const goToApplication = (id: string) =>
        router.push(`/crm/reviewing/position/${positionId}/application/${id}`);

    const currentAppIndex = applications.findIndex((a) => a.id === applicationId);
    const totalApps = applications.length;

    // NOTE(laith): currently doing a basic ring buffer implementation, could be a world where we
    // disable the buttons instead
    const goPrevApplication = () => {
        if (totalApps === 0 || currentAppIndex < 0) return;
        goToApplication(applications[(currentAppIndex - 1 + totalApps) % totalApps].id);
    };
    const goNextApplication = () => {
        if (totalApps === 0 || currentAppIndex < 0) return;
        goToApplication(applications[(currentAppIndex + 1) % totalApps].id);
    };

    if (loading) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <Image src="/CreateOrgLoading.gif" alt="Loading" width={66} height={66} />
                <p className="text-sarge-gray-800 text-base leading-tight font-medium tracking-wide">
                    Opening application review page...
                </p>
            </div>
        );
    }

    if (error) {
        return <p className="text-sarge-error-700 px-8 py-7">Error: {error}</p>;
    }

    return (
        <div className="flex h-full flex-col">
            <ReviewNavbar
                assessmentName={application?.assessment?.assessmentTemplate.title ?? 'Assessment'}
                dueDate={application?.assessment?.deadline ?? null}
                candidateName={application?.candidate.name ?? 'Candidate'}
                applications={applications}
                currentApplicationId={applicationId}
                onPrev={goPrevApplication}
                onNext={goNextApplication}
                onSelectApplication={goToApplication}
            />

            <div className="flex min-h-0 flex-1 px-4 py-4">
                <TaskReviewMain task={currentTaskData} />
                <TaskReviewSidebar
                    task={currentTaskData}
                    currentTask={currentTask}
                    totalTasks={totalTasks}
                    onPrev={goPrev}
                    onNext={goNext}
                    onSelectTask={setCurrentTask}
                />
            </div>
        </div>
    );
}
