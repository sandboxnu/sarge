'use client';

import { useEffect, useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { FileText, ExternalLink, SquareArrowOutUpRightIcon } from 'lucide-react';
import AvatarGroup from '@/lib/components/ui/AvatarGroup';
import { getPositionPreviewAction } from '@/app/actions/position.actions';
import { Chip } from '@/lib/components/ui/Chip';
import {
    getAssessmentStatusVariant,
    getAssessmentStatusLabel,
    getDecisionStatusVariant,
    getDecisionStatusLabel,
} from '@/lib/utils/status.utils';

interface PositionPreviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    positionId: string | null;
}

function CandidateTable({
    candidates,
}: {
    candidates: Awaited<ReturnType<typeof getPositionPreviewAction>>['candidates'];
}) {
    return (
        <div className="max-h-[400px] overflow-y-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full">
                <thead className="sticky top-0 z-10 bg-white">
                    <tr className="border-sarge-gray-200 border-b">
                        <th className="text-sarge-gray-700 text-body-s px-4 py-3 text-left tracking-wider uppercase">
                            NAME/MAJOR
                        </th>
                        <th className="text-sarge-gray-700 text-body-s px-4 py-3 text-center tracking-wider uppercase">
                            GRAD YEAR
                        </th>
                        <th className="text-sarge-gray-700 text-body-s px-4 py-3 text-center tracking-wider uppercase">
                            OA STATUS
                        </th>
                        <th className="text-sarge-gray-700 text-body-s px-4 py-3 text-center tracking-wider uppercase">
                            GRADER
                        </th>
                        <th className="text-sarge-gray-700 text-body-s px-4 py-3 text-center tracking-wider uppercase">
                            DECISION
                        </th>
                        <th className="text-sarge-gray-700 text-body-s px-4 py-3 text-center tracking-wider uppercase">
                            SUBMISSION
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center">
                                <p className="text-body-s text-sarge-gray-600 mb-1">
                                    No candidates in this position yet
                                </p>
                                <p className="text-body-xs text-sarge-gray-600">
                                    Add candidates in the full page view
                                </p>
                            </td>
                        </tr>
                    ) : (
                        candidates.map((entry) => {
                            const graders =
                                entry.assessment?.reviews.map((r) => ({
                                    id: r.reviewer.id,
                                    name: r.reviewer.name,
                                    email: r.reviewer.email,
                                    image: r.reviewer.image,
                                })) ?? [];

                            const hasSubmission =
                                entry.assessmentStatus === 'SUBMITTED' ||
                                entry.assessmentStatus === 'GRADED';

                            return (
                                <tr
                                    key={entry.id}
                                    className="border-sarge-gray-200 border-b last:border-b-0"
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-label-xs text-sarge-gray-800">
                                                {entry.candidate.name}
                                            </span>
                                            <span className="text-body-xs text-sarge-gray-600">
                                                {entry.candidate.major ?? 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-label-xs text-sarge-gray-800">
                                            {entry.candidate.graduationDate ?? 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <Chip
                                            variant={getAssessmentStatusVariant(
                                                entry.assessmentStatus
                                            )}
                                        >
                                            {getAssessmentStatusLabel(entry.assessmentStatus)}
                                        </Chip>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center">
                                            <AvatarGroup avatars={graders} max={2} />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <Chip
                                            variant={getDecisionStatusVariant(entry.decisionStatus)}
                                        >
                                            {getDecisionStatusLabel(entry.decisionStatus)}
                                        </Chip>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center">
                                            {hasSubmission && entry.assessment ? (
                                                <a
                                                    href={entry.assessment.uniqueLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sarge-primary-500 hover:text-sarge-primary-600 transition-colors"
                                                >
                                                    <ExternalLink className="size-5" />
                                                </a>
                                            ) : (
                                                <ExternalLink className="text-sarge-gray-300 size-5 opacity-50" />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function PositionPreviewModal({
    open,
    onOpenChange,
    positionId,
}: PositionPreviewModalProps) {
    type SerializedPositionPreviewData = Awaited<ReturnType<typeof getPositionPreviewAction>>;

    const [position, setPosition] = useState<SerializedPositionPreviewData | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !positionId) {
            setPosition(null);
            setError(null);
            return;
        }

        startTransition(async () => {
            try {
                const data = await getPositionPreviewAction(positionId);
                setPosition(data);
                setError(null);
            } catch {
                setError('Failed to load position details');
            }
        });
    }, [open, positionId]);

    const handleViewFullPosition = () => {
        if (positionId) {
            window.open(`/positions/${positionId}`, '_blank');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="bg-sarge-gray-50 flex max-h-[85vh] w-full max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl"
                showCloseButton={true}
            >
                <div className="relative flex flex-shrink-0 items-start px-6 pt-6 pr-[72px] pb-2">
                    <div className="flex flex-col gap-1">
                        <DialogTitle className="text-label-m text-sarge-gray-800">
                            {isPending
                                ? 'Loading...'
                                : error
                                    ? 'Error'
                                    : (position?.title ?? 'Position')}
                        </DialogTitle>
                        {!isPending && !error && position && (
                            <p className="text-body-s text-sarge-gray-600">
                                {position.candidateCount}{' '}
                                {position.candidateCount === 1 ? 'candidate' : 'candidates'}
                            </p>
                        )}
                    </div>
                    {!isPending && !error && position && (
                        <button
                            onClick={handleViewFullPosition}
                            className="text-sarge-gray-600 hover:text-sarge-primary-500 absolute top-4 right-12 rounded-xs opacity-70 transition-colors hover:opacity-100"
                            aria-label="Open position in new tab"
                        >
                            <SquareArrowOutUpRightIcon className="size-4" />
                        </button>
                    )}
                </div>

                {isPending && (
                    <div className="flex flex-1 items-center justify-center p-6">
                        <div className="text-sarge-gray-600">Loading position details...</div>
                    </div>
                )}

                {error && (
                    <div className="flex flex-1 items-center justify-center p-6">
                        <div className="text-sarge-error-700">{error}</div>
                    </div>
                )}

                {!isPending && !error && position && (
                    <div className="flex min-h-0 flex-1 flex-col">
                        <div className="flex flex-shrink-0 flex-col gap-2 px-6 pt-2 pb-6">
                            <span className="text-label-s text-sarge-gray-800">Assessment</span>

                            <div className="border-sarge-gray-200 overflow-hidden rounded-lg border">
                                {position.assessmentTemplate ? (
                                    <div className="border-sarge-gray-200 border-b bg-white p-3">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <FileText className="text-sarge-gray-600 size-5" />
                                                <span className="text-label-xs text-sarge-gray-800">
                                                    {position.assessmentTemplate.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Chip variant="neutral">
                                                    {position.stats.totalSent} sent
                                                </Chip>
                                                <Chip
                                                    variant={
                                                        position.stats.totalSubmitted > 0
                                                            ? 'success'
                                                            : 'neutral'
                                                    }
                                                >
                                                    {position.stats.totalSubmitted}/
                                                    {position.stats.totalSent} submissions
                                                </Chip>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-sarge-gray-200 border-b bg-white p-4">
                                        <p className="text-body-s text-sarge-gray-600 text-center">
                                            No assessment assigned to this position
                                        </p>
                                    </div>
                                )}

                                <CandidateTable candidates={position.candidates} />
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
