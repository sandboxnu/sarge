'use client';
import { use, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import useApplicationReview from '@/lib/hooks/useApplicationReview';
import usePositionApplications from '@/lib/hooks/usePositionApplications';
import ReviewNavbar from '@/lib/components/reviewing/ReviewNavbar';
import TaskReviewMain from '@/lib/components/reviewing/TaskReviewMain';
import TaskReviewSidebar from '@/lib/components/reviewing/TaskReviewSidebar';
import { createComment } from '@/lib/api/tasks';
import type { LineRange } from '@/lib/utils/comment.utils';

export default function ReviewApplication({
    params,
}: {
    params: Promise<{ positionId: string; applicationId: string }>;
}) {
    const { positionId, applicationId } = use(params);

    // NOTE(laith): tasks within this application are rotated by the sidebar and applications within
    // the position are rotated by the navbar
    const { application, loading, error, currentTaskData, goPrevTask, goNextTask, refetch } =
        useApplicationReview(applicationId);

    const { applications, goToApplication, goPrevApplication, goNextApplication } =
        usePositionApplications(positionId, applicationId);

    const [selectedLines, setSelectedLines] = useState<LineRange | null>(null);

    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function submitComment() {
        const content = commentText.trim();
        if (!currentTaskData || !content || submitting) return;
        setSubmitting(true);
        try {
            await createComment(currentTaskData.id, { content, ...selectedLines });
            setCommentText('');
            setSelectedLines(null);
            await refetch();
        } catch (err) {
            toast.error((err as Error).message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    }

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
                {application?.assessmentStatus === 'GRADED' ||
                application?.assessmentStatus === 'SUBMITTED' ? (
                    <>
                        <TaskReviewMain
                            task={currentTaskData}
                            selectedLines={selectedLines}
                            onSelectLines={setSelectedLines}
                            commentText={commentText}
                            onCommentChange={setCommentText}
                            onSubmitComment={submitComment}
                            submitDisabled={!commentText.trim() || submitting}
                        />
                        <TaskReviewSidebar
                            task={currentTaskData}
                            onPrev={goPrevTask}
                            onNext={goNextTask}
                            commentText={commentText}
                            onCommentChange={setCommentText}
                            onSubmitComment={submitComment}
                            submitDisabled={!commentText.trim() || submitting}
                        />
                    </>
                ) : (
                    <>
                        <div className="flex min-h-0 flex-1 items-center justify-center">
                            <div className="inline-flex h-[184px] min-h-0 w-[362px] flex-col items-center justify-center space-y-6">
                                <div className="flex w-full justify-center">
                                    <Image
                                        src="/GreyWinstonLogoMark.svg"
                                        alt="Sarge Logo"
                                        width={137}
                                        height={72.42}
                                        priority
                                    />
                                </div>
                                <p className="text-lg font-medium tracking-wide">
                                    This candidate has not made a submission
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
