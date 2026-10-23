import { useEffect, useRef, useState } from 'react';
import { type ApplicationDisplayInfo } from '@/lib/types/position.types';
import { type AddApplicationWithCandidateDataDTO } from '@/lib/schemas/application.schema';
import { toast } from 'sonner';
import {
    getCandidates,
    getPosition,
    assignAssessmentTemplateToPosition,
    createCandidate as createCandidateApi,
    batchCreateCandidates as batchCreateCandidatesApi,
    batchDeleteCandidates as batchDeleteCandidatesApi,
} from '@/lib/api/positions';
import {
    getAssignableReviewers,
    sendAssessmentInvitation,
    updateAssessmentReviewers,
} from '@/lib/api/assessments';
import { getAssessmentTemplate } from '@/lib/api/assessment-templates';
import { type AssessmentTemplateListItemDTO } from '@/lib/schemas/assessment-template.schema';

interface UseCandidatesReturn {
    candidates: ApplicationDisplayInfo[];
    loading: boolean;
    error: string | null;
    positionTitle: string | null;
    createCandidate: (candidate: AddApplicationWithCandidateDataDTO) => Promise<void>;
    batchCreateCandidates: (candidates: AddApplicationWithCandidateDataDTO[]) => Promise<void>;
    deleteCandidates: (candidateIds: string[]) => Promise<boolean>;
    isSendingAssessments: boolean;
    handleSendAssessments: () => Promise<void>;
    reviewerOptions: { id: string; name: string }[];
    loadReviewerOptions: () => Promise<void>;
    assignReviewers: (assessmentId: string, reviewerIds: string[]) => void;
    assignedAssessmentTitle: string | null;
    assignAssessment: (template: AssessmentTemplateListItemDTO) => Promise<boolean>;
}

export default function useCandidates(positionId: string): UseCandidatesReturn {
    const [candidates, setCandidates] = useState<ApplicationDisplayInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [positionTitle, setPositionTitle] = useState<string | null>(null);
    const [isSendingAssessments, setIsSendingAssessments] = useState(false);
    const [reviewerOptions, setReviewerOptions] = useState<{ id: string; name: string }[]>([]);
    const reviewerOptionsRequested = useRef(false);
    // Reviewer saves run one at a time so a stale request can't overwrite a newer selection
    const reviewerRequests = useRef<Promise<void>>(Promise.resolve());
    const [assignedAssessmentTitle, setAssignedAssessmentTitle] = useState<string | null>(null);

    useEffect(() => {
        if (!positionId) return;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const [candidatesData, positionData] = await Promise.all([
                    getCandidates(positionId),
                    getPosition(positionId),
                ]);

                setCandidates(candidatesData);
                setPositionTitle(positionData.title);
                if (positionData.assessmentId) {
                    // The title is only a label, so a failed lookup shouldn't take the page down
                    try {
                        const template = await getAssessmentTemplate(positionData.assessmentId);
                        setAssignedAssessmentTitle(template.title);
                    } catch {
                        setAssignedAssessmentTitle('Assigned assessment');
                    }
                }
            } catch (err) {
                const message = (err as Error).message;
                setError(message);
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [positionId]);

    // Fetched the first time a reviewer dropdown opens, not on page load
    const loadReviewerOptions = async () => {
        if (reviewerOptionsRequested.current) return;
        reviewerOptionsRequested.current = true;
        try {
            setReviewerOptions(await getAssignableReviewers());
        } catch {
            reviewerOptionsRequested.current = false;
            toast.error('Failed to load reviewers');
        }
    };

    const createCandidate = async (candidate: AddApplicationWithCandidateDataDTO) => {
        try {
            setLoading(true);
            setError(null);

            const created = await createCandidateApi(positionId, candidate);

            setCandidates((prev) => [...prev, created]);
            toast.success('Candidate created successfully');
        } catch (err) {
            // We throw here so so we catch the error properly in useCreateCandidateModal handleCreate
            // and display the error on the modal instead of resolving the onCreate promise and closing the modal.
            // If we were to setError here, the error would be visible on the position page instead.
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const batchCreateCandidates = async (candidates: AddApplicationWithCandidateDataDTO[]) => {
        try {
            setLoading(true);
            setError(null);

            const created = await batchCreateCandidatesApi(positionId, candidates);

            setCandidates((prev) => [...prev, ...created.candidates]);
            toast.success('Candidates created successfully');
        } catch (err) {
            const message = (err as Error).message;
            // TODO (design question): do we want to toast here?
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // Returns true when the request went through (even if some candidates failed), so the
    // confirmation modal can close; false when the whole request failed, so it stays open for a retry
    const deleteCandidates = async (candidateIds: string[]) => {
        try {
            const result = await batchDeleteCandidatesApi(positionId, candidateIds);

            // Remove every requested row: a candidate only "fails" when its application no longer
            // exists on this position (e.g. someone else already deleted it), so keeping it would be stale
            const requestedIds = new Set(candidateIds);
            setCandidates((prev) => prev.filter((c) => !requestedIds.has(c.candidate.id)));

            if (result.totalDeleted > 0) {
                toast.success(
                    `${result.totalDeleted} candidate${result.totalDeleted !== 1 ? 's' : ''} deleted successfully.`
                );
            }

            if (result.totalFailed > 0) {
                toast.error('Failed to delete candidate(s). Please try again.');
            }

            return true;
        } catch {
            toast.error('Failed to delete candidate(s). Please try again.');
            return false;
        }
    };

    const refreshCandidates = async () => {
        try {
            setCandidates(await getCandidates(positionId));
        } catch {
            toast.error('Failed to refresh candidates');
        }
    };

    // Returns true on success so the select modal can close; false keeps it open for a retry
    const assignAssessment = async (template: AssessmentTemplateListItemDTO) => {
        try {
            await assignAssessmentTemplateToPosition(positionId, template.id);
            setAssignedAssessmentTitle(template.title);
            toast.success('Assessment assigned successfully');
            // Assigning creates (or replaces) the per-candidate assessments server-side
            await refreshCandidates();
            return true;
        } catch (err) {
            toast.error((err as Error).message || 'Failed to assign assessment');
            return false;
        }
    };

    const assignReviewers = (assessmentId: string, reviewerIds: string[]) => {
        // Update immediately so the next toggle builds on this selection
        const reviewers = reviewerIds.flatMap(
            (id) => reviewerOptions.find((r) => r.id === id) ?? []
        );
        setCandidates((prev) =>
            prev.map((c) =>
                c.assessment?.id === assessmentId
                    ? { ...c, assessment: { ...c.assessment, reviewers } }
                    : c
            )
        );

        reviewerRequests.current = reviewerRequests.current.then(async () => {
            try {
                await updateAssessmentReviewers(assessmentId, reviewerIds);
            } catch (err) {
                toast.error((err as Error).message || 'Failed to update reviewers');
                await refreshCandidates();
            }
        });
    };

    const handleSendAssessments = async () => {
        try {
            setIsSendingAssessments(true);
            const result = await sendAssessmentInvitation(positionId);

            if (result.totalSent > 0) {
                toast.success(
                    `${result.totalSent} assessment invitation${result.totalSent !== 1 ? 's' : ''} sent successfully`
                );
            }

            if (result.totalFailed > 0) {
                toast.error(
                    `${result.totalFailed} invitation${result.totalFailed !== 1 ? 's' : ''} failed to send`
                );
            }

            if (result.totalSent === 0 && result.totalFailed === 0) {
                toast.info('No candidates with pending assessments to send');
            }
        } catch (err) {
            const errorMessage = (err as Error).message;
            if (errorMessage.includes('does not have an assessment template assigned')) {
                toast.error('This position does not have an assessment template assigned');
            } else {
                toast.error(errorMessage || 'Assessment invitations failed to send');
            }
        } finally {
            setIsSendingAssessments(false);
        }
    };

    return {
        candidates,
        loading,
        error,
        positionTitle,
        createCandidate,
        batchCreateCandidates,
        deleteCandidates,
        isSendingAssessments,
        handleSendAssessments,
        reviewerOptions,
        loadReviewerOptions,
        assignReviewers,
        assignedAssessmentTitle,
        assignAssessment,
    };
}
